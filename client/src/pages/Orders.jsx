import React, { useEffect, useState } from "react";
import { Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { fetchMyOrders } from "../store/slices/orderSlice";

const Orders = () => {
  const [statusFilter, setStatusFilter] = useState("All");
  const { myOrders } = useSelector((state) => state.order);
  const { authUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  if (!authUser) return <Navigate to="/products" replace />;

  const filterOrders = myOrders.filter(
    (order) => statusFilter === "All" || order.order_status === statusFilter
  );

  const statusConfig = {
    Processing: { icon: Clock,        cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", dot: "bg-amber-400" },
    Shipped:    { icon: Truck,        cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",    dot: "bg-blue-400" },
    Delivered:  { icon: CheckCircle,  cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", dot: "bg-green-500" },
    Cancelled:  { icon: XCircle,      cls: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",         dot: "bg-red-500" },
  };

  const statusArray = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

  return (
    <div className="min-h-screen pt-6 pb-16 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-7">
          <h1 className="text-2xl font-extrabold text-foreground">My Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">Track and manage your order history.</p>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-7">
          {statusArray.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`pill-btn ${statusFilter === status ? "pill-btn-active" : "pill-btn-inactive"}`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Orders list */}
        {filterOrders.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-dashed border-border">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" strokeWidth={1.5} />
            <h2 className="text-base font-bold text-foreground mb-2">No Orders Found</h2>
            <p className="text-sm text-muted-foreground">
              {statusFilter === "All"
                ? "You haven't placed any orders yet."
                : `No orders with status "${statusFilter}" found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filterOrders.map((order) => {
              const cfg = statusConfig[order.order_status] || statusConfig.Processing;
              const StatusIcon = cfg.icon;

              return (
                <div key={order.id} className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
                  {/* order header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-4 border-b border-border bg-secondary/40 gap-3">
                    <div>
                      <p className="text-sm font-bold text-foreground">Order #{order.id}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Placed on {new Date(order.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${cfg.cls}`}>
                        <StatusIcon className="w-3.5 h-3.5" strokeWidth={2} />
                        {order.order_status}
                      </span>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className="text-sm font-extrabold text-foreground">₹{order.total_price}</p>
                      </div>
                    </div>
                  </div>

                  {/* order items */}
                  <div className="px-5 py-4 space-y-4">
                    {order?.order_items?.map((item) => (
                      <div key={item.product_id} className="flex items-center gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-16 h-20 object-cover rounded-xl border border-border shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug mb-1">{item.title}</h4>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          <p className="text-sm font-bold text-foreground mt-1">₹{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* actions */}
                  <div className="px-5 py-4 bg-secondary/30 border-t border-border flex flex-wrap gap-2">
                    <button className="px-4 py-2 bg-card border border-border rounded-full text-xs font-bold text-foreground hover:bg-secondary transition-colors">
                      View Details
                    </button>
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-xs font-bold hover:bg-primary/90 transition-colors">
                      Track Order
                    </button>
                    {order.order_status === "Delivered" && (
                      <>
                        <button className="px-4 py-2 bg-card border border-border rounded-full text-xs font-bold text-foreground hover:bg-secondary transition-colors">
                          Write Review
                        </button>
                        <button className="px-4 py-2 bg-card border border-border rounded-full text-xs font-bold text-foreground hover:bg-secondary transition-colors">
                          Reorder
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
