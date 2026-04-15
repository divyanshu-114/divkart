import { Plus, Minus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeFromCartAPI, updateCartQuantityAPI } from "../store/slices/cartSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading } = useSelector((state) => state.cart);
  const { authUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (authUser) {
      dispatch(fetchCart());
      dispatch({ type: "order/resetOrderStep" });
    }
  }, [dispatch, authUser]);

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      dispatch(removeFromCartAPI(id));
    } else {
      dispatch(updateCartQuantityAPI({ id, quantity }));
    }
  };

  let total = 0;
  if (cart) total = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  const shipping = total >= 500 ? 0 : 49;
  const tax = total * 0.18;
  const grandTotal = total + shipping + tax;

  if (!authUser) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center bg-background">
        <div className="text-center w-full max-w-sm mx-auto p-10 bg-card border border-border rounded-2xl shadow-card">
          <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" strokeWidth={1.5} />
          <h1 className="text-lg font-bold text-foreground mb-2">Sign in to view cart</h1>
          <p className="text-sm text-muted-foreground mb-6">You need to be logged in to view your cart.</p>
          <Link to="/login" className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold text-sm hover:bg-primary/90 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex justify-center items-center bg-background">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center bg-background">
        <div className="text-center w-full max-w-sm mx-auto p-10 bg-card border border-border rounded-2xl shadow-card">
          <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" strokeWidth={1.5} />
          <h1 className="text-lg font-bold text-foreground mb-2">Your cart is empty</h1>
          <p className="text-sm text-muted-foreground mb-6">Looks like you haven't added anything yet.</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold text-sm hover:bg-primary/90 transition-colors"
          >
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen pt-6 pb-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-foreground">Shopping Cart</h1>
          <p className="text-sm text-muted-foreground mt-1">{cartItemsCount} item{cartItemsCount !== 1 ? "s" : ""}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const product = item.product || {};
              return (
                <div
                  key={item.id}
                  className="bg-card rounded-2xl border border-border p-4 shadow-card flex gap-4 animate-fade-in-up"
                >
                  <Link to={`/product/${product.id}`} className="shrink-0">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product?.images?.[0]?.url || product?.images?.[0] || "/placeholder.jpg"}
                        alt={product.name}
                        className="w-24 h-28 object-cover rounded-xl"
                      />
                    ) : (
                      <div className="w-24 h-28 bg-secondary rounded-xl" />
                    )}
                  </Link>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <Link to={`/product/${product.id}`} className="hover:text-primary transition-colors">
                        <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 mb-1">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-muted-foreground font-medium">{product.category}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1 bg-secondary rounded-full border border-border px-1 py-0.5">
                        <button
                          disabled={item.quantity === 1}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-card transition-colors disabled:opacity-40"
                        >
                          <Minus className="w-3 h-3 text-foreground" />
                        </button>
                        <span className="w-7 text-center font-bold text-xs">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-card transition-colors"
                        >
                          <Plus className="w-3 h-3 text-foreground" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-sm font-extrabold text-foreground">
                          ₹{(product.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => dispatch(removeFromCartAPI(item.id))}
                          className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl border border-border p-6 shadow-card sticky top-24">
              <h2 className="text-base font-bold text-foreground mb-5 pb-4 border-b border-border">
                Order Summary
              </h2>

              <div className="space-y-3 mb-5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({cartItemsCount} items)</span>
                  <span className="font-semibold">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={`font-semibold ${shipping === 0 ? "text-green-600" : ""}`}>
                    {shipping === 0 ? "Free" : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (18%)</span>
                  <span className="font-semibold">₹{tax.toFixed(2)}</span>
                </div>

                {shipping > 0 && (
                  <p className="text-xs text-primary font-semibold">
                    Add ₹{(500 - total).toFixed(0)} more for free shipping!
                  </p>
                )}

                <div className="border-t border-border pt-4 mt-3 flex justify-between items-center">
                  <span className="font-bold text-base">Total</span>
                  <span className="font-extrabold text-xl text-foreground">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <Link
                to="/payment"
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-primary-foreground rounded-full font-bold text-sm hover:bg-primary/90 transition-colors mb-3"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/products"
                className="w-full flex items-center justify-center py-3.5 bg-transparent border border-border text-foreground rounded-full font-semibold text-sm hover:bg-secondary transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
