import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
              const date = order.createdAt || order.orderDate || order.date;
              return (
                <article key={id} className="rounded-2xl border border-gray-100 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Order</p>
                      <h3 className="mt-1 font-semibold text-[#141432]">#{String(id).slice(-10)}</h3>
                      {date && <p className="mt-1 text-sm text-slate-500">{new Date(date).toLocaleDateString("en-NG")}</p>}
                    </div>
                    <span className="rounded-full bg-[#EEF0FF] px-4 py-1.5 text-sm font-semibold text-[#23195f]">{status}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                    <p className="text-sm text-slate-500">{items.length} {items.length === 1 ? "item" : "items"}</p>
                    <p className="text-lg font-bold text-[#23195f]">{money(getOrderTotal(order))}</p>
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
