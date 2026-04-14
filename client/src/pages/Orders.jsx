import React, { useEffect, useState } from "react";
import { Filter, Package, Truck, CheckCircle, XCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { fetchMyOrders } from "../store/slices/orderSlice";

const Orders = () => {
  const [statusFilter, setStatusFilter] = useState("All");
  const { myOrders } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const filterOrders = myOrders.filter(
    (order) => statusFilter === "All" || order.order_status === statusFilter
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing":
        return <Package className="w-5 h-5 text-yellow-500" />;
        // break;
      case "Shipped":
        return <Truck className="w-5 h-5 text-neutral-500" />;
        // break;
      case "Delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
        // break;
      case "Cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
        // break;

      default:
        return <Package className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-500/20 text-yellow-400";
        // break;
      case "Shipped":
        return "bg-neutral-500/20 text-neutral-600 dark:text-neutral-400";
        // break;
      case "Delivered":
        return "bg-green-500/20 text-green-400";
        // break;
      case "Cancelled":
        return "bg-red-500/20 text-red-400";
        // break;

      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const statusArray = [
    "All",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const { authUser } = useSelector((state) => state.auth);
  if (!authUser) return <Navigate to="/products" replace />;

  return (
    <>
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              My Orders
            </h1>
            <p className="text-muted-foreground">
              Track and manage your order history.
            </p>
          </div>

          {/* STATUS FILTER */}
          <div className="border-y border-border py-6 mb-12">
            <div className="flex items-center space-x-6 flex-wrap">
              <div className="flex items-center space-x-2 mb-2 lg:mb-0">
                <Filter className="w-4 h-4 text-foreground" strokeWidth={1} />
                <span className="font-bold text-xs uppercase tracking-[0.2em]">Filter</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {statusArray.map((status) => {
                  return (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-4 py-2 font-bold text-[10px] uppercase tracking-widest transition-all border ${
                        statusFilter === status
                          ? "bg-foreground text-background border-foreground"
                          : "bg-transparent border-transparent hover:border-border text-foreground/70 hover:text-foreground"
                      }`}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ORDERS LIST */}
          {filterOrders.length === 0 ? (
            <div className="text-center p-12 border border-border max-w-xl mx-auto">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-6" strokeWidth={1} />
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground mb-4">
                No Orders Found
              </h2>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {statusFilter === "All"
                  ? "You haven't placed any orders yet."
                  : `No orders with status "${statusFilter}" found.`}
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {filterOrders.map((order) => {
                return (
                  <div key={order.id} className="border border-border">
                    {/* ORDER HEADER */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between p-6 md:px-8 border-b border-border bg-secondary/30 space-y-4 md:space-y-0 text-xs font-bold uppercase tracking-widest text-foreground">
                      <div>
                        <h3 className="mb-1 text-sm tracking-[0.2em]">
                          Order #{order.id}
                        </h3>
                        <p className="text-muted-foreground tracking-widest text-[10px]">
                          Placed on{" "}
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-8">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.order_status)}
                          <span
                            className={`px-2 py-1 text-[10px] bg-transparent ${getStatusColor(
                              order.order_status
                            )}`}
                          >
                            {order.order_status}
                          </span>
                        </div>

                        <div className="text-right">
                          <p className="text-[10px] text-muted-foreground">Total</p>
                          <p className="text-sm border-t border-transparent pt-1">
                            ${order.total_price}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ORDER ITEMS */}
                    <div className="p-6 md:px-8 space-y-6">
                      {order?.order_items?.map((item) => {
                        return (
                          <div
                            key={item.product_id}
                            className="flex items-start space-x-6 pb-6 border-b border-border last:border-0 last:pb-0"
                          >
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-20 h-24 object-cover"
                            />
                            <div className="flex-1 min-w-0 pt-2 text-xs font-bold uppercase tracking-widest">
                              <h4 className="text-foreground line-clamp-2 leading-relaxed mb-2">
                                {item.title}
                              </h4>
                              <p className="text-[10px] text-muted-foreground mb-4">
                                Quantity: {item.quantity}
                              </p>
                              <p className="text-foreground">
                                ${item.price}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* ORDER ACTIONS */}
                    <div className="flex flex-wrap gap-4 p-6 md:px-8 bg-secondary/30 border-t border-border">
                      <button className="px-6 py-3 border border-border bg-background hover:bg-secondary transition-colors text-[10px] font-bold uppercase tracking-widest">
                        View Details
                      </button>
                      <button className="px-6 py-3 border border-foreground bg-foreground hover:opacity-80 text-background transition-opacity text-[10px] font-bold uppercase tracking-widest">
                        Track Order
                      </button>
                      {order.status === "Delivered" && (
                        <>
                          <button className="px-6 py-3 border border-border bg-background hover:bg-secondary transition-colors text-[10px] font-bold uppercase tracking-widest">
                            Write Review
                          </button>

                          <button className="px-6 py-3 border border-border bg-background hover:bg-secondary transition-colors text-[10px] font-bold uppercase tracking-widest">
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
    </>
  );
};

export default Orders;
