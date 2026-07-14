import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../service/api";

import verveLogo from "../assets/Icons/verve.png";
import mastercardLogo from "../assets/Icons/mastercard.jpg";
import visaLogo from "../assets/Icons/visa.png";

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
  { id: "card",   label: "Debit / Credit Card", icon: "fa-solid fa-credit-card" },
  { id: "transfer", label: "Bank Transfer",     icon: "fa-solid fa-building-columns" },
  { id: "ussd",   label: "USSD",                icon: "fa-solid fa-mobile-screen" },
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
}) {
  const navigate = useNavigate();

  // ── totals ──────────────────────────────────────
  const itemCount = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal  = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const vat       = subtotal * vatRate;
  const total     = subtotal + deliveryFee + vat;
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

  // ── payment form ─────────────────────────────────
  const [payMethod, setPayMethod]   = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName]     = useState("");
  const [expiry, setExpiry]         = useState("");
  const [cvv, setCvv]               = useState("");
  const [payErrors, setPayErrors]   = useState({});
  const [saveCard, setSaveCard]     = useState(false);

  const formatCardNumber = (v) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  };

  const validatePayment = () => {
    const errs = {};
    if (payMethod === "card") {
      if (!cardName.trim())                         errs.cardName   = "Name on card is required";
      if (cardNumber.replace(/\s/g, "").length < 16) errs.cardNumber = "Enter a valid 16-digit card number";
      if (!expiry || expiry.length < 5)             errs.expiry     = "Enter a valid expiry (MM/YY)";
      if (!cvv || cvv.length < 3)                   errs.cvv        = "Enter a valid CVV";
    }
    return errs;
  };

  // ── order placed ─────────────────────────────────
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState("");

  const placeOrder = async () => {
    setPlacing(true);
    setOrderError("");

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
      totals: { subtotal, deliveryFee, vat, total },
      subtotal,
      deliveryFee,
      vat,
      total,
    };

    try {
      const created = await api.createOrder(orderPayload);
      setCart && setCart([]);
      navigate("/orders", { replace: true, state: { justPlaced: true, order: created } });
    } catch (error) {
      setOrderError(error.status === 403 ? "Please sign in before placing your order." : error.message || "Unable to place order.");
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
    if (step === 2) {
      const errs = validatePayment();
      if (Object.keys(errs).length) { setPayErrors(errs); return; }
      setPayErrors({});
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
                      className={`flex flex-row items-center gap-3 rounded-2xl border-2 p-4 text-sm font-semibold transition sm:flex-col sm:gap-2 ${
                        payMethod === m.id
                          ? "border-[#23195f] bg-[#EEF0FF] text-[#23195f]"
                          : "border-gray-200 bg-white text-slate-500 hover:border-[#23195f]/40"
                      }`}
                    >
                      <i className={`${m.icon} text-xl`}></i>
                      <span className="text-left text-xs leading-tight sm:text-center">{m.label}</span>
                    </button>
                  ))}
                </div>

                {/* card fields */}
                {payMethod === "card" && (
                  <div className="mt-8 space-y-5">
                    {/* card number with logo */}
                    <div className="col-span-2">
                      <label className="mb-1.5 block text-sm font-semibold text-[#141432]">
                        Card Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="0000 0000 0000 0000"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          className={`h-12 w-full rounded-xl border px-4 pr-28 text-base outline-none transition ${
                            payErrors.cardNumber
                              ? "border-rose-400 bg-rose-50"
                              : "border-gray-200 bg-slate-50 focus:border-[#23195f]"
                          }`}
                        />
                        <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
                          <img src={verveLogo}      alt="Verve"      className="h-5 w-auto object-contain opacity-70" />
                          <img src={mastercardLogo} alt="Mastercard" className="h-6 w-auto object-contain opacity-70" />
                          <img src={visaLogo}       alt="Visa"       className="h-4 w-auto object-contain opacity-70" />
                        </div>
                      </div>
                      {payErrors.cardNumber && (
                        <p className="mt-1 text-xs text-rose-500">{payErrors.cardNumber}</p>
                      )}
                    </div>

                    {/* name on card */}
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-[#141432]">
                        Name on Card
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className={`h-12 w-full rounded-xl border px-4 text-base outline-none transition ${
                          payErrors.cardName
                            ? "border-rose-400 bg-rose-50"
                            : "border-gray-200 bg-slate-50 focus:border-[#23195f]"
                        }`}
                      />
                      {payErrors.cardName && (
                        <p className="mt-1 text-xs text-rose-500">{payErrors.cardName}</p>
                      )}
                    </div>

                    {/* expiry + cvv */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-[#141432]">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={expiry}
                          onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                          className={`h-12 w-full rounded-xl border px-4 text-base outline-none transition ${
                            payErrors.expiry
                              ? "border-rose-400 bg-rose-50"
                              : "border-gray-200 bg-slate-50 focus:border-[#23195f]"
                          }`}
                        />
                        {payErrors.expiry && (
                          <p className="mt-1 text-xs text-rose-500">{payErrors.expiry}</p>
                        )}
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-[#141432]">
                          CVV
                        </label>
                        <div className="relative">
                          <input
                            type="password"
                            placeholder="•••"
                            maxLength={4}
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                            className={`h-12 w-full rounded-xl border px-4 text-base outline-none transition ${
                              payErrors.cvv
                                ? "border-rose-400 bg-rose-50"
                                : "border-gray-200 bg-slate-50 focus:border-[#23195f]"
                            }`}
                          />
                          <i className="fa-solid fa-lock absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400"></i>
                        </div>
                        {payErrors.cvv && (
                          <p className="mt-1 text-xs text-rose-500">{payErrors.cvv}</p>
                        )}
                      </div>
                    </div>

                    {/* save card */}
                    <label className="flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={saveCard}
                        onChange={(e) => setSaveCard(e.target.checked)}
                        className="h-4 w-4 accent-[#23195f]"
                      />
                      <span className="text-sm text-slate-600">
                        Save card for future purchases
                      </span>
                    </label>
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
                        <span className="font-semibold">ShopCart Ltd</span>
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
                    {payMethod === "card" && (
                      <>Card ending in <strong>{cardNumber.slice(-4)}</strong></>
                    )}
                    {payMethod === "transfer" && "Bank Transfer"}
                    {payMethod === "ussd"     && "USSD Payment"}
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
