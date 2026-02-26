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
    <nav className="fixed left-0 w-full top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border shadow-lg shadow-black/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* left hamburger menu */}
          <button onClick={() => dispatch(toggleSidebar())} className="p-2.5 rounded-xl hover:bg-secondary/80 active:scale-95 transition-all duration-200">
            <Menu className="w-6 h-6 text-foreground" />
          </button>
          {/* center logo */}
          <div className="flex-1 flex justify-center">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Divkart</h1>
          </div>
          {/* right side icons*/}
          <div className="flex items-center space-x-1">
            {/* toggle theme */}
            <button onClick={toggleTheme} className="p-2.5 rounded-xl hover:bg-secondary/80 active:scale-95 transition-all duration-200">
              {theme === "dark" ? (<Sun className="w-5 h-5 text-foreground" />) : (<Moon className="w-5 h-5 text-foreground" />)}
            </button>

            {/* search overlay */}
            <button onClick={() => dispatch(toggleSearchBar())} className="p-2.5 rounded-xl hover:bg-secondary/80 active:scale-95 transition-all duration-200">
              <Search className="w-5 h-5 text-foreground" />
            </button>

            {/* user profile */}
            <button onClick={() => dispatch(toggleAuthPopup())} className="p-2.5 rounded-xl hover:bg-secondary/80 active:scale-95 transition-all duration-200">
              <User className="w-5 h-5 text-foreground" />
            </button>

            {/* cart */}
            <button
              onClick={() => dispatch(toggleCart())}
              className="relative p-2.5 rounded-xl hover:bg-secondary/80 active:scale-95 transition-all duration-200"
            >
              <ShoppingCart className="w-5 h-5 text-foreground" />

              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-foreground text-background text-xs font-bold rounded-full flex items-center justify-center animate-scale-in shadow-md">
                  {cartItemsCount}
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

