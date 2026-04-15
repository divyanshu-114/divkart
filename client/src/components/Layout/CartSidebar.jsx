import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCartAPI, updateCartQuantityAPI } from "../../store/slices/cartSlice";
import { toggleCart } from "../../store/slices/popupSlice";

const CartSidebar = () => {
  const dispatch = useDispatch();
  const { isCartOpen } = useSelector((state) => state.popup);
  const { cart } = useSelector((state) => state.cart);

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      dispatch(removeFromCartAPI(id));
    } else {
      dispatch(updateCartQuantityAPI({ id, quantity }));
    }
  };

  let total = 0;
  if (cart) {
    total = cart.reduce((acc, item) => acc + Number(item.product.price) * item.quantity, 0);
  }

  if (!isCartOpen) return null;

  return (
    <>
      {/* overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm animate-fade-in"
        onClick={() => dispatch(toggleCart())}
      />

      {/* cart panel */}
      <div className="fixed right-0 top-0 h-full w-96 z-50 bg-card border-l border-border animate-slide-in-right overflow-y-auto shadow-panel flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-brand-green shrink-0">
          <div className="flex items-center gap-2 text-white">
            <ShoppingBag className="w-5 h-5" strokeWidth={2} />
            <h2 className="text-base font-bold">My Cart</h2>
          </div>
          <button
            onClick={() => dispatch(toggleCart())}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {cart && cart.length === 0 ? (
            <div className="text-center py-16 flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">Your cart is empty</p>
                <p className="text-sm text-muted-foreground">Add some products to get started!</p>
              </div>
              <Link
                to="/products"
                onClick={() => dispatch(toggleCart())}
                className="mt-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-bold text-sm hover:bg-primary/90 transition-colors"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cart && cart.map((item) => (
                <div key={item.product.id} className="flex items-start gap-3 bg-secondary/50 rounded-xl p-3">
                  <img
                    src={item.product.images?.[0]?.url || item.product.images?.[0]}
                    alt={item.product.name}
                    className="h-20 w-16 object-cover rounded-lg shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 mb-1">
                      {item.product.name}
                    </h3>
                    <p className="text-primary font-bold text-sm mb-2.5">₹{item.product.price}</p>
                    <div className="flex items-center justify-between">
                      {/* qty controls */}
                      <div className="flex items-center gap-1 bg-card rounded-full border border-border px-1 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
                        >
                          <Minus className="w-3 h-3 text-foreground" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
                        >
                          <Plus className="w-3 h-3 text-foreground" />
                        </button>
                      </div>
                      <button
                        onClick={() => dispatch(removeFromCartAPI(item.id))}
                        className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors text-muted-foreground"
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer total + CTA */}
        {cart && cart.length > 0 && (
          <div className="shrink-0 border-t border-border p-5 bg-card">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold text-muted-foreground">Subtotal</span>
              <span className="text-lg font-bold text-foreground">₹{total.toFixed(2)}</span>
            </div>
            <Link
              to="/cart"
              onClick={() => dispatch(toggleCart())}
              className="w-full flex items-center justify-center bg-primary text-primary-foreground rounded-full py-3 font-bold text-sm hover:bg-primary/90 transition-colors"
            >
              View Cart & Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
