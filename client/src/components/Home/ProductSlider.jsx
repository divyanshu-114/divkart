import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star, ShoppingCart } from "lucide-react";
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
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
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
    <>
      <section className="py-24 border-t border-border mt-12">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-wide uppercase">
            {title}
          </h2>
          <div className="flex space-x-4">
            <button
              onClick={() => scroll("left")}
              className="p-2 text-foreground border border-border hover:bg-foreground hover:text-background transition-colors duration-300 flex items-center justify-center rounded-full"
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2 text-foreground border border-border hover:bg-foreground hover:text-background transition-colors duration-300 flex items-center justify-center rounded-full"
            >
              <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex space-x-6 overflow-x-auto scrollbar-hide pb-8 scrollbar-styled"
        >
          {products.map((product) => {
            return (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="flex-shrink-0 w-72 sm:w-80 group text-left"
              >
                {/* product image */}
                <div className="relative overflow-hidden mb-6 bg-secondary aspect-[4/5] flex items-center justify-center">
                  <img
                    src={product?.images?.[0]?.url || product?.images?.[0] || "/placeholder.jpg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* badges */}
                  <div className="absolute top-4 left-4 flex flex-col space-y-2">
                    {new Date() - new Date(product.created_at) <
                      30 * 24 * 60 * 60 * 1000 && (
                        <span className="bg-background text-foreground px-3 py-1 text-[10px] font-bold tracking-widest uppercase">
                          NEW
                        </span>
                      )}
                    {product.ratings >= 4.5 && (
                      <span className="bg-foreground text-background px-3 py-1 text-[10px] font-bold tracking-widest uppercase">
                        TOP RATED
                      </span>
                    )}
                  </div>

                  {/* Quick add to cart */}
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className="absolute bottom-4 right-4 p-3 bg-background text-foreground border border-border hover:bg-foreground hover:text-background opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center rounded-full"
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>

                {/* product info */}
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-1 group-hover:opacity-70 transition-opacity uppercase tracking-widest line-clamp-1">
                    {product.name}
                  </h3>
                  
                  {/* product price */}
                  <div className="flex items-center space-x-3 mt-3">
                    <span className="text-base font-medium text-foreground">
                      ₹{product.price}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-foreground fill-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {Number(product?.ratings) > 0 ? Number(product.ratings).toFixed(1) : "New"} ({product?.review_count})
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-[10px] text-muted-foreground uppercase tracking-widest font-semibold text-opacity-80">
                    {product.stock > 5
                        ? "Available"
                        : product.stock > 0
                          ? "Low Stock"
                          : "Sold Out"}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default ProductSlider;
