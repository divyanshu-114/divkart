import { useState } from "react";
import { X, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toggleSearchBar } from "../../store/slices/popupSlice";
const SearchOverlay = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {isSearchBarOpen} = useSelector((state) => state.popup);

  if(!isSearchBarOpen) return null;


  // if we search for something then navigate to products page with search query
  const handleSearch = () => {
    if(searchQuery.trim() !=="") {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);  
      dispatch(toggleSearchBar());
    }
  };

  return <>
  <div className="fixed inset-0 z-50">
    <div className="absolute inset-0 bg-background/90 backdrop-blur-sm animate-fade-in" onClick={()=>dispatch(toggleSearchBar())}></div>
    
    <div className="relative z-10 w-full bg-background border-b border-border shadow-2xl animate-slide-in-top">
      <div className="max-w-4xl mx-auto p-6 md:p-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-foreground">Search Collection</h2>
          <button onClick={()=>dispatch(toggleSearchBar())} className="p-2 text-foreground hover:opacity-60 transition-opacity flex items-center justify-center">
            <X className="w-6 h-6" strokeWidth={1} />
          </button>
        </div>

        <div className="relative border-b-2 border-foreground mb-8">
          <button onClick={handleSearch} className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 text-foreground hover:opacity-60 transition-opacity">
            <Search className="w-6 h-6" strokeWidth={1} />
          </button>
          <input 
            type='text' 
            placeholder="WHAT ARE YOU LOOKING FOR?" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full pr-12 py-4 bg-transparent border-none focus:outline-none focus:ring-0 text-foreground placeholder-foreground/40 text-xl tracking-widest font-light uppercase transition-all"
            autoFocus
          />
        </div>

        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Start typing to explore products</p>
        </div>
      </div>
    </div>
  </div>
  </>;
};

export default SearchOverlay;
