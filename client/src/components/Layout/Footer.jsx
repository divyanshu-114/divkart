import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";

const Footer = () => {
  const footerLinks = {
    company: [
      { name: "About Us", path: "/about" },
      { name: "Careers", path: "#" },
      { name: "Press", path: "#" },
      { name: "Blog", path: "#" },
    ],
    customer: [
      { name: "Contact Us", path: "/contact" },
      { name: "FAQ", path: "/faq" },
      { name: "Shipping Info", path: "#" },
      { name: "Returns", path: "#" },
    ],
    legal: [
      { name: "Privacy Policy", path: "#" },
      { name: "Terms of Service", path: "#" },
      { name: "Cookie Policy", path: "#" },
      { name: "Security", path: "#" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="bg-background border-t border-border mt-0 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between mb-16 gap-12">
          {/* Brand & Contact */}
          <div className="md:w-1/3">
            <h2 className="text-2xl font-bold text-foreground mb-6 tracking-[0.25em] uppercase">
              Divkart
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Mail className="w-4 h-4 text-foreground" strokeWidth={1.5} />
                <span className="text-xs uppercase tracking-widest font-medium">support@shopmate.com</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Phone className="w-4 h-4 text-foreground" strokeWidth={1.5} />
                <span className="text-xs uppercase tracking-widest font-medium">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <MapPin className="w-4 h-4 text-foreground" strokeWidth={1.5} />
                <span className="text-xs uppercase tracking-widest font-medium">San Francisco, CA</span>
              </div>
            </div>
          </div>

          <div className="flex gap-12 md:gap-24">
            {/* Company Links */}
            <div>
              <h3 className="text-sm font-bold text-foreground mb-6 uppercase tracking-widest">
                Company
              </h3>
              <ul className="space-y-4">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-block uppercase tracking-widest font-medium"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="text-sm font-bold text-foreground mb-6 uppercase tracking-widest">
                Customer Care
              </h3>
              <ul className="space-y-4">
                {footerLinks.customer.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-block uppercase tracking-widest font-medium"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border">
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <social.icon className="w-4 h-4" strokeWidth={1.5} />
              </a>
            ))}
          </div>

          <div className="text-center md:text-right">
            <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-medium">© 2024 Divkart. All rights reserved.</p>
            <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-medium mt-1">Developed By Divyanshu Singh</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
