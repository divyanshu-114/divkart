import {catchAsyncErrors} from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import pool from "../database/db.js";
import {v2 as cloudinary} from "cloudinary";

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
        conditions.push(`rating >= $${index}`)
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