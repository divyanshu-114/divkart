import { Menu, User, ShoppingCart, Sun, Moon, Search, Leaf } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { toggleSearchBar, toggleSidebar, toggleAuthPopup, toggleCart } from "../../store/slices/popupSlice";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  let cartItemsCount = 0;
  if (cart) {
    cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  }

  return (
    <>
      {/* Top announcement banner */}
      <div className="bg-accent text-accent-foreground text-[11px] font-bold tracking-wide text-center py-2 w-full">
        🌿 Free delivery on orders over ₹500 — Get it within 45 min
      </div>

      {/* Main navbar — always forest green */}
      <nav className="sticky top-0 left-0 w-full z-50 bg-brand-green shadow-panel transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Left — hamburger + search (desktop) */}
            <div className="flex items-center gap-2 flex-1">
              <button
                onClick={() => dispatch(toggleSidebar())}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                <Menu className="w-5 h-5" strokeWidth={2} />
              </button>
              <button
                onClick={() => dispatch(toggleSearchBar())}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white/70 hover:text-white text-sm transition-all duration-200 w-52"
              >
                <Search className="w-4 h-4" strokeWidth={2} />
                <span className="text-xs">Search products…</span>
              </button>
            </div>

            {/* Center — logo */}
            <div className="flex-1 flex justify-center items-center">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-accent rounded-full flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-accent-foreground" strokeWidth={2.5} />
                </div>
                <h1 className="text-xl font-extrabold text-white tracking-tight">
                  DivKart
                </h1>
              </div>
            </div>

            {/* Right — icons */}
            <div className="flex items-center justify-end gap-1 sm:gap-2 flex-1">
              <button
                onClick={toggleTheme}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                {theme === "dark"
                  ? <Sun className="w-5 h-5" strokeWidth={2} />
                  : <Moon className="w-5 h-5" strokeWidth={2} />}
              </button>

              {/* Mobile search */}
              <button
                onClick={() => dispatch(toggleSearchBar())}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 md:hidden"
              >
                <Search className="w-5 h-5" strokeWidth={2} />
              </button>

              <button
                onClick={() => dispatch(toggleAuthPopup())}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                <User className="w-5 h-5" strokeWidth={2} />
              </button>

              <button
                onClick={() => dispatch(toggleCart())}
                className="relative flex items-center gap-1.5 px-3 py-2 bg-accent text-accent-foreground rounded-full font-bold text-sm hover:bg-accent/90 transition-all duration-200"
              >
                <ShoppingCart className="w-4 h-4" strokeWidth={2.5} />
                {cartItemsCount > 0 && (
                  <span className="text-xs font-extrabold">{cartItemsCount}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
