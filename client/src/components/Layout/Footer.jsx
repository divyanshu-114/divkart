import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Leaf } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    company: [
      { name: "About Us",  path: "/about" },
      { name: "Careers",   path: "#" },
      { name: "Press",     path: "#" },
      { name: "Blog",      path: "#" },
    ],
    customer: [
      { name: "Contact Us",    path: "/contact" },
      { name: "FAQ",           path: "/faq" },
      { name: "Shipping Info", path: "#" },
      { name: "Returns",       path: "#" },
    ],
  };

  const socialLinks = [
    { icon: Facebook,  href: "#", label: "Facebook" },
    { icon: Twitter,   href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube,   href: "#", label: "YouTube" },
  ];

  return (
    <footer className="bg-brand-green mt-0 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between mb-14 gap-12">

          {/* Brand & Contact */}
          <div className="md:w-1/3">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <Leaf className="w-4 h-4 text-accent-foreground" strokeWidth={2.5} />
              </div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">DivKart</h2>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xs">
              Your trusted e-commerce platform for quality products, delivered fast and sustainably.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-white/60">
                <Mail className="w-4 h-4 text-accent shrink-0" strokeWidth={2} />
                <span className="text-sm">support@divkart.com</span>
              </div>
              <div className="flex items-center gap-3 text-white/60">
                <Phone className="w-4 h-4 text-accent shrink-0" strokeWidth={2} />
                <span className="text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-white/60">
                <MapPin className="w-4 h-4 text-accent shrink-0" strokeWidth={2} />
                <span className="text-sm">New Delhi, India</span>
              </div>
            </div>
          </div>

          <div className="flex gap-16 md:gap-24">
            {/* Company Links */}
            <div>
              <h3 className="text-white font-bold text-sm mb-5 tracking-wide">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-white/55 hover:text-white text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer */}
            <div>
              <h3 className="text-white font-bold text-sm mb-5 tracking-wide">Customer Care</h3>
              <ul className="space-y-3">
                {footerLinks.customer.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-white/55 hover:text-white text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/15 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="text-white/40 hover:text-white transition-colors"
              >
                <s.icon className="w-4 h-4" strokeWidth={2} />
              </a>
            ))}
          </div>
          <div className="text-center md:text-right">
            <p className="text-white/40 text-xs">© 2024 DivKart. All rights reserved.</p>
            <p className="text-white/30 text-xs mt-0.5">Developed by Divyanshu Raj</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
