import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCartAPI } from "../../store/slices/cartSlice";
import { toast } from "react-toastify";

const ProductSlider = ({ title, products }) => {
  const scrollRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authUser } = useSelector((state) => state.auth);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!authUser) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    dispatch(addToCartAPI({ product, quantity: 1 }));
  };

  return (
    <section className="py-8">
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-extrabold text-foreground">{title}</h2>
        <div className="flex items-center gap-3">
          <Link
            to="/products"
            className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/70 transition-colors"
          >
            See more <ChevronRight className="w-4 h-4" />
          </Link>
          <div className="flex gap-1.5">
            <button
              onClick={() => scroll("left")}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-border bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={2} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-border bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
            >
              <ChevronRight className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
      >
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="flex-shrink-0 w-44 sm:w-48 group"
          >
            {/* card */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300">
              {/* image */}
              <div className="relative aspect-square bg-secondary overflow-hidden">
                <img
                  src={product?.images?.[0]?.url || product?.images?.[0] || "/placeholder.jpg"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* NEW badge */}
                {new Date() - new Date(product.created_at) < 30 * 24 * 60 * 60 * 1000 && (
                  <span className="absolute top-2 left-2 bg-accent text-accent-foreground text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                    NEW
                  </span>
                )}
              </div>

              {/* info */}
              <div className="p-3 pb-2">
                <h3 className="text-xs font-semibold text-foreground line-clamp-2 leading-snug mb-1">
                  {product.name}
                </h3>
                <p className="text-[10px] text-muted-foreground mb-2">
                  {product.stock > 0 ? "In stock" : "Out of stock"}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-foreground">₹{product.price}</span>
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-[10px] text-muted-foreground font-semibold">
                      {Number(product?.ratings) > 0 ? Number(product.ratings).toFixed(1) : "New"}
                    </span>
                  </div>
                </div>
              </div>

              {/* add to cart row */}
              <button
                onClick={(e) => handleAddToCart(product, e)}
                disabled={product.stock === 0}
                className="w-full py-2.5 bg-secondary hover:bg-primary hover:text-primary-foreground text-foreground text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed border-t border-border rounded-b-2xl"
              >
                <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                Add
              </button>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ProductSlider;
