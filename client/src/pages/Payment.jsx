import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { placeOrder } from "../store/slices/orderSlice";
import { clearCartAPI } from "../store/slices/cartSlice";
import { toast } from "react-toastify";

const Payment = () => {
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const { authUser } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const { orderStep, razorpayOrder } = useSelector((state) => state.order);

  const [shippingDetails, setShippingDetails] = useState(() => {
    try {
      const saved = sessionStorage.getItem("checkout_shipping_details");
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return {
      fullName: "",
      state: "Delhi",
      phone: "",
      address: "",
      city: "",
      zipCode: "",
      country: "India",
    };
  });

  useEffect(() => {
    sessionStorage.setItem("checkout_shipping_details", JSON.stringify(shippingDetails));
  }, [shippingDetails]);

  // ✅ Prevent Razorpay popup from opening twice (React StrictMode)
  const paymentOpenedRef = useRef(false);

  // Clear stale shipping details from sessionStorage when cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      sessionStorage.removeItem("checkout_shipping_details");
    }
  }, [cart.length]);

  if (!authUser) return <Navigate to="/products" replace />;
  if (cart.length === 0) return <Navigate to="/cart" replace />;


  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  let totalWithTax = total + total * 0.18;

  if (total <= 50) {
    totalWithTax += 2;
  }

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("full_name", shippingDetails.fullName);
    formData.append("state", shippingDetails.state);
    formData.append("city", shippingDetails.city);
    formData.append("country", shippingDetails.country);
    formData.append("address", shippingDetails.address);
    formData.append("pincode", shippingDetails.zipCode);
    formData.append("phone", shippingDetails.phone);
    formData.append("orderedItems", JSON.stringify(cart));

    dispatch(placeOrder(formData));
  };

  // ✅ Razorpay Checkout opens automatically when orderStep becomes 2
  useEffect(() => {
    if (orderStep !== 2 || !razorpayOrder) return;

    // ✅ stop double open
    if (paymentOpenedRef.current) return;

    if (!window.Razorpay) {
      toast.error(
        "Razorpay SDK not loaded. Add the Razorpay script in index.html."
      );
      return;
    }

    // ✅ Backend returns orderId (confirmed)
    const rpOrderId = razorpayOrder.orderId;

    // ✅ Key either from backend (best) or env
    const rpKey = razorpayOrder.key || import.meta.env.VITE_RAZORPAY_KEY_ID;

    if (!rpOrderId || !rpKey) {
      toast.error("Payment data missing. Please try placing the order again.");
      return;
    }

    const options = {
      key: rpKey,
      amount: razorpayOrder.amount, // in paise
      currency: razorpayOrder.currency || "INR",
      name: "Your Store",
      description: "Order Payment",
      order_id: rpOrderId,

      handler: function () {
        // ✅ Webhook is source of truth
        toast.success("Payment initiated. Verifying...");
        dispatch(clearCartAPI());
        navigateTo("/orders");
      },

      prefill: {
        name: shippingDetails.fullName,
        contact: shippingDetails.phone,
      },

      theme: {
        color: "#6366f1",
      },
      modal: {
        ondismiss: function () {
          toast.info("Payment window closed.");
          paymentOpenedRef.current = false;
        }
      }
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function (response) {
      console.log("Razorpay Failed:", response?.error);
      toast.error("Payment failed. Please try again.");

      // Allow retry if payment failed
      paymentOpenedRef.current = false;
    });

    // ✅ set true only when actually opening
    paymentOpenedRef.current = true;
    rzp.open();
  }, [
    orderStep,
    razorpayOrder,
    navigateTo,
    shippingDetails.fullName,
    shippingDetails.phone,
  ]);

  return (
    <>
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* HEADER */}
            <div className="flex items-center space-x-4 mb-8">
              <Link
                to={"/cart"}
                className="p-2 glass-card hover:glow-on-hover ainmate-smooth"
              >
                <ArrowLeft className="w-5 h-5 text-primary" />
              </Link>
            </div>

            {/* PROGRESS STEPS */}
            <div className="flex items-center justify-center mb-16 border-b border-border pb-8">
              <div className="flex items-center space-x-8 uppercase tracking-widest text-xs font-bold">
                {/* STEP 1 */}
                <div
                  className={`flex items-center space-x-3 ${orderStep >= 1 ? "text-foreground" : "text-muted-foreground"
                    }`}
                >
                  <div
                    className={`w-8 h-8 flex items-center justify-center border font-bold ${orderStep >= 1
                      ? "bg-foreground text-background border-foreground"
                      : "bg-transparent text-muted-foreground border-muted-foreground"
                      }`}
                  >
                    {orderStep > 1 ? <Check className="w-4 h-4" /> : "1"}
                  </div>
                  <span>Details</span>
                </div>

                <div
                  className={`w-16 border-t ${orderStep >= 2 ? "border-foreground" : "border-border"
                    }`}
                />

                {/* STEP 2 */}
                <div
                  className={`flex items-center space-x-3 ${orderStep >= 2 ? "text-foreground" : "text-muted-foreground"
                    }`}
                >
                  <div
                    className={`w-8 h-8 flex items-center justify-center border font-bold ${orderStep >= 2
                      ? "bg-foreground text-background border-foreground"
                      : "bg-transparent text-muted-foreground border-muted-foreground"
                      }`}
                  >
                    2
                  </div>
                  <span>Payment</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              {/* FORM SECTION */}
              <div className="lg:col-span-2">
                {orderStep === 1 ? (
                  /* STEP 1: USER DETAILS */
                  <form onSubmit={handlePlaceOrder} className="space-y-6">
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground mb-8">
                      Shipping Information
                    </h2>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingDetails.fullName}
                        onChange={(e) => {
                          setShippingDetails({
                            ...shippingDetails,
                            fullName: e.target.value,
                          });
                        }}
                        className="w-full px-4 py-3 bg-secondary border border-transparent focus:border-foreground transition-colors font-semibold uppercase tracking-widest text-xs focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70 mb-2">
                          State *
                        </label>
                        <select
                          value={shippingDetails.state}
                          onChange={(e) => {
                            setShippingDetails({
                              ...shippingDetails,
                              state: e.target.value,
                            });
                          }}
                          className="w-full px-4 py-3 bg-secondary border border-transparent focus:border-foreground transition-colors font-semibold uppercase tracking-widest text-xs focus:outline-none appearance-none"
                        >
                          <option value="Delhi">Delhi</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70 mb-2">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={shippingDetails.phone}
                          onChange={(e) => {
                            setShippingDetails({
                              ...shippingDetails,
                              phone: e.target.value,
                            });
                          }}
                          className="w-full px-4 py-3 bg-secondary border border-transparent focus:border-foreground transition-colors font-semibold uppercase tracking-widest text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70 mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingDetails.address}
                        onChange={(e) => {
                          setShippingDetails({
                            ...shippingDetails,
                            address: e.target.value,
                          });
                        }}
                        className="w-full px-4 py-3 bg-secondary border border-transparent focus:border-foreground transition-colors font-semibold uppercase tracking-widest text-xs focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingDetails.city}
                          onChange={(e) => {
                            setShippingDetails({
                              ...shippingDetails,
                              city: e.target.value,
                            });
                          }}
                          className="w-full px-4 py-3 bg-secondary border border-transparent focus:border-foreground transition-colors font-semibold uppercase tracking-widest text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70 mb-2">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingDetails.zipCode}
                          onChange={(e) => {
                            setShippingDetails({
                              ...shippingDetails,
                              zipCode: e.target.value,
                            });
                          }}
                          className="w-full px-4 py-3 bg-secondary border border-transparent focus:border-foreground transition-colors font-semibold uppercase tracking-widest text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70 mb-2">
                          Country *
                        </label>
                        <select
                          value={shippingDetails.country}
                          onChange={(e) => {
                            setShippingDetails({
                              ...shippingDetails,
                              country: e.target.value,
                            });
                          }}
                          className="w-full px-4 py-3 bg-secondary border border-transparent focus:border-foreground transition-colors font-semibold uppercase tracking-widest text-xs focus:outline-none appearance-none"
                        >
                          <option value="India">India</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-foreground text-background font-bold text-xs tracking-widest uppercase transition-opacity hover:opacity-80 mt-8 block text-center"
                    >
                      Continue to Payment
                    </button>
                  </form>
                ) : (
                  <div className="border border-border p-12 text-center">
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground mb-4">
                      Opening Payment Gateway…
                    </h2>
                    <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground mb-8">
                      Please complete the payment in Razorpay popup.
                    </p>
                    <button
                      onClick={() => {
                        paymentOpenedRef.current = false;
                        dispatch(placeOrder(new FormData()));
                      }}
                      className="hidden"
                    ></button>
                    <button
                      onClick={() => {
                         if (window.Razorpay) {
                            paymentOpenedRef.current = false;
                            setShippingDetails({ ...shippingDetails });
                         }
                      }}
                      className="px-8 py-4 bg-foreground text-background font-bold text-xs tracking-widest uppercase transition-opacity hover:opacity-80"
                    >
                      Retry Payment
                    </button>
                    <p className="mt-8 text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                      Want to change details? <button onClick={() => dispatch({ type: 'order/resetOrderStep' })} className="border-b border-muted-foreground ml-1 hover:text-foreground">Go back</button>
                    </p>
                  </div>
                )}
              </div>

              {/* ORDER SUMMARY */}
              <div className="lg:col-span-1">
                <div className="bg-background border border-border p-8 py-10 sticky top-32">
                  <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-foreground mb-8 border-b border-border pb-4">
                    Order Summary
                  </h2>

                  <div className="space-y-6 mb-8 border-b border-border pb-6">
                    {cart.map((item) => {
                      return (
                        <div
                          key={item.product.id}
                          className="flex items-center space-x-4"
                        >
                          <img
                            src={item.product?.images?.[0]?.url || item.product?.images?.[0] || "/placeholder.jpg"}
                            alt={item.product.name}
                            className="w-16 h-20 object-cover border border-border"
                          />
                          <div className="flex-1 min-w-0 flex flex-col pt-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-foreground line-clamp-2 leading-relaxed mb-2">
                              {item.product.name}
                            </p>
                            <p className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase mb-1">
                              Qty: {item.quantity}
                            </p>
                            <p className="text-xs font-bold">
                              ${Number(item.product.price) * item.quantity}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-4 text-xs font-bold uppercase tracking-widest">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-foreground">
                        {total >= 50 ? "Free" : "$2"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>${(total * 0.18).toFixed(2)}</span>
                    </div>
                    <div className="pt-6 mt-6 border-t border-border flex justify-between items-center text-sm font-bold">
                      <span>Total</span>
                      <span>
                        ${totalWithTax.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* end grid */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Payment;
