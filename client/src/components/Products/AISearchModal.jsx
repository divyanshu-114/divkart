import React, { useState } from "react";
import { X, Search, Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductWithAI } from "../../store/slices/productSlice";
import { toggleAIModal } from "../../store/slices/popupSlice";

const AISearchModal = () => {
  const [userPrompt, setUserPrompt] = useState("");
  const { aiSearching } = useSelector((state) => state.product);
  const { isAIPopupOpen } = useSelector((state) => state.popup);
  const dispatch = useDispatch();

  const exampleText = [
    "Best gaming laptop under ₹80,000 with RTX 4060",
    "Wireless earbuds with noise cancellation under ₹5,000",
    "Stylish running shoes for men size 10",
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchProductWithAI(userPrompt));
  };

  if (!isAIPopupOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={() => dispatch(toggleAIModal())}
    >
      <div
        className="bg-card rounded-2xl border border-border w-full max-w-xl shadow-panel animate-scale-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="bg-brand-green px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-accent rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-accent-foreground" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-white font-bold text-base">AI Product Search</h2>
              <p className="text-white/60 text-xs">Powered by AI</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(toggleAIModal())}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* body */}
        <div className="p-6">
          <p className="text-sm text-muted-foreground mb-5">
            Describe what you're looking for and our AI will find the perfect products for you.
          </p>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={2} />
              <input
                type="text"
                placeholder="e.g. 'Wireless headphones with good bass under ₹3,000'"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-secondary border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 text-sm text-foreground placeholder-muted-foreground transition-all"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={aiSearching || !userPrompt.trim()}
              className={`w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${aiSearching ? "animate-pulse" : ""}`}
            >
              {aiSearching ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  <span>AI is searching…</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" strokeWidth={2} />
                  <span>Search with AI</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-5">
            <p className="text-xs font-semibold text-muted-foreground mb-2.5">Try these examples:</p>
            <div className="flex flex-wrap gap-2">
              {exampleText.map((example) => (
                <button
                  key={example}
                  onClick={() => setUserPrompt(example)}
                  className="px-3 py-1.5 bg-secondary border border-border rounded-full text-xs font-semibold text-foreground hover:border-primary/40 hover:text-primary transition-all"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISearchModal;
