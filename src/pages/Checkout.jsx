import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../service/api";

const NG_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
  "Taraba", "Yobe", "Zamfara",
];

function money(value, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(Number(value || 0));
}

function Field({ label, id, value, onChange, error, type = "text", half = false }) {
  return (
    <div className={half ? "col-span-2 sm:col-span-1" : "col-span-2"}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-[#141432]">{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className={`h-12 w-full rounded-xl border px-4 outline-none ${error ? "border-rose-400 bg-rose-50" : "border-gray-200 bg-slate-50 focus:border-[#23195f]"}`}
      />
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}

function StepBar({ current }) {
  return (
    <div className="flex items-center justify-center">
      {["Shipping", "Payment", "Review"].map((label, index) => {
        const number = index + 1;
        const done = number < current;
        const active = number === current;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <span className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${done ? "bg-emerald-500 text-white" : active ? "bg-[#23195f] text-white" : "bg-gray-200 text-slate-400"}`}>
                {done ? <i className="fa-solid fa-check" /> : number}
              </span>
              <span className={`mt-1.5 text-xs font-semibold ${active ? "text-[#23195f]" : done ? "text-emerald-500" : "text-slate-400"}`}>{label}</span>
            </div>
            {index < 2 && <span className={`mx-2 mb-5 h-0.5 w-14 sm:w-24 ${done ? "bg-emerald-500" : "bg-gray-200"}`} />}
          </div>
        );
      })}
    </div>
  );
}

function Checkout({ cart = [], setCart, promoDiscount, onRemovePromo, loading = false }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [shipping, setShipping] = useState({
    firstName: "", lastName: "", email: "", phone: "", address: "", city: "", state: "", zip: "",
  });
  const [shippingErrors, setShippingErrors] = useState({});
  const [quoteResult, setQuoteResult] = useState({ key: "", data: null });
  const [orderError, setOrderError] = useState("");
  const [placing, setPlacing] = useState(false);
  const itemCount = useMemo(() => cart.reduce((sum, item) => sum + Number(item.qty || 0), 0), [cart]);
  const quoteKey = useMemo(
    () => JSON.stringify({ items: cart.map((item) => [item.id, item.qty]), promoCode: promoDiscount?.code || null }),
    [cart, promoDiscount?.code]
  );
  const quote = quoteResult.key === quoteKey ? quoteResult.data : null;
  const quoteLoading = !loading && cart.length > 0 && !quote;

  useEffect(() => {
    let mounted = true;
    if (loading || cart.length === 0) return undefined;
    api.getCheckoutQuote(promoDiscount?.code)
      .then((data) => {
        if (mounted) {
          setQuoteResult({ key: quoteKey, data });
          setOrderError("");
        }
      })
      .catch((error) => mounted && setOrderError(error.message || "Unable to calculate your order total."));
    return () => { mounted = false; };
  }, [cart.length, loading, promoDiscount?.code, quoteKey]);

  const changeShipping = (field) => (event) => setShipping((current) => ({ ...current, [field]: event.target.value }));

  const validateShipping = () => {
    const errors = {};
    if (!shipping.firstName.trim()) errors.firstName = "First name is required";
    if (!shipping.lastName.trim()) errors.lastName = "Last name is required";
    if (!shipping.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(shipping.email)) errors.email = "Enter a valid email";
    if (!shipping.phone.trim()) errors.phone = "Phone number is required";
    else if (!/^\+?[\d\s-]{10,}$/.test(shipping.phone)) errors.phone = "Enter a valid phone number";
    if (!shipping.address.trim()) errors.address = "Address is required";
    if (!shipping.city.trim()) errors.city = "City is required";
    if (!shipping.state) errors.state = "Select a state";
    return errors;
  };

  const goNext = () => {
    if (step === 1) {
      const errors = validateShipping();
      if (Object.keys(errors).length) {
        setShippingErrors(errors);
        return;
      }
      setShippingErrors({});
    }
    setStep((current) => Math.min(3, current + 1));
  };

  const placeOrder = async () => {
    if (!quote || cart.length === 0) {
      setOrderError("Your cart is empty or your total could not be calculated.");
      return;
    }
    setPlacing(true);
    setOrderError("");
    let createdOrder;
    try {
      createdOrder = await api.createOrder({
        shippingAddress: shipping,
        billingAddress: null,
        promoCode: promoDiscount?.code || null,
      });
      setCart?.([]);
      onRemovePromo?.();
      const payment = await api.initializeFlutterwavePayment(createdOrder.id);
      if (!payment?.paymentLink) throw new Error("The payment provider did not return a checkout link.");
      window.location.assign(payment.paymentLink);
    } catch (error) {
      if (createdOrder?.id) {
        navigate("/orders", {
          replace: true,
          state: { paymentError: error.message || "Payment could not be started.", orderId: createdOrder.id },
        });
        return;
      }
      setOrderError(error.message || "Unable to place your order.");
      setPlacing(false);
    }
  };

  if (!loading && cart.length === 0) {
    return (
      <section className="min-h-screen bg-[#F6F7FB] px-4 py-16">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <i className="fa-solid fa-cart-shopping text-5xl text-slate-300" />
          <h1 className="mt-5 text-2xl font-bold text-[#141432]">Your cart is empty</h1>
          <p className="mt-2 text-slate-500">Add a product before starting checkout.</p>
          <Link to="/shop" className="mt-6 inline-flex rounded-full bg-[#23195f] px-6 py-3 font-semibold text-white">Go to shop</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#F6F7FB] px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <Link to="/cart" className="inline-flex items-center gap-2 font-semibold text-[#23195f]"><i className="fa-solid fa-arrow-left" /> Back to cart</Link>
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF0FF] text-[#23195f]"><i className="fa-solid fa-bag-shopping text-xl" /></span>
        </div>
        <StepBar current={step} />

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div>
            {step === 1 && (
              <div className="rounded-3xl bg-white p-7 shadow-sm sm:p-10">
                <h1 className="text-2xl font-semibold text-[#141432]">Shipping details</h1>
                <p className="mt-2 text-sm text-slate-500">Where should we deliver your order?</p>
                <div className="mt-8 grid grid-cols-2 gap-5">
                  <Field label="First name" id="firstName" value={shipping.firstName} onChange={changeShipping("firstName")} error={shippingErrors.firstName} half />
                  <Field label="Last name" id="lastName" value={shipping.lastName} onChange={changeShipping("lastName")} error={shippingErrors.lastName} half />
                  <Field label="Email address" id="email" type="email" value={shipping.email} onChange={changeShipping("email")} error={shippingErrors.email} />
                  <Field label="Phone number" id="phone" type="tel" value={shipping.phone} onChange={changeShipping("phone")} error={shippingErrors.phone} />
                  <Field label="Street address" id="address" value={shipping.address} onChange={changeShipping("address")} error={shippingErrors.address} />
                  <Field label="City" id="city" value={shipping.city} onChange={changeShipping("city")} error={shippingErrors.city} half />
                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="state" className="mb-1.5 block text-sm font-semibold text-[#141432]">State</label>
                    <select id="state" value={shipping.state} onChange={changeShipping("state")} className={`h-12 w-full rounded-xl border px-4 outline-none ${shippingErrors.state ? "border-rose-400 bg-rose-50" : "border-gray-200 bg-slate-50"}`}>
                      <option value="">Select state</option>
                      {NG_STATES.map((state) => <option key={state} value={state}>{state}</option>)}
                    </select>
                    {shippingErrors.state && <p className="mt-1 text-xs text-rose-600">{shippingErrors.state}</p>}
                  </div>
                  <Field label="Postal code (optional)" id="zip" value={shipping.zip} onChange={changeShipping("zip")} half />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="rounded-3xl bg-white p-7 shadow-sm sm:p-10">
                <h1 className="text-2xl font-semibold text-[#141432]">Secure payment</h1>
                <p className="mt-2 text-slate-500">You will complete payment on Flutterwave&apos;s hosted checkout.</p>
                <div className="mt-8 rounded-2xl border-2 border-[#23195f] bg-[#EEF0FF] p-6 text-[#23195f]">
                  <div className="flex items-start gap-4">
                    <i className="fa-solid fa-shield-halved mt-1 text-2xl" />
                    <div>
                      <p className="font-semibold">Card, bank transfer or USSD</p>
                      <p className="mt-1 text-sm text-slate-600">Flutterwave securely collects your payment details. Nuges Pharmacy never receives or stores your card details.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="rounded-3xl bg-white p-7 shadow-sm sm:p-10">
                <h1 className="text-2xl font-semibold text-[#141432]">Review order</h1>
                <div className="mt-6 rounded-2xl border border-gray-100 p-5 text-sm text-slate-600">
                  <div className="flex justify-between gap-4"><p className="font-semibold text-[#141432]">Shipping address</p><button type="button" onClick={() => setStep(1)} className="font-semibold text-[#23195f]">Edit</button></div>
                  <p className="mt-3 font-semibold text-[#141432]">{shipping.firstName} {shipping.lastName}</p>
                  <p>{shipping.address}, {shipping.city}, {shipping.state}</p>
                  <p>{shipping.email} · {shipping.phone}</p>
                </div>
                <div className="mt-4 rounded-2xl border border-gray-100 p-5">
                  <p className="font-semibold text-[#141432]">Items ({itemCount})</p>
                  <div className="mt-4 space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <img src={item.image} alt="" className="h-14 w-14 rounded-xl bg-gray-100 object-cover" />
                        <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-[#141432]">{item.name}</p><p className="text-xs text-slate-500">Qty: {item.qty}</p></div>
                        <span className="text-sm font-semibold">{money(item.price * item.qty, quote?.currency)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {orderError && <div role="alert" className="mt-5 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-semibold text-rose-700">{orderError}</div>}
            <div className="mt-6 flex items-center justify-between gap-4">
              {step > 1 ? <button type="button" onClick={() => setStep((current) => current - 1)} className="rounded-full border bg-white px-7 py-3.5 font-semibold text-[#141432]">Back</button> : <span />}
              {step < 3 ? (
                <button type="button" onClick={goNext} className="rounded-full bg-[#23195f] px-8 py-3.5 font-semibold text-white">Continue</button>
              ) : (
                <button type="button" onClick={placeOrder} disabled={placing || quoteLoading || !quote} className="rounded-full bg-[#23195f] px-8 py-3.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">{placing ? "Opening secure payment…" : "Place order and pay"}</button>
              )}
            </div>
          </div>

          <aside className="h-fit rounded-3xl bg-white p-7 shadow-sm">
            <h2 className="text-xl font-semibold text-[#141432]">Order summary</h2>
            {loading || quoteLoading || !quote ? <p className="mt-6 text-sm text-slate-500">Calculating your secure total…</p> : (
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span>{money(quote.subtotal, quote.currency)}</span></div>
                {Number(quote.discountAmount) > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>-{money(quote.discountAmount, quote.currency)}</span></div>}
                <div className="flex justify-between"><span className="text-slate-500">Delivery</span><span>{money(quote.shippingCost, quote.currency)}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">VAT</span><span>{money(quote.vatAmount, quote.currency)}</span></div>
                <div className="flex justify-between border-t pt-4 text-lg font-bold text-[#23195f]"><span>Total</span><span>{money(quote.total, quote.currency)}</span></div>
              </div>
            )}
            <p className="mt-6 rounded-2xl bg-slate-50 p-4 text-xs leading-5 text-slate-500">Prices and stock are checked by the server before your order is created. Payment is only marked successful after server verification.</p>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default Checkout;
