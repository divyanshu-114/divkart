import { useState } from "react";
import { X, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toggleSearchBar } from "../../store/slices/popupSlice";

const SearchOverlay = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSearchBarOpen } = useSelector((state) => state.popup);

  if (!isSearchBarOpen) return null;

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      dispatch(toggleSearchBar());
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={() => dispatch(toggleSearchBar())}
      />

      {/* search panel */}
      <div className="relative z-10 w-full bg-card border-b border-border shadow-panel animate-slide-in-top">
        <div className="max-w-3xl mx-auto p-6 md:p-10">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm font-semibold text-muted-foreground">Search DivKart</p>
            <button
              onClick={() => dispatch(toggleSearchBar())}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" strokeWidth={2} />
            <input
              type="text"
              placeholder="What are you looking for?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-12 pr-32 py-4 bg-secondary border border-border rounded-full focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder-muted-foreground text-base font-medium transition-all"
              autoFocus
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full font-bold text-sm hover:bg-primary/90 transition-colors"
            >
              Search
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {["Electronics", "Fashion", "Sports", "Home & Garden"].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  navigate(`/products?category=${encodeURIComponent(tag)}`);
                  dispatch(toggleSearchBar());
                }}
                className="px-4 py-1.5 bg-secondary border border-border rounded-full text-sm font-semibold text-foreground hover:border-primary/40 hover:text-primary transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
