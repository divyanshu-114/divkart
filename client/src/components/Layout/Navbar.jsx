import { Menu, User, ShoppingCart, Sun, Moon, Search } from "lucide-react";
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
  return <>
    <div className="bg-foreground text-background text-[10px] sm:text-xs font-bold tracking-[0.2em] text-center py-2 uppercase w-full">
      Free global shipping on orders over $150
    </div>
    <nav className="sticky top-0 left-0 w-full z-50 bg-background border-b border-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* left side */}
          <div className="flex items-center space-x-4 flex-1">
            <button onClick={() => dispatch(toggleSidebar())} className="p-2 text-foreground hover:opacity-60 transition-opacity duration-300">
              <Menu className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <button onClick={() => dispatch(toggleSearchBar())} className="p-2 text-foreground hover:opacity-60 transition-opacity duration-300 hidden md:block">
              <Search className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>
          
          {/* center logo */}
          <div className="flex-1 flex justify-center items-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-[0.25em] uppercase">Divkart</h1>
          </div>
          
          {/* right side icons*/}
          <div className="flex items-center justify-end space-x-2 sm:space-x-4 flex-1">
            <button onClick={toggleTheme} className="p-2 text-foreground hover:opacity-60 transition-opacity duration-300">
              {theme === "dark" ? (<Sun className="w-5 h-5" strokeWidth={1.5} />) : (<Moon className="w-5 h-5" strokeWidth={1.5} />)}
            </button>

            <button onClick={() => dispatch(toggleSearchBar())} className="p-2 text-foreground hover:opacity-60 transition-opacity duration-300 md:hidden">
              <Search className="w-5 h-5" strokeWidth={1.5} />
            </button>

            <button onClick={() => dispatch(toggleAuthPopup())} className="p-2 text-foreground hover:opacity-60 transition-opacity duration-300">
              <User className="w-5 h-5" strokeWidth={1.5} />
            </button>

            <button
              onClick={() => dispatch(toggleCart())}
              className="relative p-2 text-foreground hover:opacity-60 transition-opacity duration-300 flex items-center"
            >
              <ShoppingCart className="w-5 h-5" strokeWidth={1.5} />
              {cartItemsCount > 0 && (
                <span className="ml-1.5 text-xs font-semibold tracking-wider">
                  ({cartItemsCount})
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  </>;
};

export default Navbar;

