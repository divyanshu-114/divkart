import { X, Plus, Minus, Trash2 } from "lucide-react";
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
    };

  };

  let total = 0;
  if (cart) {
    total = cart.reduce((acc, item) => acc + Number(item.product.price) * item.quantity, 0);
  }

  if (!isCartOpen) {
    return null;
  }

  return <>
    {/* overlay */}
    <div className="fixed inset-0 bg-background/80 z-40 backdrop-blur-sm animate-fade-in" onClick={() => dispatch(toggleCart())} />

    {/* cart sidebar */}
    <div className="fixed right-0 top-0 h-full w-96 z-50 bg-background border-l border-border animate-slide-in-right overflow-y-auto shadow-2xl">
      <div className="flex items-center justify-between p-6 border-b border-border h-20">
        <h2 className="text-xl font-bold tracking-[0.2em] uppercase text-foreground">Cart</h2>
        <button onClick={() => dispatch(toggleCart())} className="p-2 text-foreground hover:opacity-60 transition-opacity"><X className="w-6 h-6" strokeWidth={1} /></button>
      </div>

      <div className="p-6">
        {
          cart && cart.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground uppercase tracking-widest text-xs font-semibold">Your cart is empty.</p>
              <Link to={"/products"} onClick={() => dispatch(toggleCart())}
                className="inline-block mt-8 px-8 py-3 bg-foreground text-background font-bold text-xs tracking-widest uppercase transition-opacity hover:opacity-80">Browse Products</Link>
            </div>
          ) : (
            <>
              {/* cart items */}
              <div className="space-y-6 mb-8">
                {
                  cart && cart.map(item => {
                    return (
                      <div key={item.product.id} className="flex items-start space-x-4 border-b border-border pb-6">
                        <img
                          src={item.product.images?.[0]?.url || item.product.images?.[0]}
                          alt={item.product.name}
                          className="h-24 w-20 object-cover"
                        />
                        <div className="flex-1 min-w-0 pt-1">
                          <h3 className="text-xs font-bold text-foreground mb-1 uppercase tracking-widest leading-relaxed line-clamp-2">{item.product.name}</h3>
                          <p className="text-foreground text-sm font-medium mb-3">₹{item.product.price}</p>
                          {/* quantity control */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center border border-border">
                              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-secondary transition-colors"><Minus className="w-3 h-3 text-foreground" /></button>
                              <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-secondary transition-colors"><Plus className="w-3 h-3 text-foreground" /></button>
                            </div>
                            <button onClick={() => dispatch(removeFromCartAPI(item.id))} className="p-2 hover:opacity-60 transition-opacity text-foreground"><Trash2 className="w-4 h-4" strokeWidth={1} /></button>
                          </div>
                        </div>
                      </div>
                    )
                  })
                }
              </div>

              {/* total */}
              <div className="pt-2">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-bold uppercase tracking-widest">Total</span>
                  <span className="text-lg font-bold text-foreground">₹{total.toFixed(2)}</span>
                </div>
                <Link to={"/cart"} onClick={() => dispatch(toggleCart())} className="w-full flex items-center justify-center bg-foreground text-background transition-opacity hover:opacity-80 pt-4 pb-4 text-xs font-bold tracking-widest uppercase">View Cart & Checkout</Link>
              </div>
            </>
          )
        }
      </div>

    </div>

  </>;
};

export default CartSidebar;


