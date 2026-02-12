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
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center glass-panel max-w-md rounded-2xl animate-scale-in p-8">
          <h1 className="text-2xl font-bold text-foreground mb-4">Please Login</h1>
          <p className="text-muted-foreground mb-6">You need to be logged in to view your cart.</p>
          <Link
            to={"/login"}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg text-primary-foreground gradient-primary hover:glow-on-hover animate-smooth font-semibold"
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
    return <div className="min-h-screen pt-20 flex items-center justify-center">Loading...</div>
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center glass-panel max-w-md rounded-2xl animate-scale-in p-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Your Cart is Empty.
          </h1>
          <p className="text-muted-foreground mb-8">
            Looks like you have not added any items to your cart yet.
          </p>
          <Link
            to={"/products"}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg text-primary-foreground gradient-primary hover:glow-on-hover animate-smooth font-semibold"
          >
            <span>Continue Shopping</span> <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Shopping Cart
            </h1>
            <p className="text-muted-foreground">
              {cartItemsCount} item{cartItemsCount !== 1 ? "s" : ""} in your
              cart
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => {
                const product = item.product || {};
                return (
                  <div key={item.id} className="glass-card p-6 rounded-2xl animate-fade-in-up">
                    <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
                      <Link
                        to={`/product/${product.id}`}
                        className="flex-shrink-0"
                      >
                        {product.images && product.images.length > 0 ?
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-24 h-24 object-cover rounded-lg hover:scale-105 transition-transform"
                          /> : <div className="w-24 h-24 bg-gray-200 rounded-lg" />
                        }
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${product.id}`}
                          className="block hover:text-foreground transition-colors"
                        >
                          <h3 className="text-lg font-semibold text-foreground mb-1">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-muted-foreground text-sm mb-2">
                          Category: {product.category}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-foreground">
                            ${product.price}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <button
                            disabled={item.quantity === 1}
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-2 glass-card hover:glow-on-hover animate-smooth"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-semibold text-lg">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-2 glass-card hover:glow-on-hover animate-smooth"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() =>
                            handleRemove(item.id)
                          }
                          className="p-2 glass-card hover:glow-on-hover animate-smooth text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">
                          ${(product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="lg:col-span-1">
              <div className="glass-panel sticky top-24">
                <h2 className="text-xl font-semibold text-foreground mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Subtotal ({cartItemsCount} items)
                    </span>
                    <span className="font-semibold">${total.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-semibold text-green-500">
                      {total >= 50 ? "Free" : "$2"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-semibold">
                      ${(total * 0.18).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-[hsla(var(--glass-border))] pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">Total</span>
                      <span>${(total + total * 0.18).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to={"/payment"}
                  className="w-full block text-center py-4 gradient-primary text-primary-foreground rounded-lg hover:glow-on-hover animate-smooth font-semibold mb-4"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  to={"/products"}
                  className="w-full block text-center py-4 bg-secondary text-foreground  rounded-lg animate-smooth font-semibold mb-4 border-border hover:bg-accent"
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
