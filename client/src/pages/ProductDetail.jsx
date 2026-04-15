import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Star, ShoppingCart, Heart, Share2, Plus, Minus, Loader, CircleDollarSign, ChevronLeft,
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
    if (!authUser) { toast.error("Please login to add items to cart"); navigateTo("/login"); return; }
    dispatch(addToCartAPI({ product, quantity }));
  };

  const handleCopyURL = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => toast.success("Link copied!"))
      .catch(() => toast.error("Failed to copy URL."));
  };

  const handleBuyNow = () => {
    if (!authUser) { toast.error("Please login to buy items"); navigateTo("/login"); return; }
    dispatch(addToCartAPI({ product, quantity }));
    navigateTo("/payment");
  };

  useEffect(() => {
    dispatch(fetchProductDetails(id));
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-background">
        <div className="text-center p-12 bg-card rounded-2xl border border-border shadow-card">
          <div className="text-5xl mb-4">😕</div>
          <h1 className="text-xl font-bold text-foreground mb-2">Product Not Found</h1>
          <p className="text-muted-foreground text-sm mb-6">The product you're looking for does not exist.</p>
          <Link to="/products" className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-bold text-sm hover:bg-primary/90 transition-colors">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const stockStatus = product.stock > 5
    ? { label: "In Stock",      cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" }
    : product.stock > 0
    ? { label: "Limited Stock", cls: "bg-amber-100 text-amber-700" }
    : { label: "Out of Stock",  cls: "bg-red-100 text-red-600" };

  return (
    <div className="min-h-screen pt-6 pb-16 animate-fade-in bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-foreground transition-colors">Products</Link>
          <span>/</span>
          <span className="text-foreground font-semibold truncate max-w-[200px]">{product.name}</span>
        </div>

        {/* Main product grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">

          {/* Left — images */}
          <div>
            <div className="bg-card rounded-2xl border border-border overflow-hidden mb-3 shadow-card">
              {product.images ? (
                <img
                  src={product.images[selectedImage]?.url}
                  alt={product.name}
                  className="w-full h-80 sm:h-[420px] object-cover"
                />
              ) : (
                <div className="w-full h-80 bg-secondary animate-pulse" />
              )}
            </div>
            {/* thumbnail row */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {product.images?.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`shrink-0 w-20 h-20 overflow-hidden rounded-xl border-2 transition-all ${
                    selectedImage === index
                      ? "border-primary shadow-card"
                      : "border-border opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={image?.url}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right — info */}
          <div className="flex flex-col">
            {/* badges */}
            <div className="flex gap-2 mb-3">
              {new Date() - new Date(product.created_at) < 30 * 24 * 60 * 60 * 1000 && (
                <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-bold rounded-full">NEW</span>
              )}
              {product.ratings >= 4.5 && (
                <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">TOP RATED</span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3 leading-snug">
              {product.name}
            </h1>

            {/* Stars */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.ratings) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/25"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-foreground">{product.ratings}</span>
              <span className="text-sm text-muted-foreground">({productReviews?.length} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl font-extrabold text-foreground">₹{product.price}</span>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="text-sm font-semibold text-muted-foreground">
                Category: <span className="text-foreground">{product.category}</span>
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${stockStatus.cls}`}>
                {stockStatus.label}
              </span>
            </div>

            {/* Quantity + CTAs */}
            <div className="bg-secondary/50 rounded-2xl p-5 border border-border">
              {/* quantity selector */}
              <div className="flex items-center gap-4 mb-5">
                <span className="text-sm font-semibold text-muted-foreground">Quantity</span>
                <div className="flex items-center gap-1 bg-card rounded-full border border-border px-1 py-0.5">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5 text-foreground" />
                  </button>
                  <span className="w-10 text-center font-bold text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-foreground" />
                  </button>
                </div>
              </div>

              {/* action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 border-2 border-primary text-primary rounded-full font-bold text-sm hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-4 h-4" strokeWidth={2} />
                  Add to Cart
                </button>
                <button
                  disabled={product.stock === 0}
                  onClick={handleBuyNow}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-primary text-primary-foreground rounded-full font-bold text-sm hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <CircleDollarSign className="w-4 h-4" strokeWidth={2} />
                  Buy Now
                </button>
              </div>

              {/* wishlist + share */}
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border">
                <button className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
                  <Heart className="w-4 h-4" strokeWidth={2} />
                  Wishlist
                </button>
                <button
                  onClick={handleCopyURL}
                  className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Share2 className="w-4 h-4" strokeWidth={2} />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Description / Reviews tabs */}
        <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
          {/* tab bar */}
          <div className="flex border-b border-border bg-secondary/30">
            {["description", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 font-bold text-sm capitalize transition-all ${
                  activeTab === tab
                    ? "text-primary border-b-2 border-primary bg-card"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === "description" && (
              <div className="max-w-3xl">
                <p className="text-sm text-foreground/80 leading-loose">{product.description}</p>
              </div>
            )}
            {activeTab === "reviews" && (
              <div className="max-w-4xl">
                <ReviewsContainer product={product} productReviews={productReviews} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
