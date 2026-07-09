import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white text-gray-700">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1fr] xl:items-start">
          <div className="space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#23195f] text-lg font-semibold text-white">
              N
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#23195f]">Nuges</h2>
              <p className="text-xs uppercase tracking-[0.18em] text-gray-400">PHARMACEUTICALS LTD</p>
            </div>
            <p className="max-w-sm text-sm text-gray-500">...Your partner in sound health.</p>
          </div>

          <div className="pt-4">
            <h3 className="text-sm font-semibold text-[#23195f]">Shop</h3>
            <ul className="mt-5 space-y-3 text-sm text-gray-600">
              <li>
                <Link to="/Shop" className="hover:text-[#23195f]">Prescription</Link>
              </li>
              <li>
                <a href="#" className="hover:text-[#23195f]">Wellness</a>
              </li>
              <li>
                <a href="#" className="hover:text-[#23195f]">Mother & Baby</a>
              </li>
              <li>
                <a href="#" className="hover:text-[#23195f]">Personal Care</a>
              </li>
            </ul>
          </div>

          <div className="pt-4">
            <h3 className="text-sm font-semibold text-[#23195f]">Company</h3>
            <ul className="mt-5 space-y-3 text-sm text-gray-600">
              <li>
                <a href="/about" className="hover:text-[#23195f]">About us</a>
              </li>
              <li>
                <a href="/service" className="hover:text-[#23195f]">Services</a>
              </li>
              <li>
                <a href="/contact" className="hover:text-[#23195f]">Contact</a>
              </li>
              <li>
                <a href="#" className="hover:text-[#23195f]">Careers</a>
              </li>
            </ul>
          </div>

          <div className="pt-4">
            <h3 className="text-sm font-semibold text-[#23195f]">Support</h3>
            <ul className="mt-5 space-y-3 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-[#23195f]">Delivery</a>
              </li>
              <li>
                <a href="#" className="hover:text-[#23195f]">Returns</a>
              </li>
              <li>
                <a href="#" className="hover:text-[#23195f]">Privacy</a>
              </li>
              <li>
                <a href="#" className="hover:text-[#23195f]">Terms</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-gray-100 pt-6 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Nuges Pharmaceuticals Ltd. All rights reserved.</p>
          <p>Egbeda, Lagos · NAFDAC verified</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
