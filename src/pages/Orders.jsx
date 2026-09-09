import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AccountShell } from "./Profile";
import { api, normalizeList } from "../service/api";

function money(value) {
  return "₦" + Number(value || 0).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getOrderTotal(order) {
  return order.total || order.totalAmount || order.amount || order.grandTotal || 0;
}

function getOrderItems(order) {
  return order.items || order.orderItems || order.products || [];
}

function Orders() {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payingOrderId, setPayingOrderId] = useState(null);
  const [paymentError, setPaymentError] = useState(location.state?.paymentError || "");

  useEffect(() => {
    let mounted = true;
    api.getOrders()
      .then((data) => {
        if (!mounted) return;
        setOrders(normalizeList(data));
        setError("");
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.status === 403 ? "Please sign in to view your orders." : err.message || "Unable to load orders.");
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, []);

  const payNow = async (orderId) => {
    setPayingOrderId(orderId);
    setPaymentError("");
    try {
      const payment = await api.initializeFlutterwavePayment(orderId);
      if (!payment?.paymentLink) throw new Error("The payment provider did not return a checkout link.");
      window.location.assign(payment.paymentLink);
    } catch (paymentFailure) {
      setPaymentError(paymentFailure.message || "Unable to start payment for this order.");
      setPayingOrderId(null);
    }
  };

  return (
    <AccountShell>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#141432]">My orders</h1>
          <p className="mt-2 text-sm text-slate-500">Track your Nuges Pharmaceuticals purchases.</p>
        </div>
        <Link to="/shop" className="rounded-full bg-[#23195f] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90">
          Shop medicines
        </Link>
      </div>

      <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        {paymentError && (
          <div role="alert" className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            {paymentError} Your pending order is saved, so you can try payment again below.
          </div>
        )}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="skeleton h-24 w-full rounded-2xl"></div>)}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 p-6 text-rose-700">
            <i className="fa-solid fa-circle-exclamation mr-2"></i>{error}
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-gray-200 p-10 text-center">
            <i className="fa-solid fa-box-open text-5xl text-slate-300"></i>
            <h2 className="mt-5 text-xl font-semibold text-[#141432]">No orders yet</h2>
            <p className="mt-2 text-slate-500">When you place an order, it will appear here.</p>
            <Link to="/shop" className="mt-6 inline-flex rounded-full bg-[#23195f] px-6 py-3 text-sm font-semibold text-white">
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => {
              const id = order.id || order._id || order.orderId || `order-${index}`;
              const items = getOrderItems(order);
              const status = order.status || order.orderStatus || "Processing";
              const paymentStatus = String(order.paymentStatus || "UNPAID").toUpperCase();
              const expired = order.paymentExpiresAt && new Date(order.paymentExpiresAt) <= new Date();
              const canPay = paymentStatus === "PENDING" && String(status).toUpperCase() !== "CANCELLED" && !expired;
              const date = order.createdAt || order.orderDate || order.date;
              return (
                <article key={id} className="rounded-2xl border border-gray-100 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Order</p>
                      <h3 className="mt-1 font-semibold text-[#141432]">#{String(id).slice(-10)}</h3>
                      {date && <p className="mt-1 text-sm text-slate-500">{new Date(date).toLocaleDateString("en-NG")}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="rounded-full bg-[#EEF0FF] px-4 py-1.5 text-sm font-semibold text-[#23195f]">{status}</span>
                      <span className={`text-xs font-semibold ${paymentStatus === "PAID" ? "text-emerald-600" : paymentStatus === "FAILED" ? "text-rose-600" : "text-amber-600"}`}>
                        Payment: {paymentStatus}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                    <p className="text-sm text-slate-500">{items.length} {items.length === 1 ? "item" : "items"}</p>
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-bold text-[#23195f]">{money(getOrderTotal(order))}</p>
                      {canPay && (
                        <button
                          type="button"
                          onClick={() => payNow(order.id)}
                          disabled={payingOrderId === order.id}
                          className="rounded-full bg-[#23195f] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                        >
                          {payingOrderId === order.id ? "Opening…" : "Pay now"}
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </AccountShell>
  );
}

export default Orders;
