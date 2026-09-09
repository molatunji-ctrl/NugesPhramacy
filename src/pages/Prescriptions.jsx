import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AccountShell } from "./Profile";
import { api, normalizeList, normalizeProduct } from "../service/api";

const statusStyles = {
  PENDING: "bg-amber-50 text-amber-700",
  APPROVED: "bg-emerald-50 text-emerald-700",
  REJECTED: "bg-rose-50 text-rose-700",
};

function readableSize(bytes) {
  const value = Number(bytes || 0);
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function Prescriptions() {
  const [searchParams] = useSearchParams();
  const requestedProductId = searchParams.get("productId") || "";
  const [products, setProducts] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [form, setForm] = useState({ productId: requestedProductId, quantity: 1, file: null });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const prescriptionProducts = useMemo(
    () => products.filter((product) => product.prescriptionRequired),
    [products]
  );

  useEffect(() => {
    let mounted = true;

    Promise.all([
      api.getPrescriptions(),
      api.getProducts({ size: 50 }),
    ])
      .then(([prescriptionData, productData]) => {
        if (!mounted) return;
        const loadedProducts = normalizeList(productData).map(normalizeProduct);
        setProducts(loadedProducts);
        setPrescriptions(normalizeList(prescriptionData));
        setForm((current) => ({
          ...current,
          productId: current.productId
            || String(loadedProducts.find((product) => product.prescriptionRequired)?.id || ""),
        }));
        setError("");
      })
      .catch((loadError) => {
        if (mounted) setError(loadError.message || "Unable to load prescriptions.");
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, []);

  const submitPrescription = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    setError("");
    setSuccess("");

    if (!form.file) {
      setError("Select a JPEG, PNG, or PDF prescription file.");
      return;
    }
    if (form.file.size > 5 * 1024 * 1024) {
      setError("Prescription file must not exceed 5 MB.");
      return;
    }

    setUploading(true);
    try {
      const uploaded = await api.uploadPrescription(
        form.productId,
        Number(form.quantity),
        form.file
      );
      setPrescriptions((current) => [uploaded, ...current]);
      setForm((current) => ({ ...current, file: null }));
      formElement.reset();
      setSuccess("Prescription uploaded. A pharmacist will review it before checkout.");
    } catch (uploadError) {
      setError(uploadError.message || "Unable to upload this prescription.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <AccountShell>
      <div>
        <h1 className="text-3xl font-bold text-[#141432]">My prescriptions</h1>
        <p className="mt-2 text-sm text-slate-500">
          Upload a clear prescription for a medicine, then wait for pharmacist approval before checkout.
        </p>
      </div>

      <form onSubmit={submitPrescription} className="mt-6 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-semibold text-[#141432]">Upload prescription</h2>
        <p className="mt-2 text-sm text-slate-500">JPEG, PNG, or PDF only · Maximum size 5 MB</p>

        <div className="mt-6 grid gap-5 sm:grid-cols-[1fr_140px]">
          <div>
            <label htmlFor="prescriptionProduct" className="mb-1.5 block text-sm font-semibold text-[#141432]">Medicine</label>
            <select
              id="prescriptionProduct"
              value={form.productId}
              onChange={(event) => setForm((current) => ({ ...current, productId: event.target.value }))}
              required
              className="h-12 w-full rounded-xl border border-gray-200 bg-slate-50 px-4 outline-none focus:border-[#23195f]"
            >
              <option value="">Select medicine</option>
              {prescriptionProducts.map((product) => (
                <option key={product.id} value={product.id}>{product.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="prescriptionQuantity" className="mb-1.5 block text-sm font-semibold text-[#141432]">Quantity</label>
            <input
              id="prescriptionQuantity"
              type="number"
              min="1"
              max="100"
              value={form.quantity}
              onChange={(event) => setForm((current) => ({ ...current, quantity: event.target.value }))}
              required
              className="h-12 w-full rounded-xl border border-gray-200 bg-slate-50 px-4 outline-none focus:border-[#23195f]"
            />
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="prescriptionFile" className="mb-1.5 block text-sm font-semibold text-[#141432]">Prescription file</label>
          <input
            id="prescriptionFile"
            type="file"
            accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
            onChange={(event) => setForm((current) => ({ ...current, file: event.target.files?.[0] || null }))}
            required
            className="block w-full rounded-xl border border-dashed border-gray-300 bg-slate-50 p-4 text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-[#EEF0FF] file:px-4 file:py-2 file:font-semibold file:text-[#23195f]"
          />
        </div>

        {error && <p role="alert" className="mt-5 rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-700">{error}</p>}
        {success && <p className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">{success}</p>}

        <button
          type="submit"
          disabled={uploading || prescriptionProducts.length === 0}
          className="mt-6 rounded-full bg-[#23195f] px-7 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? "Uploading…" : "Send for review"}
        </button>
      </form>

      <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-semibold text-[#141432]">Review status</h2>

        {loading ? (
          <div className="mt-5 space-y-3">
            {[1, 2].map((item) => <div key={item} className="skeleton h-28 rounded-2xl" />)}
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="mt-5 rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center text-slate-500">
            You have not uploaded a prescription yet.
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {prescriptions.map((prescription) => (
              <article key={prescription.id} className="rounded-2xl border border-gray-100 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-[#141432]">{prescription.productName}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Requested: {prescription.requestedQuantity} · {prescription.fileName} ({readableSize(prescription.fileSize)})
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Uploaded {new Date(prescription.createdAt).toLocaleString("en-NG")}
                    </p>
                  </div>
                  <span className={`rounded-full px-4 py-1.5 text-xs font-semibold ${statusStyles[prescription.status] || "bg-slate-100 text-slate-600"}`}>
                    {prescription.status}
                  </span>
                </div>

                {prescription.status === "APPROVED" && (
                  <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
                    Approved quantity: {prescription.approvedQuantity} · Remaining: {prescription.availableQuantity}
                  </p>
                )}
                {prescription.reviewReason && (
                  <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                    Pharmacist note: {prescription.reviewReason}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => window.open(api.prescriptionFileUrl(prescription.id), "_blank", "noopener,noreferrer")}
                  className="mt-4 text-sm font-semibold text-[#23195f] hover:underline"
                >
                  View uploaded file
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </AccountShell>
  );
}

export default Prescriptions;
