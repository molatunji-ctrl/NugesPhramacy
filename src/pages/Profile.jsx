import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { api, clearAuthData } from "../service/api";

function AccountShell({ children }) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try { await api.logout(); } catch (err) { console.error(err); }
    clearAuthData();
    navigate("/login", { replace: true });
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
      isActive ? "bg-[#23195f] text-white" : "text-slate-500 hover:bg-slate-100 hover:text-[#23195f]"
    }`;

  return (
    <div className="min-h-screen bg-[#F6F7FB]">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
          <Link to="/home" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1B1967] text-lg font-semibold text-white">N</div>
            <span className="text-xl font-bold text-[#1B1967]">Nuges</span>
          </Link>
          <button onClick={handleSignOut} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#141432] transition hover:border-[#23195f] hover:text-[#23195f]">
            <i className="fa-solid fa-arrow-right-from-bracket text-sm"></i>
            Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="space-y-2 lg:sticky lg:top-10 lg:self-start">
            <NavLink to="/profile" className={navLinkClass} end><i className="fa-regular fa-user"></i>My profile</NavLink>
            <NavLink to="/orders" className={navLinkClass}><i className="fa-solid fa-box"></i>My orders</NavLink>
          </aside>
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}

function Profile() {
  const [email, setEmail] = useState(() => localStorage.getItem("userEmail") || "");
  const [form, setForm] = useState({ fullName: "", phone: "", address: "", city: "", state: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    api.getProfile()
      .then((profile) => {
        if (!mounted) return;
        const user = profile.user || profile.data || profile;
        setEmail(user.email || localStorage.getItem("userEmail") || "");
        setForm({
          fullName: user.fullName || user.fullname || user.name || "",
          phone: user.phone || user.phoneNumber || "",
          address: user.address || user.deliveryAddress || "",
          city: user.city || "",
          state: user.state || "",
        });
        setError("");
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.status === 403 ? "Please sign in to load and edit your profile." : err.message || "Unable to load profile.");
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      await api.updateProfile({ ...form, email, fullname: form.fullName });
      localStorage.setItem("userName", form.fullName);
      setSaved(true);
    } catch (err) {
      setError(err.message || "Unable to save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AccountShell>
      <h1 className="text-3xl font-bold text-[#141432]">My profile</h1>

      <form onSubmit={handleSave} className="mt-6 rounded-3xl bg-white p-7 shadow-sm sm:p-10">
        <p className="text-sm text-slate-500">Email: <span className="text-[#141432]">{email || "Not available"}</span></p>

        {loading && <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500"><i className="fa-solid fa-spinner animate-spin mr-2"></i>Loading profile…</div>}
        {error && <div className="mt-6 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-semibold text-rose-600"><i className="fa-solid fa-circle-exclamation mr-2"></i>{error}</div>}

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="fullName" className="mb-1.5 block text-sm font-semibold text-[#141432]">Full name</label>
            <input id="fullName" type="text" value={form.fullName} onChange={handleChange("fullName")} className="h-12 w-full rounded-xl border border-gray-200 bg-slate-50 px-4 text-base outline-none transition focus:border-[#23195f] focus:bg-white" />
          </div>
          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-[#141432]">Phone</label>
            <input id="phone" type="tel" value={form.phone} onChange={handleChange("phone")} className="h-12 w-full rounded-xl border border-gray-200 bg-slate-50 px-4 text-base outline-none transition focus:border-[#23195f] focus:bg-white" />
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="address" className="mb-1.5 block text-sm font-semibold text-[#141432]">Delivery address</label>
          <input id="address" type="text" value={form.address} onChange={handleChange("address")} className="h-12 w-full rounded-xl border border-gray-200 bg-slate-50 px-4 text-base outline-none transition focus:border-[#23195f] focus:bg-white" />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="city" className="mb-1.5 block text-sm font-semibold text-[#141432]">City</label>
            <input id="city" type="text" value={form.city} onChange={handleChange("city")} className="h-12 w-full rounded-xl border border-gray-200 bg-slate-50 px-4 text-base outline-none transition focus:border-[#23195f] focus:bg-white" />
          </div>
          <div>
            <label htmlFor="state" className="mb-1.5 block text-sm font-semibold text-[#141432]">State</label>
            <input id="state" type="text" value={form.state} onChange={handleChange("state")} className="h-12 w-full rounded-xl border border-gray-200 bg-slate-50 px-4 text-base outline-none transition focus:border-[#23195f] focus:bg-white" />
          </div>
        </div>

        <div className="mt-8 flex items-center gap-4">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-[#23195f] px-7 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70">
            {saving ? <><i className="fa-solid fa-spinner animate-spin"></i> Saving…</> : "Save changes"}
          </button>
          {saved && <p className="animate-fade-in-up text-sm font-semibold text-emerald-600"><i className="fa-solid fa-check mr-1"></i> Saved</p>}
        </div>
      </form>
    </AccountShell>
  );
}

export default Profile;
export { AccountShell };
