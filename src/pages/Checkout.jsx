import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../service/api";
import verveLogo from "../assets/Icons/verve.png";
import mastercardLogo from "../assets/Icons/mastercard.jpg";
import visaLogo from "../assets/Icons/visa.png";

const FLUTTERWAVE_PUBLIC_KEY = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || "";

// ── helpers ────────────────────────────────────────
function fmt(n, symbol = "₦") {
  return (
    symbol +
    n.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

function InputField({ label, id, type = "text", placeholder, value, onChange, error, half }) {
  return (
    <div className={half ? "col-span-2 sm:col-span-1" : "col-span-2"}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-[#141432]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`h-12 w-full rounded-xl border px-4 text-base outline-none transition ${
          error
            ? "border-rose-400 bg-rose-50 focus:border-rose-500"
            : "border-gray-200 bg-slate-50 focus:border-[#23195f]"
        }`}
      />
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  );
}

function SelectField({ label, id, value, onChange, error, children, half }) {
  return (
    <div className={half ? "col-span-2 sm:col-span-1" : "col-span-2"}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-[#141432]">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className={`h-12 w-full rounded-xl border px-4 text-base outline-none transition ${
          error
            ? "border-rose-400 bg-rose-50 focus:border-rose-500"
            : "border-gray-200 bg-slate-50 focus:border-[#23195f]"
        }`}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  );
}

// ── Step indicator ─────────────────────────────────
function StepBar({ current }) {
  const steps = ["Shipping", "Payment", "Review"];
  return (
    <div className="flex items-center justify-center gap-0">
      {steps.map((label, i) => {
        const idx = i + 1;
        const done = idx < current;
        const active = idx === current;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all ${
                  done
                    ? "bg-emerald-500 text-white"
                    : active
                    ? "bg-[#23195f] text-white"
                    : "bg-gray-200 text-slate-400"
                }`}
              >
                {done ? <i className="fa-solid fa-check text-xs"></i> : idx}
              </div>
              <span
                className={`mt-1.5 text-xs font-semibold ${
                  active ? "text-[#23195f]" : done ? "text-emerald-500" : "text-slate-400"
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`mx-2 mb-5 h-0.5 w-16 sm:w-24 transition-all ${
                  done ? "bg-emerald-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Nigerian states ────────────────────────────────
const NG_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT - Abuja","Gombe",
  "Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos",
  "Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto",
  "Taraba","Yobe","Zamfara",
];

// ── Payment methods ────────────────────────────────
const PAYMENT_METHODS = [
  { id: "card",     label: "Card / Bank / USSD", icon: "fa-solid fa-credit-card", sub: "Secure checkout via Flutterwave" },
  { id: "transfer", label: "Bank Transfer",       icon: "fa-solid fa-building-columns", sub: "Manual transfer, verified within 1 day" },
  { id: "ussd",     label: "USSD (manual)",       icon: "fa-solid fa-mobile-screen", sub: "Dial your bank's short code" },
];

// ══════════════════════════════════════════════════
//  CHECKOUT PAGE
// ══════════════════════════════════════════════════
function Checkout({
  cart = [],
  setCart,
  deliveryFee = 0,
  vatRate = 0.075,
  currencySymbol = "₦",
  promoDiscount,
  onRemovePromo,
}) {
  const navigate = useNavigate();

  // ── load Flutterwave inline script once ────────────
  useEffect(() => {
    if (document.getElementById("flutterwave-inline-script")) return;
    const script = document.createElement("script");
    script.id = "flutterwave-inline-script";
    script.src = "https://checkout.flutterwave.com/v3.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // ── totals ──────────────────────────────────────
  const itemCount = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal  = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discount  = promoDiscount
    ? promoDiscount.type === "percent"
      ? subtotal * (promoDiscount.value / 100)
      : Math.min(promoDiscount.value, subtotal)
    : 0;
  const vat       = (subtotal - discount) * vatRate;
  const total     = subtotal - discount + deliveryFee + vat;
  const vatLabel  = `VAT (${(vatRate * 100).toFixed(1)}%)`;

  // ── steps ───────────────────────────────────────
  const [step, setStep] = useState(1);

  // ── shipping form ────────────────────────────────
  const [shipping, setShipping] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", state: "", zip: "",
  });

  const [shippingErrors, setShippingErrors] = useState({});

  const handleShipping = (field) => (e) =>
    setShipping((p) => ({ ...p, [field]: e.target.value }));

  const validateShipping = () => {
    const errs = {};
    if (!shipping.firstName.trim()) errs.firstName = "First name is required";
    if (!shipping.lastName.trim())  errs.lastName  = "Last name is required";
    if (!shipping.email.trim())     errs.email     = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(shipping.email)) errs.email = "Enter a valid email";
    if (!shipping.phone.trim())     errs.phone     = "Phone number is required";
    else if (!/^\+?[\d\s-]{10,}$/.test(shipping.phone)) errs.phone = "Enter a valid phone";
    if (!shipping.address.trim())   errs.address   = "Address is required";
    if (!shipping.city.trim())      errs.city      = "City is required";
    if (!shipping.state)            errs.state     = "Select a state";
    return errs;
  };

  // ── payment method ───────────────────────────────
  const [payMethod, setPayMethod] = useState("card");

  // ── order placed ─────────────────────────────────
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState("");

  // ── Flutterwave popup ───────────────────────────────
  const openFlutterwave = () =>
    new Promise((resolve, reject) => {
      if (!window.FlutterwaveCheckout) {
        reject(new Error("Payment gateway is still loading. Please try again in a moment."));
        return;
      }
      
      window.FlutterwaveCheckout({
        public_key: FLUTTERWAVE_PUBLIC_KEY,
        tx_ref: `NUGES-${Date.now()}`,
        amount: total,
        currency: "NGN",
        payment_options: "card, banktransfer, ussd",
        customer: {
          email: shipping.email,
          phone_number: shipping.phone,
          name: `${shipping.firstName} ${shipping.lastName}`,
        },
        customizations: {
          title: "Nuges Pharmacy",
          description: "Payment for order",
          logo: "https://your-logo-url-here.png", // Optional: Add your live logo URL here
        },
        callback: (response) => {
          if (response.status === "successful") {
            resolve(response.transaction_id || response.tx_ref);
          } else {
            reject(new Error("Payment was not successful."));
          }
        },
        onclose: () => reject(new Error("Payment window closed before completing payment.")),
      });
    });

  const placeOrder = async () => {
    setPlacing(true);
    setOrderError("");

    try {
      let paymentReference = null;

      if (payMethod === "card") {
        if (!FLUTTERWAVE_PUBLIC_KEY) {
          throw new Error("Card payment isn't configured yet — please choose Bank Transfer or USSD for now.");
        }
        paymentReference = await openFlutterwave();
      }

      const orderPayload = {
        items: cart.map((item) => ({
          productId: item.id,
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.qty,
          qty: item.qty,
        })),
        shippingAddress: shipping,
        shipping,
        paymentMethod: payMethod,
        paymentReference,
        paymentStatus: payMethod === "card" ? "paid" : "pending",
        promoCode: promoDiscount?.code || null,
        discount,
        totals: { subtotal, discount, deliveryFee, vat, total },
        subtotal,
        deliveryFee,
        vat,
        total,
      };

      const created = await api.createOrder(orderPayload);
      setCart && setCart([]);
      onRemovePromo && onRemovePromo();
      
      navigate("/orders", { replace: true, state: { justPlaced: true, order: created } });

    } catch (error) {
      setOrderError(error.message || "Unable to place order.");
    } finally {
      setPlacing(false);
    }
  };

  // ── step nav ─────────────────────────────────────
  const goNext = () => {
    if (step === 1) {
      const errs = validateShipping();
      if (Object.keys(errs).length) { setShippingErrors(errs); return; }
      setShippingErrors({});
    }
    setStep((p) => p + 1);
  };

  const goBack = () => setStep((p) => p - 1);

  // ══════════════════════════════════════════════
  //  RENDER
  // ══════════════════════════════════════════════
  return (
    <section className="min-h-screen bg-[#F6F7FB] px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* ── top bar ─────────────────────────────── */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-base font-semibold text-[#23195f] hover:opacity-75 transition"
          >
            <i className="fa-solid fa-arrow-left text-sm"></i> Back to Cart
          </Link>
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF0FF] text-[#23195f]">
            <i className="fa-solid fa-bag-shopping text-xl"></i>
          </span>
        </div>

        {/* ── step bar ─────────────────────────────── */}
        <div className="mb-10">
          <StepBar current={step} />
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">

          {/* ══════════════════════════════════════
              LEFT — form panels
          ══════════════════════════════════════ */}
          <div className="space-y-6">

            {/* ── STEP 1 : Shipping ──────────────── */}
            {step === 1 && (
              <div className="rounded-3xl bg-white p-7 shadow-sm sm:p-10">
                <h2 className="inline-flex items-center gap-3 text-2xl font-semibold text-[#141432]">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF0FF] text-[#23195f]">
                    <i className="fa-solid fa-location-dot"></i>
                  </span>
                  Shipping Details
                </h2>
                <p className="mt-1 pl-14 text-sm text-slate-500">
                  Where should we deliver your order?
                </p>

                <div className="mt-8 grid grid-cols-2 gap-5">
                  <InputField
                    label="First Name" id="firstName" placeholder="John"
                    value={shipping.firstName} onChange={handleShipping("firstName")}
                    error={shippingErrors.firstName} half
                  />
                  <InputField
                    label="Last Name" id="lastName" placeholder="Doe"
                    value={shipping.lastName} onChange={handleShipping("lastName")}
                    error={shippingErrors.lastName} half
                  />
                  <InputField
                    label="Email Address" id="email" type="email"
                    placeholder="john@example.com"
                    value={shipping.email} onChange={handleShipping("email")}
                    error={shippingErrors.email}
                  />
                  <InputField
                    label="Phone Number" id="phone" type="tel"
                    placeholder="+234 800 000 0000"
                    value={shipping.phone} onChange={handleShipping("phone")}
                    error={shippingErrors.phone}
                  />
                  <InputField
                    label="Street Address" id="address"
                    placeholder="12 Adeola Odeku Street"
                    value={shipping.address} onChange={handleShipping("address")}
                    error={shippingErrors.address}
                  />
                  <InputField
                    label="City" id="city" placeholder="Lagos"
                    value={shipping.city} onChange={handleShipping("city")}
                    error={shippingErrors.city} half
                  />
                  <SelectField
                    label="State" id="state"
                    value={shipping.state} onChange={handleShipping("state")}
                    error={shippingErrors.state} half
                  >
                    <option value="">Select state</option>
                    {NG_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </SelectField>
                  <InputField
                    label="Postal Code (optional)" id="zip"
                    placeholder="100001"
                    value={shipping.zip} onChange={handleShipping("zip")}
                    half
                  />
                </div>

                {/* delivery note */}
                <div className="mt-6 rounded-2xl bg-[#EEF0FF] p-4 text-sm text-[#23195f]">
                  <i className="fa-solid fa-circle-info mr-2"></i>
                  Estimated delivery: <strong>3 – 5 business days</strong> within Nigeria.
                </div>
              </div>
            )}

            {/* ── STEP 2 : Payment ───────────────── */}
            {step === 2 && (
              <div className="rounded-3xl bg-white p-7 shadow-sm sm:p-10">
                <h2 className="inline-flex items-center gap-3 text-2xl font-semibold text-[#141432]">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF0FF] text-[#23195f]">
                    <i className="fa-solid fa-credit-card"></i>
                  </span>
                  Payment Method
                </h2>
                <p className="mt-1 pl-14 text-sm text-slate-500">
                  Choose how you'd like to pay.
                </p>

                {/* method tabs */}
                <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPayMethod(m.id)}
                      className={`flex flex-row items-center gap-3 rounded-2xl border-2 p-4 text-left transition sm:flex-col sm:items-center sm:gap-2 sm:text-center ${
                        payMethod === m.id
                          ? "border-[#23195f] bg-[#EEF0FF] text-[#23195f]"
                          : "border-gray-200 bg-white text-slate-500 hover:border-[#23195f]/40"
                      }`}
                    >
                      <i className={`${m.icon} text-xl`}></i>
                      <span>
                        <span className="block text-sm font-semibold leading-tight">{m.label}</span>
                        <span className="block text-xs font-normal leading-tight text-slate-400">{m.sub}</span>
                      </span>
                    </button>
                  ))}
                </div>

                {/* card / flutterwave info */}
                {payMethod === "card" && (
                  <div className="mt-8 rounded-2xl bg-[#EEF0FF] p-6 text-sm text-[#23195f] space-y-3">
                    <p className="inline-flex items-center gap-2 font-semibold text-base">
                      <i className="fa-solid fa-shield-halved"></i> Secure checkout
                    </p>
                    <p className="text-slate-600">
                      When you place your order, a secure Flutterwave window will open where you can
                      pay by card, bank account, or USSD — your details never touch our servers.
                    </p>
                    <div className="flex items-center gap-3 pt-1">
                      <img src={verveLogo}      alt="Verve"      className="h-6 w-auto object-contain opacity-70" />
                      <img src={mastercardLogo} alt="Mastercard" className="h-7 w-auto object-contain opacity-70" />
                      <img src={visaLogo}       alt="Visa"       className="h-5 w-auto object-contain opacity-70" />
                    </div>
                    {!FLUTTERWAVE_PUBLIC_KEY && (
                      <p className="rounded-xl bg-amber-50 p-3 text-xs font-semibold text-amber-700">
                        <i className="fa-solid fa-triangle-exclamation mr-1"></i>
                        Card payments aren't live yet on this store — choose Bank Transfer or USSD below to continue.
                      </p>
                    )}
                  </div>
                )}

                {/* bank transfer info */}
                {payMethod === "transfer" && (
                  <div className="mt-8 rounded-2xl bg-[#EEF0FF] p-6 text-sm text-[#23195f] space-y-3">
                    <p className="font-semibold text-base">Transfer to this account:</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Bank</span>
                        <span className="font-semibold">First Bank Nigeria</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Account Name</span>
                        <span className="font-semibold">Nuges Pharmaceuticals Ltd</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Account Number</span>
                        <span className="font-semibold tracking-widest">3012345678</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Amount</span>
                        <span className="font-bold text-[#23195f]">{fmt(total, currencySymbol)}</span>
                      </div>
                    </div>
                    <p className="mt-2 rounded-xl bg-white/60 p-3 text-xs text-slate-500">
                      <i className="fa-solid fa-circle-info mr-1"></i>
                      Your order will be processed once payment is confirmed (within 1 business day).
                    </p>
                  </div>
                )}

                {/* ussd info */}
                {payMethod === "ussd" && (
                  <div className="mt-8 rounded-2xl bg-[#EEF0FF] p-6 text-sm text-[#23195f] space-y-4">
                    <p className="font-semibold text-base">Dial the code for your bank:</p>
                    {[
                      { bank: "GTBank",    code: "*737*Amount#" },
                      { bank: "First Bank",code: "*894*Amount#" },
                      { bank: "Access",    code: "*901*Amount#" },
                      { bank: "Zenith",    code: "*966*Amount#" },
                      { bank: "UBA",       code: "*919*Amount#" },
                    ].map((u) => (
                      <div key={u.bank} className="flex items-center justify-between rounded-xl bg-white/60 px-4 py-3">
                        <span className="font-semibold">{u.bank}</span>
                        <span className="rounded-lg bg-[#23195f] px-3 py-1 text-xs font-bold text-white tracking-widest">
                          {u.code}
                        </span>
                      </div>
                    ))}
                    <p className="text-xs text-slate-500">
                      Replace <strong>Amount</strong> with{" "}
                      <strong>{fmt(total, currencySymbol)}</strong>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 3 : Review ────────────────── */}
            {step === 3 && (
              <div className="rounded-3xl bg-white p-7 shadow-sm sm:p-10">
                <h2 className="inline-flex items-center gap-3 text-2xl font-semibold text-[#141432]">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF0FF] text-[#23195f]">
                    <i className="fa-solid fa-clipboard-check"></i>
                  </span>
                  Review Order
                </h2>
                <p className="mt-1 pl-14 text-sm text-slate-500">
                  Please confirm everything before placing your order.
                </p>

                {/* shipping summary */}
                <div className="mt-8 rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-[#141432]">
                      <i className="fa-solid fa-location-dot mr-2 text-[#23195f]"></i>
                      Shipping Address
                    </p>
                    <button
                      onClick={() => setStep(1)}
                      className="text-xs font-semibold text-[#23195f] hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="mt-3 text-sm text-slate-600 space-y-0.5">
                    <p className="font-semibold text-[#141432]">
                      {shipping.firstName} {shipping.lastName}
                    </p>
                    <p>{shipping.address}</p>
                    <p>{shipping.city}, {shipping.state}</p>
                    <p>{shipping.email}</p>
                    <p>{shipping.phone}</p>
                  </div>
                </div>

                {/* payment summary */}
                <div className="mt-4 rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-[#141432]">
                      <i className="fa-solid fa-credit-card mr-2 text-[#23195f]"></i>
                      Payment
                    </p>
                    <button
                      onClick={() => setStep(2)}
                      className="text-xs font-semibold text-[#23195f] hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">
                    {payMethod === "card" && "Card / Bank / USSD via Flutterwave"}
                    {payMethod === "transfer" && "Bank Transfer"}
                    {payMethod === "ussd" && "USSD Payment"}
                  </p>
                </div>

                {/* items */}
                <div className="mt-4 rounded-2xl border border-gray-100 p-5">
                  <p className="font-semibold text-[#141432]">
                    <i className="fa-solid fa-box mr-2 text-[#23195f]"></i>
                    Items ({itemCount})
                  </p>
                  <div className="mt-4 space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-14 w-14 rounded-xl object-cover bg-gray-100"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-semibold text-[#141432]">
                            {item.name}
                          </p>
                          <p className="text-xs text-slate-500">Qty: {item.qty}</p>
                        </div>
                        <span className="text-sm font-semibold text-[#141432]">
                          {fmt(item.price * item.qty, currencySymbol)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {orderError && (
              <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-semibold text-rose-600">
                <i className="fa-solid fa-circle-exclamation mr-2"></i>
                {orderError}
              </div>
            )}

            {/* ── nav buttons ─────────────────────── */}
            <div className="flex items-center justify-between gap-4">
              {step > 1 ? (
                <button
                  onClick={goBack}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-7 py-3.5 text-base font-semibold text-[#141432] transition hover:border-[#23195f]"
                >
                  <i className="fa-solid fa-arrow-left text-sm"></i> Back
                </button>
              ) : (
                <Link
                  to="/cart"
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-7 py-3.5 text-base font-semibold text-[#141432] transition hover:border-[#23195f]"
                >
                  <i className="fa-solid fa-arrow-left text-sm"></i> Cart
                </Link>
              )}

              {step < 3 ? (
                <button
                  onClick={goNext}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#23195f] to-[#5B3DF5] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:opacity-95"
                >
                  Continue <i className="fa-solid fa-arrow-right text-sm"></i>
                </button>
              ) : (
                <button
                  onClick={placeOrder}
                  disabled={placing}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#23195f] to-[#5B3DF5] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:opacity-95 disabled:opacity-70"
                >
                  {placing ? (
                    <>
                      <i className="fa-solid fa-spinner animate-spin"></i> Placing Order…
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-lock text-sm"></i> Place Order
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* ══════════════════════════════════════
              RIGHT — order summary (sticky)
          ══════════════════════════════════════ */}
          <div className="space-y-6">
            <div className="sticky top-6 space-y-6">

              {/* summary card */}
              <div className="rounded-3xl bg-white p-7 shadow-sm">
                <h3 className="inline-flex items-center gap-2 text-xl font-semibold text-[#141432]">
                  <i className="fa-regular fa-file-lines text-[#23195f]"></i>
                  Order Summary
                </h3>

                {/* items list */}
                <div className="mt-6 space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-12 w-12 rounded-xl object-cover bg-gray-100"
                        />
                        <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#23195f] text-xs font-bold text-white">
                          {item.qty}
                        </span>
                      </div>
                      <p className="flex-1 truncate text-sm font-semibold text-[#141432]">
                        {item.name}
                      </p>
                      <span className="text-sm font-semibold text-[#141432]">
                        {fmt(item.price * item.qty, currencySymbol)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-3 border-t pt-6 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#141432]">
                      {fmt(subtotal, currencySymbol)}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount ({promoDiscount.code})</span>
                      <span className="font-semibold">− {fmt(discount, currencySymbol)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span className="inline-flex items-center gap-1.5">
                      <i className="fa-solid fa-truck text-xs"></i> Delivery Fee
                    </span>
                    <span className={`font-semibold ${deliveryFee === 0 ? "text-emerald-600" : "text-[#141432]"}`}>
                      {deliveryFee === 0 ? "FREE" : fmt(deliveryFee, currencySymbol)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>{vatLabel}</span>
                    <span className="font-semibold text-[#141432]">
                      {fmt(vat, currencySymbol)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-dashed pt-3">
                    <span className="text-base font-semibold text-[#141432]">Total</span>
                    <span className="text-xl font-bold text-[#23195f]">
                      {fmt(total, currencySymbol)}
                    </span>
                  </div>
                </div>
              </div>

              {/* security badge */}
              <div className="rounded-3xl bg-white p-6 shadow-sm text-center space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Secured & Accepted Payments
                </p>
                <div className="flex items-center justify-center gap-6">
                  <img src={verveLogo}      alt="Verve"      className="h-10 w-auto object-contain" />
                  <img src={mastercardLogo} alt="Mastercard" className="h-12 w-auto object-contain" />
                  <img src={visaLogo}       alt="Visa"       className="h-8 w-auto object-contain" />
                </div>
                <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
                  <span><i className="fa-solid fa-lock mr-1"></i>SSL Encrypted</span>
                  <span><i className="fa-solid fa-shield-halved mr-1"></i>256-bit Security</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Checkout;