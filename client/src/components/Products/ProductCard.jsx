import React from "react";
import { Star, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCartAPI } from "../../store/slices/cartSlice";
import { toast } from "react-toastify";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authUser } = useSelector((state) => state.auth);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!authUser) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    dispatch(addToCartAPI({ product, quantity: 1 }));
  };

  const stockStatus = product.stock > 5
    ? { label: "In Stock",      cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" }
    : product.stock > 0
    ? { label: "Limited Stock", cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" }
    : { label: "Out of Stock",  cls: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" };

  return (
    <Link
      to={`/product/${product.id}`}
      className="product-card group block"
    >
      {/* image area */}
      <div className="relative overflow-hidden aspect-square bg-secondary">
        {product?.images?.length > 0 ? (
          <img
            src={product?.images?.[0]?.url || product?.images?.[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-secondary animate-pulse" />
        )}

        {/* badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {new Date() - new Date(product.created_at) < 30 * 24 * 60 * 60 * 1000 && (
            <span className="bg-accent text-accent-foreground text-[9px] font-extrabold px-2.5 py-1 rounded-full">
              NEW
            </span>
          )}
          {product.ratings >= 4.5 && (
            <span className="bg-primary text-primary-foreground text-[9px] font-extrabold px-2.5 py-1 rounded-full">
              TOP RATED
            </span>
          )}
        </div>
      </div>

      {/* info */}
      <div className="p-4 pb-3">
        <h3 className="text-sm font-semibold text-foreground mb-1.5 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* stars */}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < Math.floor(product.ratings)
                  ? "text-amber-400 fill-amber-400"
                  : "text-muted-foreground/30"
              }`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({product.review_count})</span>
        </div>

        {/* price + stock */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-extrabold text-foreground">₹{product.price}</span>
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${stockStatus.cls}`}>
            {stockStatus.label}
          </span>
        </div>
      </div>

      {/* add to cart button */}
      <button
        onClick={handleAddToCart}
        disabled={product.stock === 0}
        className="w-full py-3 bg-secondary hover:bg-primary hover:text-primary-foreground text-foreground text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed border-t border-border rounded-b-2xl"
      >
        <Plus className="w-4 h-4" strokeWidth={2.5} />
        Add to Cart
      </button>
    </Link>
  );
};

export default ProductCard;
