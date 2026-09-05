import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../service/api";

function PaymentCallback({ setCart, onRemovePromo }) {
  const [searchParams] = useSearchParams();
  const gatewayStatus = (searchParams.get("status") || "").toLowerCase();
  const transactionId = searchParams.get("transaction_id");
  const txRef = searchParams.get("tx_ref");
  const hasVerificationDetails = ["successful", "succeeded"].includes(gatewayStatus) && transactionId && txRef;
  const [result, setResult] = useState(() => hasVerificationDetails
    ? { status: "checking", message: "Verifying your payment securely…" }
    : { status: "failed", message: "Payment was cancelled or Flutterwave did not return complete payment details." });

  useEffect(() => {
    let mounted = true;
    if (!hasVerificationDetails) return undefined;
    api.verifyFlutterwavePayment(transactionId, txRef)
      .then(() => {
        if (!mounted) return;
        setCart?.([]);
        onRemovePromo?.();
        setResult({ status: "success", message: "Your payment was verified and your order is confirmed." });
      })
      .catch((error) => mounted && setResult({ status: "failed", message: error.message || "We could not verify this payment yet." }));
    return () => { mounted = false; };
  }, [hasVerificationDetails, onRemovePromo, setCart, transactionId, txRef]);

  const checking = result.status === "checking";
  const successful = result.status === "success";
  return (
    <section className="min-h-screen bg-[#F6F7FB] px-4 py-16">
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-10 text-center shadow-sm">
        <span className={`inline-flex h-20 w-20 items-center justify-center rounded-full text-3xl ${checking ? "bg-[#EEF0FF] text-[#23195f]" : successful ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}>
          <i className={`fa-solid ${checking ? "fa-spinner animate-spin" : successful ? "fa-check" : "fa-triangle-exclamation"}`} />
        </span>
        <h1 className="mt-6 text-2xl font-bold text-[#141432]">{checking ? "Checking payment" : successful ? "Payment confirmed" : "Payment not confirmed"}</h1>
        <p className="mt-3 text-slate-600">{result.message}</p>
        {!checking && (
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/orders" className="rounded-full bg-[#23195f] px-6 py-3 font-semibold text-white">View orders</Link>
            {!successful && <Link to="/shop" className="rounded-full border border-gray-200 px-6 py-3 font-semibold text-[#23195f]">Continue shopping</Link>}
          </div>
        )}
      </div>
    </section>
  );
}

export default PaymentCallback;
