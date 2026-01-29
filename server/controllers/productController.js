import {catchAsyncErrors} from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import pool from "../database/db.js";
import {v2 as cloudinary} from "cloudinary";
import { getAIRecommendation } from "../utils/getAIRecommendation.js";

export const createProduct = catchAsyncErrors(async(req,res,next)=>{
    const {name, description, price, category , stock} = req.body;
    const created_by = req.user.id;
    
    if (!name || !description || !price || !category || !stock) {
        return next(new ErrorHandler("Please provide all required fields", 400));
    }

    let uploadedImages = []
    if(req.files && req.files.images){
        const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
        
        for (const image of images) {
            const result = await cloudinary.uploader.upload(image.tempFilePath, {
                folder: "Ecommerce_Product_Images",
                width: 1000,
                crop: "scale"
            });
            uploadedImages.push({
                url: result.secure_url,
                public_id: result.public_id

            });
        }
    }
    const product = await pool.query(`insert into products (name, description, price, category, stock, images, created_by) values ($1, $2, $3, $4, $5, $6, $7) returning *`, 
        [name, description, price / 88, category, stock, JSON.stringify(uploadedImages), created_by]);

    res.status(201).json({
        success: true,
        message: "Product created successfully",
        product: product.rows[0]
    });
});

export const fetchAllproducts = catchAsyncErrors(async(req,res,next)=>{
    const {availability, price, category, ratings, search} = req.query;
     const page = parseInt(req.query.page) || 1;
     const limit = 10;
     const offset = (page - 1) * limit;
     const conditions = [];
     let values = [];
     let index = 1;

     let paginationPlaceHolders = {};

    //  Filter prodcuts based on availability
     if(availability === 'in-stock'){
        conditions.push('stock > 5');
     } else if (availability === 'limited') {
        conditions.push('stock > 0 AND stock <= 5');
     } else if (availability === 'out-of-stock') {
        conditions.push('stock = 0');
     } 

    //  Filter products based on price
     if (price) {
        const [minPrice, maxPrice] = price.split('-');
       if (minPrice && maxPrice) {
        conditions.push(`price BETWEEN $${index} AND $${index + 1}`);
        values.push(minPrice, maxPrice);
        index += 2;
       }
     }
    // filter products ny category
    if(category){
        conditions.push(`category ILIKE $${index}`)
        values.push(`%${category}%`)
        index++;
    }
    // filter products ny ratings
    if(ratings){
        conditions.push(`ratings >= $${index}`)
        values.push(ratings)
        index++;
    }
    // filter products ny search
    if(search){
        conditions.push(`p.name ILIKE $${index} OR p.description ILIKE $${index}`)
        values.push(`%${search}%`)
        index++;
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    
    // get count of filtered products
    const totalProductsResult = await pool.query(
        `SELECT COUNT(*) FROM products p ${whereClause}`, 
        values
    );
    const totalProducts = totalProductsResult.rows[0].count;

    paginationPlaceHolders.limit = `$${index}`;
    values.push(limit);
    index++;

    paginationPlaceHolders.offset = `$${index}`;
    values.push(offset);
    index++;

    // fetch with reviews
    const query =  `
        select p.*, 
        count(r.id) as review_count
        from products p 
        left join reviews r on p.id = r.product_id 
        ${whereClause}
        group by p.id
        order by p.created_at desc
        limit ${paginationPlaceHolders.limit}
        offset ${paginationPlaceHolders.offset}
        `;
    
    const result = await pool.query(query, values);

    // query for fetching new products
    const newProductsQuery = `
        select p.*, 
        count(r.id) as review_count 
        from products p left join reviews r on p.id = r.product_id 
        where p.created_at >= now() - interval '30 days'
        group by p.id
        order by p.created_at desc
        limit 8
        `;
    
    const newProductsResult = await pool.query(newProductsQuery);

     // query for fetching top rated products (rating >= 4.5)
    const topRatedQuery = `
        select p.*, 
        count(r.id) as review_count
        from products p left join reviews r on p.id = r.product_id 
        where p.ratings >= 4.5
        group by p.id
        order by p.ratings desc, p.created_at desc
        limit 8
       
        `;
    
    const topRatedResult = await pool.query(topRatedQuery);

    res.status(200).json({
        success: true,
        products: result.rows,
        totalProducts,
        newProducts: newProductsResult.rows,
        topRatedProducts: topRatedResult.rows
    });
});

export const updateProduct = catchAsyncErrors(async(req,res,next)=>{
    const {productId} = req.params;
    const {name, description, price, category, stock} = req.body;
    if (!name || !description || !price || !category || !stock) {
        return next(new ErrorHandler("Please provide all required fields", 400));
    }
    const product = await pool.query(`select * from products where id = $1 `, [productId]);
    if(product.rows.length === 0){
        return next(new ErrorHandler("Product not found", 404));
    }
   const result = await pool.query(`update products set name = $1, description = $2, price = $3, category = $4, stock = $5 where id = $6 returning *`, 
        [name, description, price / 88, category, stock, productId]);
    res.status(200).json({
        success: true,
        message: "Product updated successfully",
        updatedProduct: result.rows[0]
    });
})


export const deleteProduct = catchAsyncErrors(async(req,res,next) =>{
    const {productId} = req.params;
    const product = await pool.query(`select * from products where id = $1 `, [productId]);
    if(product.rows.length === 0){
        return next(new ErrorHandler("Product not found", 404));
    }
    const images = product.rows[0].images;
    const deletedResult = await pool.query(`delete from products where id = $1 RETURNING *`, [productId]);

    if(deletedResult.rows.length === 0){
        return next(new ErrorHandler("Product not found", 404));
    }
    if(images && images.length > 0){
        for (const image of images) {
            await cloudinary.uploader.destroy(image.public_id);
        }
    }
    res.status(200).json({
        success: true,
        message: "Product deleted successfully",
        deletedProduct: deletedResult.rows[0]
    });


})

export const fetchSingleProduct = catchAsyncErrors(async(req,res,next)=>{
    const {productId} = req.params;
    const result = await pool.query(
        ` 
            select p.*,
            coalesce(
            json_agg(
            json_build_object(
                'review_id', r.id,
                'rating', r.rating,
                'comment', r.comment,
                'reviewer', json_build_object(
                'id', u.id,
                'name', u.name,
                'avatar', u.avatar
              ))

                ) filter (where r.id is not null), '[]') as reviews
            from products p
            left join reviews r on p.id = r.product_id
            left join users u on r.user_id = u.id
            where p.id = $1
            group by p.id
        `,
        [productId]
    );

    if(result.rows.length === 0){
        return next(new ErrorHandler("Product not found", 404));
    }
    res.status(200).json({
        success: true,
        message: "Product fetched successfully",
        product: result.rows[0]
    });
})

// post product review api 
export const postProductReview = catchAsyncErrors(async(req,res,next)=>{
    const {productId} = req.params;
    const {rating, comment} = req.body;
    if(!rating || !comment){
        return next(new ErrorHandler("Please provide all required fields", 400));
    }
    const purchaseCheckQuery  = `select oi.product_id 
                           from order_items oi 
                           join orders o on o.id = oi.order_id 
                           join payments p on p.order_id = o.id 
                           where o.buyer_id =$1 and
                           oi.product_id = $2 and
                           p.payment_status = 'paid' 
                           limit 1`;
    const  {rows} = await pool.query(purchaseCheckQuery, [req.user.id, productId]);
    if(rows.length === 0){
        return res.status(403).json({
            success: false,
            message: "You are not authorized to post a review"
        })
    }

    const product = await pool.query(`select * from products where id = $1`, [productId]);

    if(product.rows.length === 0){
        return next(new ErrorHandler("Product not found", 404));
    }
    const isAlreadyReviewed = await pool.query(`select * from reviews where product_id = $1 and user_id = $2`, [productId, req.user.id]);

    let review;
    if(isAlreadyReviewed.rows.length > 0){
        review = await pool.query(`update reviews set rating = $1, comment = $2 where product_id = $3 and user_id = $4 returning *`, [rating, comment, productId, req.user.id]);
    }else{
        review = await pool.query(`insert into reviews (product_id, user_id, rating, comment) values ($1, $2, $3, $4) returning *`, [productId, req.user.id, rating, comment]);
    }

    const allReviews = await pool.query(`select avg(rating) as avg_rating from reviews where product_id = $1`, [productId]);
    const updatedProduct = await pool.query(`update products set ratings = $1 where id = $2`, [allReviews.rows[0].avg_rating, productId]);
    
    res.status(200).json({
        success: true,
        message: "Review posted successfully",
        review: review.rows[0],
        product: updatedProduct.rows[0]
    })
    
});

export  const deleteReview = catchAsyncErrors(async (req,res,next) =>{
    const { productId } = req.params;
   const review = await pool.query(`delete from reviews where product_id = $1 and user_id = $2 returning *`, [productId, req.user.id]);
   
    if(review.rows.length === 0){
        return next(new ErrorHandler("Review not found", 404));
    };


    const allReviews = await pool.query(`select avg(rating) as avg_rating from reviews where product_id = $1`, [productId]);
    const updatedProduct = await pool.query(`update products set ratings = $1 where id = $2`, [allReviews.rows[0].avg_rating, productId]);
    
    res.status(200).json({
        success: true,
        message: "Review deleted successfully",
        review: review.rows[0],
        product: updatedProduct.rows[0]
    });

})

export const fetchAIFilteredProducts = catchAsyncErrors(async (req, res, next) => {
    const {userPrompt} = req.body;
    // for test

    if(!userPrompt){
        return next(new ErrorHandler("User prompt is required", 400));
    }

    const filterKeywords = (query) =>{
        const stopWords = new Set([
        "the",
        "they",
        "them",
        "then",
        "I",
        "we",
        "you",
        "he",
        "she",
        "it",
        "is",
        "a",
        "an",
        "of",
        "and",
        "or",
        "to",
        "for",
        "from",
        "on",
        "who",
        "whom",
        "why",
        "when",
        "which",
        "with",
        "this",
        "that",
        "in",
        "at",
        "by",
        "be",
        "not",
        "was",
        "were",
        "has",
        "have",
        "had",
        "do",
        "does",
        "did",
        "so",
        "some",
        "any",
        "how",
        "can",
        "could",
        "should",
        "would",
        "there",
        "here",
        "just",
        "than",
        "because",
        "but",
        "its",
        "it's",
        "if",
        ".",
        ",",
        "!",
        "?",
        ">",
        "<",
        ";",
        "`",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
      ]);

      return query
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => !stopWords.has(word))
            .map((word) => `%${word}%`);
    //   replace ke andar jo hai usse sare punctuations replace ho jayenge space se 
    //   and split ho jayenge space ke basis par and fir return karega filter query jisme stop words nhi honge
    //   aur har word ke start and end me % add ho jayega for fuzzy matching

    }

    const keywords = filterKeywords(userPrompt);

    // step 1 : Basic sql fetching
    

    const result = await pool.query(
        `select * from products
        where name ILIKE  ANY($1)
        or description ILIKE ANY($1)
        or category ILIKE ANY($1)
        limit 200`,
        [keywords]
    )

    const filteredProducts = result.rows;

    if(filteredProducts.length === 0) {
        return res.status(200).json({
            success: true,
            message: "No products found matching your prompt",
            products : []
        });
    }
    // console.log(userPrompt)
    // step 2 : AI filtering 
    const {success,products} = await getAIRecommendation(req,res,userPrompt , filteredProducts);

    res.status(200).json({
        success : success,
        message: "AI filtered products",
        products : products
    });


});

