import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Plus,
  Minus,
  Loader,
  CircleDollarSign,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import ReviewsContainer from "../components/Products/ReviewsContainer";
import { addToCartAPI } from "../store/slices/cartSlice";
import { fetchProductDetails } from "../store/slices/productSlice";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const product = useSelector((state) => state.product?.productDetails);
  const { loading, productReviews } = useSelector((state) => state.product);
  const { authUser } = useSelector((state) => state.auth);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const navigateTo = useNavigate();

  const handleAddToCart = () => {
    if (!authUser) {
      toast.error("Please login to add items to cart");
      navigateTo("/login");
      return;
    }
    dispatch(addToCartAPI({ product, quantity }));
  };

  const handleCopyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard
      .writeText(currentURL)
      .then(() => {
        toast.success("URL Copied ", currentURL);
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  };

  const handleBuyNow = () => {
    if (!authUser) {
      toast.error("Please login to buy items");
      navigateTo("/login");
      return;
    }
    dispatch(addToCartAPI({ product, quantity }));
    navigateTo("/payment");
  };

  useEffect(() => {
    dispatch(fetchProductDetails(id));
  }, [dispatch, id]);

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Product Not Found
          </h1>
          <p className="text-muted-foreground">
            The product you're looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen pt-24 animate-fade-in bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
            <div>
              <div className="border border-border p-8 mb-6">
                {product.images ? (
                  <img
                    src={product.images[selectedImage]?.url}
                    alt={product.name}
                    className="w-full h-96 object-cover"
                  />
                ) : (
                  <div className="w-full min-h-[418px] bg-secondary animate-pulse" />
                )}
              </div>
              <div className="flex space-x-4">
                {product.images &&
                  product?.images.map((image, index) => {
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`w-24 h-24 overflow-hidden border transition-all p-2 ${selectedImage === index
                            ? "border-foreground"
                            : "border-border opacity-70 hover:opacity-100"
                          }`}
                      >
                        <img
                          src={image?.url}
                          alt={`${product.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    );
                  })}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="mb-8">
                <div className="flex space-x-3 mb-6">
                  {new Date() - new Date(product.created_at) <
                    30 * 24 * 60 * 60 * 1000 && (
                      <span className="px-3 py-1 bg-secondary text-foreground text-[10px] uppercase font-bold tracking-widest border border-border">
                        NEW
                      </span>
                    )}
                  {product.ratings >= 4.5 && (
                    <span className="px-3 py-1 bg-foreground text-background text-[10px] uppercase font-bold tracking-widest">
                      TOP RATED
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold uppercase tracking-[0.2em] text-foreground mb-4 leading-snug">
                  {product.name}
                </h1>
                <div className="flex items-center space-x-6 mb-8 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => {
                      return (
                        <Star
                          key={i}
                          strokeWidth={i < Math.floor(product.ratings) ? 0 : 1}
                          className={`w-3.5 h-3.5 ${i < Math.floor(product.ratings)
                              ? "fill-foreground text-foreground"
                              : "text-muted-foreground fill-none"
                            }`}
                        />
                      );
                    })}
                  </div>
                  <span className="text-foreground">
                    {product.ratings}
                  </span>
                  <span>
                    ({productReviews?.length} reviews)
                  </span>
                </div>
                <div className="flex items-center space-x-4 mb-8">
                  <span className="text-2xl font-bold text-foreground">
                    ${product.price}
                  </span>
                </div>
                <div className="flex items-center space-x-6 mb-8 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  <span>
                    Collection: <span className="text-foreground">{product.category}</span>
                  </span>
                  <span
                    className={`${product.stock > 5
                        ? "text-foreground"
                        : product.stock > 0
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                  >
                    {product.stock > 5
                      ? "In Stock"
                      : product.stock > 0
                        ? "Limited Stock"
                        : "Out of Stock"}
                  </span>
                </div>

                <div className="border-t border-border pt-10 mt-10">
                  <div className="flex items-center space-x-6 mb-8">
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Quantity:</span>
                    <div className="flex items-center border border-border">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-3 hover:bg-secondary transition-colors"
                      >
                        <Minus className="w-3 h-3 text-foreground" />
                      </button>
                      <span className="w-12 text-center font-bold text-xs">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-3 hover:bg-secondary transition-colors"
                      >
                        <Plus className="w-3 h-3 text-foreground" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                      className="flex items-center justify-center space-x-3 py-4 bg-transparent border border-border text-foreground font-bold text-xs uppercase tracking-widest hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                    <button
                      disabled={product.stock === 0}
                      className="flex items-center justify-center space-x-3 py-4 bg-foreground text-background font-bold text-xs uppercase tracking-widest hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleBuyNow}
                    >
                      <CircleDollarSign className="w-4 h-4" />
                      <span>Buy Now</span>
                    </button>
                  </div>
                  <div className="flex items-center space-x-8 mt-8 border-t border-border pt-8">
                    <button className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-colors font-bold text-[10px] uppercase tracking-widest">
                      <Heart className="w-4 h-4" />
                      <span>Add to Wishlist</span>
                    </button>
                    <button
                      onClick={handleCopyURL}
                      className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-colors font-bold text-[10px] uppercase tracking-widest"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-border">
            <div className="flex border-b border-border bg-secondary/30">
              {["description", "reviews"].map((tab) => {
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-12 py-6 font-bold text-xs uppercase tracking-widest transition-colors ${activeTab === tab
                        ? "text-foreground bg-background border-r border-border first:border-l-0 border-l border-border"
                        : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
            <div className="p-8 md:p-12">
              {activeTab === "description" && (
                <div className="max-w-3xl">
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground mb-8">
                    Description
                  </h3>
                  <p className="text-sm text-foreground/80 leading-loose">
                    {product.description}
                  </p>
                </div>
              )}
              {activeTab === "reviews" && (
                <div className="max-w-5xl">
                  <ReviewsContainer
                    product={product}
                    productReviews={productReviews}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
