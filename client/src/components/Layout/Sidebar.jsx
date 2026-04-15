import { X, Home, Package, Info, HelpCircle, ShoppingCart, List, Phone, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../../store/slices/popupSlice";

const Sidebar = () => {
  const { authUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const menuItems = [
    { name: "Home",      icon: Home,         path: "/" },
    { name: "Products",  icon: Package,       path: "/products" },
    { name: "About",     icon: Info,          path: "/about" },
    { name: "FAQ",       icon: HelpCircle,    path: "/faq" },
    { name: "Contact",   icon: Phone,         path: "/contact" },
    { name: "Cart",      icon: ShoppingCart,  path: "/cart" },
    authUser && { name: "My Orders", icon: List, path: "/orders" },
  ];

  const { isSidebarOpen } = useSelector((state) => state.popup);
  if (!isSidebarOpen) return null;

  return (
    <>
      {/* overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm animate-fade-in"
        onClick={() => dispatch(toggleSidebar())}
      />

      {/* sidebar panel */}
      <div className="fixed left-0 top-0 h-full w-72 z-50 bg-card border-r border-border animate-slide-in-left shadow-panel">
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-brand-green">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-accent rounded-full flex items-center justify-center">
              <Leaf className="w-4 h-4 text-accent-foreground" strokeWidth={2.5} />
            </div>
            <span className="text-white font-extrabold text-lg">DivKart</span>
          </div>
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* nav items */}
        <nav className="p-4">
          <ul className="space-y-1">
            {menuItems.filter(Boolean).map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={() => dispatch(toggleSidebar())}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground font-semibold text-sm hover:bg-primary hover:text-primary-foreground transition-all duration-200 group"
                >
                  <item.icon className="w-5 h-5 shrink-0" strokeWidth={2} />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center font-medium">
            Your trusted shopping companion 🌿
          </p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
