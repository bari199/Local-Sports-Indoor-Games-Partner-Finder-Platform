import { FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { MdQrCode2 } from "react-icons/md";

const columns = [
  {
    title: "Company",
    links: ["About Us", "Blogs", "Contact", "Careers", "Partner With Us", "Buy Gift Cards"],
  },
  {
    title: "Social",
    links: ["Instagram", "Facebook", "LinkedIn", "Twitter"],
  },
  {
    title: "Support",
    links: ["FAQs", "Privacy Policy", "Terms of Service", "Cancellation Policy", "Posh Policy"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 px-4 pb-8 pt-10 text-slate-300 md:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 md:grid-cols-5">
        <div className="col-span-2 md:col-span-2">
          <div className="mb-2 flex items-center gap-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              P
            </div>
            <span className="text-base font-bold text-white">PLAYO</span>
          </div>
          <p className="text-xs text-slate-500">© 2024 Playo Sports Solutions Pvt. Ltd.</p>
          <p className="text-xs text-slate-500">All Rights Reserved.</p>
          <div className="mt-4 flex gap-3">
            {[FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn].map((Icon, i) => (
              <button
                key={i}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="mb-3 text-sm font-semibold text-white">{col.title}</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {col.links.map((l) => (
                <li key={l} className="cursor-pointer hover:text-white">
                  {l}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="col-span-2 flex items-center justify-start gap-3 rounded-xl bg-slate-900 p-4 md:col-span-1 md:justify-center">
          <MdQrCode2 className="h-10 w-10 text-white" />
          <span className="text-xs font-semibold text-white">
            DOWNLOAD
            <br />
            THE APP
          </span>
        </div>
      </div>
    </footer>
  );
}