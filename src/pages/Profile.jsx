import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

// ── Account layout shared shell (top bar + sidebar) ─────────────
function AccountShell({ children }) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // No real auth/session yet — just send the user back to login.
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
      isActive
        ? "bg-[#23195f] text-white"
        : "text-slate-500 hover:bg-slate-100 hover:text-[#23195f]"
    }`;

  return (
    <div className="min-h-screen bg-[#F6F7FB]">
      {/* ── top bar ─────────────────────────────── */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
          <Link to="/home" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1B1967] text-lg font-semibold text-white">
              N
            </div>
            <span className="text-xl font-bold text-[#1B1967]">Nuges</span>
          </Link>

          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#141432] transition hover:border-[#23195f] hover:text-[#23195f]"
          >
            <i className="fa-solid fa-arrow-right-from-bracket text-sm"></i>
            Sign out
          </button>
        </div>
      </header>

      {/* ── body ────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* sidebar */}
          <aside className="space-y-2 lg:sticky lg:top-10 lg:self-start">
            <NavLink to="/profile" className={navLinkClass} end>
              <i className="fa-regular fa-user"></i>
              My profile
            </NavLink>
            <NavLink to="/orders" className={navLinkClass}>
              <i className="fa-solid fa-box"></i>
              My orders
            </NavLink>
          </aside>

          {/* page content */}
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}

// ── My Profile page ──────────────────────────────────────────────
function Profile() {
  const [email] = useState("molatunji371@gmail.com"); // placeholder until real auth exists
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    // No backend wired up yet — simulate a save.
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
    }, 900);
  };

  return (
    <AccountShell>
      <h1 className="text-3xl font-bold text-[#141432]">My profile</h1>

      <form
        onSubmit={handleSave}
        className="mt-6 rounded-3xl bg-white p-7 shadow-sm sm:p-10"
      >
        <p className="text-sm text-slate-500">
          Email: <span className="text-[#141432]">{email}</span>
        </p>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="fullName" className="mb-1.5 block text-sm font-semibold text-[#141432]">
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              value={form.fullName}
              onChange={handleChange("fullName")}
              className="h-12 w-full rounded-xl border border-gray-200 bg-slate-50 px-4 text-base outline-none transition focus:border-[#23195f] focus:bg-white"
            />
          </div>
          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-[#141432]">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange("phone")}
              className="h-12 w-full rounded-xl border border-gray-200 bg-slate-50 px-4 text-base outline-none transition focus:border-[#23195f] focus:bg-white"
            />
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="address" className="mb-1.5 block text-sm font-semibold text-[#141432]">
            Delivery address
          </label>
          <input
            id="address"
            type="text"
            value={form.address}
            onChange={handleChange("address")}
            className="h-12 w-full rounded-xl border border-gray-200 bg-slate-50 px-4 text-base outline-none transition focus:border-[#23195f] focus:bg-white"
          />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="city" className="mb-1.5 block text-sm font-semibold text-[#141432]">
              City
            </label>
            <input
              id="city"
              type="text"
              value={form.city}
              onChange={handleChange("city")}
              className="h-12 w-full rounded-xl border border-gray-200 bg-slate-50 px-4 text-base outline-none transition focus:border-[#23195f] focus:bg-white"
            />
          </div>
          <div>
            <label htmlFor="state" className="mb-1.5 block text-sm font-semibold text-[#141432]">
              State
            </label>
            <input
              id="state"
              type="text"
              value={form.state}
              onChange={handleChange("state")}
              className="h-12 w-full rounded-xl border border-gray-200 bg-slate-50 px-4 text-base outline-none transition focus:border-[#23195f] focus:bg-white"
            />
          </div>
        </div>

        <div className="mt-8 flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-[#23195f] px-7 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? (
              <>
                <i className="fa-solid fa-spinner animate-spin"></i> Saving…
              </>
            ) : (
              "Save changes"
            )}
          </button>
          {saved && (
            <p className="animate-fade-in-up text-sm font-semibold text-emerald-600">
              <i className="fa-solid fa-check mr-1"></i> Saved
            </p>
          )}
        </div>
      </form>
    </AccountShell>
  );
}

export default Profile;
export { AccountShell };
