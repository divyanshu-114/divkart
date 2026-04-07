import { Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  removeFromCartAPI,
  updateCartQuantityAPI,
} from "../store/slices/cartSlice";
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
      dispatch({ type: 'order/resetOrderStep' });
    }
  }, [dispatch, authUser]);

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      dispatch(removeFromCartAPI(id));
    } else {
      dispatch(updateCartQuantityAPI({ id, quantity }));
    }
  };

  const handleRemove = (id) => {
    dispatch(removeFromCartAPI(id));
  };

  let total = 0;
  if (cart) {
    total = cart.reduce(
      (sum, item) => sum + (item.product?.price || 0) * item.quantity,
      0
    );
  }

  if (!authUser) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-background">
        <div className="text-center w-full max-w-xl mx-auto p-12 border border-border">
          <h1 className="text-lg font-bold uppercase tracking-[0.2em] text-foreground mb-6">Please Login</h1>
          <p className="text-xs tracking-widest uppercase font-semibold text-muted-foreground mb-10">You need to be logged in to view your cart.</p>
          <Link
            to={"/login"}
            className="inline-flex justify-center w-full px-8 py-4 bg-foreground text-background font-bold text-xs tracking-widest uppercase transition-opacity hover:opacity-80"
          >
            <span>Login Now</span>
          </Link>
        </div>
      </div>
    );
  }

  let cartItemsCount = 0;
  if (cart) {
    cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  }

  if (loading) {
    return <div className="min-h-screen pt-32 flex justify-center text-xs tracking-widest uppercase font-bold text-muted-foreground">Loading...</div>
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-background">
        <div className="text-center w-full max-w-xl mx-auto p-12 border border-border">
          <h1 className="text-lg font-bold uppercase tracking-[0.2em] text-foreground mb-6">
            Your Cart is Empty.
          </h1>
          <p className="text-xs tracking-widest uppercase font-semibold text-muted-foreground mb-10">
            Looks like you have not added any items to your cart yet.
          </p>
          <Link
            to={"/products"}
            className="inline-flex items-center justify-center w-full space-x-3 px-8 py-4 bg-foreground text-background font-bold text-xs tracking-widest uppercase transition-opacity hover:opacity-80"
          >
            <span>Continue Shopping</span> <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen pt-24 pb-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-12 border-b border-border pb-6 flex items-baseline justify-between">
            <h1 className="text-2xl font-bold uppercase tracking-[0.2em] text-foreground">
              Shopping Cart
            </h1>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {cartItemsCount} item{cartItemsCount !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-0">
              {cart.map((item) => {
                const product = item.product || {};
                return (
                  <div key={item.id} className="border-b border-border pb-8 mb-8 animate-fade-in-up">
                    <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8">
                      <Link
                        to={`/product/${product.id}`}
                        className="flex-shrink-0"
                      >
                        {product.images && product.images.length > 0 ?
                          <img
                          src={product?.images?.[0]?.url || product?.images?.[0] || "/placeholder.jpg"}
                          alt={product.name}
                            className="w-32 h-40 object-cover"
                          /> : <div className="w-32 h-40 bg-secondary" />
                        }
                      </Link>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <Link
                            to={`/product/${product.id}`}
                            className="block hover:opacity-70 transition-opacity"
                          >
                            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground mb-2 leading-relaxed">
                              {product.name}
                            </h3>
                          </Link>
                          <p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase mb-4">
                            {product.category}
                          </p>
                          <p className="text-sm font-bold text-foreground mb-4">
                            ${product.price}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center border border-border">
                            <button
                              disabled={item.quantity === 1}
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="p-3 hover:bg-secondary transition-colors"
                            >
                              <Minus className="w-3 h-3 text-foreground" />
                            </button>
                            <span className="w-10 text-center font-bold text-xs">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="p-3 hover:bg-secondary transition-colors"
                            >
                              <Plus className="w-3 h-3 text-foreground" />
                            </button>
                          </div>

                          <div className="flex items-center space-x-6">
                            <button
                              onClick={() =>
                                handleRemove(item.id)
                              }
                              className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                            >
                              Remove
                            </button>
                            <p className="text-base font-bold text-foreground">
                              ${(product.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-background border border-border p-8 py-10 sticky top-32">
                <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-foreground mb-8 border-b border-border pb-4">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-8 text-xs font-bold uppercase tracking-widest">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Subtotal ({cartItemsCount})
                    </span>
                    <span className="text-foreground">${total.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground">
                      {total >= 50 ? "Free" : "$2"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="text-foreground">
                      ${(total * 0.18).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="border-t border-border pt-6 mt-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold">Total</span>
                      <span className="text-lg font-bold">${(total + total * 0.18).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to={"/payment"}
                  className="w-full block text-center py-4 bg-foreground text-background font-bold text-xs tracking-widest uppercase transition-opacity hover:opacity-80 mb-4"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  to={"/products"}
                  className="w-full block text-center py-4 bg-transparent border border-border text-foreground font-bold text-xs tracking-widest uppercase transition-colors hover:bg-secondary"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
