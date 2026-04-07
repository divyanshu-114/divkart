import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent successfully!");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-2xl font-bold uppercase tracking-[0.2em] text-foreground mb-6">
            Contact Us
          </h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Get in touch with our team
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-12 border border-border p-12">
            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 bg-secondary border border-border flex items-center justify-center">
                <Mail className="w-5 h-5 text-foreground" strokeWidth={1.5} />
              </div>
              <div className="pt-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-foreground mb-2">Email</h3>
                <p className="text-sm text-muted-foreground">support@divkart.com</p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 bg-secondary border border-border flex items-center justify-center">
                <Phone className="w-5 h-5 text-foreground" strokeWidth={1.5} />
              </div>
              <div className="pt-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-foreground mb-2">Phone</h3>
                <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 bg-secondary border border-border flex items-center justify-center">
                <MapPin className="w-5 h-5 text-foreground" strokeWidth={1.5} />
              </div>
              <div className="pt-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-foreground mb-2">Address</h3>
                <p className="text-sm text-muted-foreground">
                  123 DivKart Street, City, ST 12345
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="border border-border p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="px-4 py-4 bg-transparent border-b border-border focus:outline-none focus:border-foreground text-foreground text-xs uppercase tracking-widest font-semibold transition-colors"
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="px-4 py-4 bg-transparent border-b border-border focus:outline-none focus:border-foreground text-foreground text-xs uppercase tracking-widest font-semibold transition-colors"
                  required
                />
              </div>

              <input
                type="text"
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="w-full px-4 py-4 bg-transparent border-b border-border focus:outline-none focus:border-foreground text-foreground text-xs uppercase tracking-widest font-semibold transition-colors"
                required
              />

              <textarea
                rows="6"
                placeholder="Your Message..."
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full px-4 py-4 bg-transparent border border-border focus:outline-none focus:border-foreground text-foreground text-xs uppercase tracking-widest font-semibold resize-none transition-colors"
                required
              />

              <button
                type="submit"
                className="w-full bg-foreground text-background py-4 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity flex items-center justify-center space-x-3"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
