import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastContainer } from "react-toastify";

// Redux
import { getUser } from "./store/slices/authSlice";

// Layout Components
import Navbar from "./components/Layout/Navbar";
import Sidebar from "./components/Layout/Sidebar";
import SearchOverlay from "./components/Layout/SearchOverlay";
import CartSidebar from "./components/Layout/CartSidebar";
import ProfilePanel from "./components/Layout/ProfilePanel";
import LoginModal from "./components/Layout/LoginModal";
import Footer from "./components/Layout/Footer";

// Pages
import Index from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Payment from "./pages/Payment";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import { useSelector } from "react-redux";
import { fetchAllProducts } from "./store/slices/productSlice";

const App = () => {
  const {authUser,isCheckingAuth} = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAllProducts({
      category:"",
      price:"0-100000",
      search:"",
      availability:"",
      ratings:"",
      page:1
    }));
  },[dispatch]);

  const {products} = useSelector(state => state.product);


  if ((isCheckingAuth && !authUser) || !products) {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
    </div>
  );
}

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navbar />
          <Sidebar />
          <SearchOverlay />
          <CartSidebar />
          <ProfilePanel />
          <LoginModal />

          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/password/reset/:token" element={<Index />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>

          <Footer />
        </div>
        <ToastContainer />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
