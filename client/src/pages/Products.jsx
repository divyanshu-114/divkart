import { Search, Sparkles, Star, SlidersHorizontal, X } from "lucide-react";
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

  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const searchTerm = query.get("search");
  const searchedCategory = query.get("category");

  const [searchQuery, setSearchQuery] = useState(searchTerm || "");
  const [selectedCategory, setSelectedCategory] = useState(searchedCategory || "");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [availability, setAvailability] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const dispatch = useDispatch();

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
        availability,
        page: currentPage,
      })
    );
  }, [dispatch, selectedCategory, priceRange, searchQuery, selectedRating, availability, currentPage]);

  const totalPages = Math.ceil(totalProducts / 10);

  const activeFiltersCount = [
    selectedCategory,
    priceRange[1] < 10000 ? "price" : "",
    selectedRating ? "rating" : "",
    availability,
  ].filter(Boolean).length;

  return (
    <>
      <div className="min-h-screen pt-6 pb-12 animate-fade-in bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Page title */}
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-foreground">All Products</h1>
            {totalProducts > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                {totalProducts} product{totalProducts !== 1 ? "s" : ""} found
              </p>
            )}
          </div>

          {/* Search bar */}
          <div className="flex gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={2} />
              <input
                type="text"
                placeholder="Search products…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-full text-sm font-medium text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all shadow-card"
              />
            </div>
            <button
              className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-full font-bold text-sm hover:bg-primary/90 transition-all shadow-card shrink-0"
              onClick={() => dispatch(toggleAIModal())}
            >
              <Sparkles className="w-4 h-4" strokeWidth={2} />
              <span className="hidden sm:inline">AI Search</span>
            </button>
            {/* mobile filter toggle */}
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 px-4 py-3 bg-card border border-border rounded-full font-semibold text-sm text-foreground hover:border-primary/40 transition-all shadow-card relative"
            >
              <SlidersHorizontal className="w-4 h-4" strokeWidth={2} />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-accent text-accent-foreground text-[10px] font-extrabold rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">

            {/* ── SIDEBAR FILTERS ── */}
            <div className={`lg:block ${isMobileFilterOpen ? "block" : "hidden"} w-full lg:w-64 shrink-0`}>
              <div className="bg-card rounded-2xl border border-border p-5 shadow-card sticky top-24">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-sm font-bold text-foreground">Filters</h2>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={() => {
                        setSelectedCategory("");
                        setPriceRange([0, 10000]);
                        setSelectedRating(0);
                        setAvailability("");
                      }}
                      className="text-xs font-semibold text-primary hover:text-primary/70 transition-colors flex items-center gap-1"
                    >
                      <X className="w-3 h-3" /> Clear all
                    </button>
                  )}
                </div>

                {/* PRICE RANGE */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wide">Price Range</h3>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-xs font-semibold text-foreground mt-1.5">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>

                {/* RATING */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wide">Rating</h3>
                  <div className="space-y-1">
                    {[4, 3, 2, 1].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setSelectedRating(selectedRating === rating ? 0 : rating)}
                        className={`flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm transition-all ${
                          selectedRating === rating
                            ? "bg-primary/10 text-primary font-semibold"
                            : "hover:bg-secondary text-foreground/70"
                        }`}
                      >
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/20"
                            }`}
                          />
                        ))}
                        <span className="text-xs font-semibold ml-0.5">& up</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* AVAILABILITY */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wide">Availability</h3>
                  <div className="flex flex-wrap gap-2">
                    {["in-stock", "limited", "out-of-stock"].map((status) => (
                      <button
                        key={status}
                        onClick={() => setAvailability(availability === status ? "" : status)}
                        className={`pill-btn text-xs ${availability === status ? "pill-btn-active" : "pill-btn-inactive"}`}
                      >
                        {status.replace("-", " ")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CATEGORY */}
                <div>
                  <h3 className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wide">Category</h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedCategory("")}
                      className={`w-full px-3 py-2 rounded-xl text-sm font-semibold text-left transition-all ${
                        !selectedCategory ? "bg-primary/10 text-primary" : "hover:bg-secondary text-foreground/70"
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.name)}
                        className={`w-full px-3 py-2 rounded-xl text-sm font-semibold text-left transition-all truncate ${
                          selectedCategory === category.name
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-secondary text-foreground/70"
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── PRODUCTS GRID ── */}
            <div className="flex-1 min-w-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 pb-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}

              {/* No results */}
              {products.length === 0 && (
                <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border">
                  <div className="text-4xl mb-4">🔍</div>
                  <p className="text-foreground font-semibold mb-1">No products found</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <AISearchModal />
      </div>
    </>
  );
};

export default Products;
