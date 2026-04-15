import { useState, useEffect, useRef } from "react";
import { Check, ChevronLeft } from "lucide-react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { placeOrder, verifyPayment } from "../store/slices/orderSlice";
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
    } catch (e) {}
    return { fullName: "", state: "Delhi", phone: "", address: "", city: "", zipCode: "", country: "India" };
  });

  useEffect(() => {
    sessionStorage.setItem("checkout_shipping_details", JSON.stringify(shippingDetails));
  }, [shippingDetails]);

  const paymentOpenedRef = useRef(false);

  useEffect(() => {
    if (cart.length === 0) sessionStorage.removeItem("checkout_shipping_details");
  }, [cart.length]);

  if (!authUser) return <Navigate to="/products" replace />;
  if (cart.length === 0) return <Navigate to="/cart" replace />;

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = total >= 500 ? 0 : 49;
  const tax = total * 0.18;
  const totalWithTax = total + shipping + tax;

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

  useEffect(() => {
    if (orderStep !== 2 || !razorpayOrder) return;
    if (paymentOpenedRef.current) return;
    if (!window.Razorpay) { toast.error("Razorpay SDK not loaded."); return; }

    const rpOrderId = razorpayOrder.orderId;
    const rpKey = razorpayOrder.key || import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!rpOrderId || !rpKey) { toast.error("Payment data missing."); return; }

    const options = {
      key: rpKey,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency || "INR",
      name: "DivKart",
      description: "Order Payment",
      order_id: rpOrderId,
      handler: function (response) {
        dispatch(
          verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          })
        ).then((action) => {
          if (action.meta.requestStatus === "fulfilled") {
            dispatch(clearCartAPI());
            navigateTo("/orders");
          }
        });
      },
      prefill: { name: shippingDetails.fullName, contact: shippingDetails.phone },
      theme: { color: "#1a4731" },
      modal: { ondismiss: function () { toast.info("Payment window closed."); paymentOpenedRef.current = false; } },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function () { toast.error("Payment failed. Please try again."); paymentOpenedRef.current = false; });
    paymentOpenedRef.current = true;
    rzp.open();
  }, [orderStep, razorpayOrder, navigateTo, shippingDetails.fullName, shippingDetails.phone]);

  const inputClass = "w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 text-sm font-medium text-foreground transition-all";
  const labelClass = "block text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-wide";

  return (
    <div className="min-h-screen pt-6 pb-16 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link to="/cart" className="w-9 h-9 flex items-center justify-center rounded-full border border-border bg-card hover:bg-secondary transition-colors shadow-card">
            <ChevronLeft className="w-4 h-4 text-foreground" strokeWidth={2} />
          </Link>
          <h1 className="text-2xl font-extrabold text-foreground">Checkout</h1>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center mb-10">
          <div className="flex items-center gap-4">
            {/* Step 1 */}
            <div className={`flex items-center gap-2 text-sm font-bold ${orderStep >= 1 ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold border-2 ${orderStep >= 1 ? "bg-primary text-primary-foreground border-primary" : "border-muted-foreground text-muted-foreground"}`}>
                {orderStep > 1 ? <Check className="w-4 h-4" /> : "1"}
              </div>
              <span>Shipping</span>
            </div>

            <div className={`w-16 h-0.5 rounded-full ${orderStep >= 2 ? "bg-primary" : "bg-border"}`} />

            {/* Step 2 */}
            <div className={`flex items-center gap-2 text-sm font-bold ${orderStep >= 2 ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold border-2 ${orderStep >= 2 ? "bg-primary text-primary-foreground border-primary" : "border-muted-foreground text-muted-foreground"}`}>
                2
              </div>
              <span>Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Form */}
          <div className="lg:col-span-2">
            {orderStep === 1 ? (
              <form onSubmit={handlePlaceOrder} className="bg-card rounded-2xl border border-border p-6 shadow-card space-y-5">
                <h2 className="text-base font-bold text-foreground mb-2">Shipping Information</h2>

                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input type="text" required value={shippingDetails.fullName}
                    onChange={(e) => setShippingDetails({ ...shippingDetails, fullName: e.target.value })}
                    className={inputClass} placeholder="Enter your full name" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>State *</label>
                    <select value={shippingDetails.state}
                      onChange={(e) => setShippingDetails({ ...shippingDetails, state: e.target.value })}
                      className={inputClass}>
                      <option value="Delhi">Delhi</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Phone *</label>
                    <input type="tel" required value={shippingDetails.phone}
                      onChange={(e) => setShippingDetails({ ...shippingDetails, phone: e.target.value })}
                      className={inputClass} placeholder="+91 XXXXXXXXXX" />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Address *</label>
                  <input type="text" required value={shippingDetails.address}
                    onChange={(e) => setShippingDetails({ ...shippingDetails, address: e.target.value })}
                    className={inputClass} placeholder="Street address, building, flat" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>City *</label>
                    <input type="text" required value={shippingDetails.city}
                      onChange={(e) => setShippingDetails({ ...shippingDetails, city: e.target.value })}
                      className={inputClass} placeholder="City" />
                  </div>
                  <div>
                    <label className={labelClass}>PIN Code *</label>
                    <input type="text" required value={shippingDetails.zipCode}
                      onChange={(e) => setShippingDetails({ ...shippingDetails, zipCode: e.target.value })}
                      className={inputClass} placeholder="110001" />
                  </div>
                  <div>
                    <label className={labelClass}>Country *</label>
                    <select value={shippingDetails.country}
                      onChange={(e) => setShippingDetails({ ...shippingDetails, country: e.target.value })}
                      className={inputClass}>
                      <option value="India">India</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-primary text-primary-foreground rounded-full font-bold text-sm hover:bg-primary/90 transition-colors mt-2"
                >
                  Continue to Payment →
                </button>
              </form>
            ) : (
              <div className="bg-card rounded-2xl border border-border p-10 shadow-card text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-accent-foreground" strokeWidth={2.5} />
                </div>
                <h2 className="text-base font-bold text-foreground mb-2">Opening Payment Gateway…</h2>
                <p className="text-sm text-muted-foreground mb-6">Please complete the payment in the Razorpay popup.</p>
                <button
                  onClick={() => dispatch({ type: "order/resetOrderStep" })}
                  className="text-sm font-semibold text-primary hover:text-primary/70 transition-colors"
                >
                  ← Change shipping details
                </button>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl border border-border p-5 shadow-card sticky top-24">
              <h2 className="text-sm font-bold text-foreground mb-4 pb-3 border-b border-border">Order Summary</h2>

              <div className="space-y-3 mb-5 border-b border-border pb-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <img
                      src={item.product?.images?.[0]?.url || item.product?.images?.[0] || "/placeholder.jpg"}
                      alt={item.product.name}
                      className="w-12 h-14 object-cover rounded-lg border border-border shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground line-clamp-2 leading-snug">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold shrink-0">₹{Number(item.product.price) * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
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
                <div className="pt-3 mt-2 border-t border-border flex justify-between items-center">
                  <span className="font-bold">Total</span>
                  <span className="font-extrabold text-lg">₹{totalWithTax.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
