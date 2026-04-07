import { Search, Sparkles, Star, Filter } from "lucide-react";
import { categories } from "../data/products";
import ProductCard from "../components/Products/ProductCard";
import Pagination from "../components/Products/Pagination";
import AISearchModal from "../components/Products/AISearchModal";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchAllProducts } from "../store/slices/productSlice";
import { toggleAIModal } from "../store/slices/popupSlice";

const Products = () => {
  const { products, totalProducts } = useSelector((state) => state.product);

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  const query = useQuery();
  const searchTerm = query.get("search");
  const searchedCategory = query.get("category");

  const [searchQuery, setSearchQuery] = useState(searchTerm || "");
  const [selectedCategory, setSelectedCategory] = useState(
    searchedCategory || ""
  );
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [availability, setAvailability] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const dispatch = useDispatch();

  // Reset to page 1 whenever any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, priceRange, searchQuery, selectedRating, availability]);

  useEffect(() => {
    dispatch(
      fetchAllProducts({
        category: selectedCategory,
        price: `${priceRange[0]}-${priceRange[1]}`,
        search: searchQuery,
        ratings: selectedRating,
        availability: availability,
        page: currentPage,
      })
    );
  }, [
    dispatch,
    selectedCategory,
    priceRange,
    searchQuery,
    selectedRating,
    availability,
    currentPage,
  ]);

  const totalPages = Math.ceil(totalProducts / 10);

  return (
    <>
      <div className="min-h-screen pt-24 animate-fade-in bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* MOBILE FILTER TOGGLE */}
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden mb-4 p-4 border border-border flex items-center justify-center space-x-2 text-xs font-bold uppercase tracking-widest text-foreground hover:bg-secondary transition-colors"
            >
              <Filter className="w-4 h-4" strokeWidth={1.5} />
              <span>Filters</span>
            </button>

            {/* SIDEBAR FILTERS */}
            <div
              className={`lg:block ${isMobileFilterOpen ? "block" : "hidden"
                } w-full lg:w-72 space-y-10`}
            >
              <div className="border-r border-transparent lg:border-border lg:pr-8">
                <h2 className="text-sm font-bold text-foreground mb-8 uppercase tracking-[0.2em] border-b border-border pb-4">
                  Filters
                </h2>

                {/* PRICE RANGE */}
                <div className="mb-10">
                  <h3 className="text-xs font-bold text-foreground/70 mb-4 uppercase tracking-widest">
                    Price Range
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full accent-foreground"
                    />
                    <div className="flex justify-between text-xs font-bold tracking-widest text-foreground">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* RATING */}
                <div className="mb-10">
                  <h3 className="text-xs font-bold text-foreground/70 mb-4 uppercase tracking-widest">
                    Rating
                  </h3>
                  <div className="space-y-1">
                    {[4, 3, 2, 1].map((rating) => {
                      return (
                        <button
                          key={rating}
                          onClick={() =>
                            setSelectedRating(
                              selectedRating === rating ? 0 : rating
                            )
                          }
                          className={`flex items-center space-x-2 w-full p-2 transition-colors ${selectedRating === rating
                              ? "bg-foreground/5 text-foreground"
                              : "hover:bg-secondary text-foreground/70"
                            }`}
                        >
                          {[...Array(5)].map((_, i) => {
                            return (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${i < rating
                                    ? "text-foreground fill-foreground"
                                    : "text-neutral-300"
                                  }`}
                              />
                            );
                          })}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* AVAILABILITY */}
                <div className="mb-10">
                  <h3 className="text-xs font-bold text-foreground/70 mb-4 uppercase tracking-widest">
                    Availability
                  </h3>
                  <div className="space-y-1">
                    {["in-stock", "limited", "out-of-stock"].map((status) => {
                      return (
                        <button
                          key={status}
                          onClick={() =>
                            setAvailability(
                              availability === status ? "" : status
                            )
                          }
                          className={`w-full p-2 text-left text-xs uppercase tracking-widest font-semibold transition-colors ${availability === status
                              ? "bg-foreground/5 text-foreground"
                              : "hover:bg-secondary text-foreground/70"
                            }`}
                        >
                          {status.replace("-", " ")}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* CATEGORY */}
                <div className="mb-10">
                  <h3 className="text-xs font-bold text-foreground/70 mb-4 uppercase tracking-widest">
                    Category
                  </h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedCategory("")}
                      className={`w-full p-2 text-left text-xs uppercase tracking-widest font-semibold transition-colors ${!selectedCategory
                          ? "bg-foreground/5 text-foreground"
                          : "hover:bg-secondary text-foreground/70"
                        }`}
                    >
                      All Categories
                    </button>
                    {categories.map((category) => {
                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.name)}
                          className={`w-full p-2 text-left text-xs uppercase tracking-widest font-semibold transition-colors truncate gap-2 ${selectedCategory === category.name
                              ? "bg-foreground/5 text-foreground"
                              : "hover:bg-secondary text-foreground/70"
                            }`}
                        >
                           {category.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1">
              {/* SEARCH BAR */}
              <div className="mb-10 flex max-[440px]:flex-col items-center gap-4 border-b border-border pb-6">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="SEARCH COLLECTION"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-foreground placeholder-foreground/40 text-xl tracking-[0.1em] transition-all font-light"
                  />
                </div>
                <button
                  className="flex items-center justify-center p-3 px-6 whitespace-nowrap bg-foreground text-background text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity"
                  onClick={() => dispatch(toggleAIModal())}
                >
                  <Sparkles className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  <span>AI Search</span>
                </button>
              </div>

              {/* PRODUCTS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 mb-12">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="border-t border-border pt-8 mt-12 pb-12">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}

              {/* No Results */}
              {products.length === 0 && (
                <div className="text-center py-24 border border-border border-dashed">
                  <p className="text-foreground text-sm uppercase tracking-[0.2em] font-medium">
                    No products found matching your criteria.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI SEARCH MODAL */}
        <AISearchModal />
      </div>
    </>
  );
};

export default Products;
