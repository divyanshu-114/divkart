import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent successfully!");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contactCards = [
    { icon: Mail,    title: "Email",   value: "support@divkart.com",      color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20" },
    { icon: Phone,   title: "Phone",   value: "+91 98765 43210",           color: "bg-green-50 text-green-600 dark:bg-green-900/20" },
    { icon: MapPin,  title: "Address", value: "New Delhi, India 110001",   color: "bg-amber-50 text-amber-600 dark:bg-amber-900/20" },
  ];

  const inputClass = "w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 text-sm font-medium text-foreground placeholder-muted-foreground transition-all";

  return (
    <div className="min-h-screen bg-background pt-6 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-bold mb-4">
            <MessageSquare className="w-4 h-4" strokeWidth={2} />
            Get in Touch
          </div>
          <h1 className="text-3xl font-extrabold text-foreground mb-3">Contact Us</h1>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Have a question or feedback? We'd love to hear from you.
          </p>
        </div>

        {/* Contact info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {contactCards.map((card, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border p-5 shadow-card text-center">
              <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <card.icon className="w-5 h-5" strokeWidth={2} />
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1">{card.title}</h3>
              <p className="text-sm text-muted-foreground">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Contact form */}
        <div className="bg-card rounded-2xl border border-border p-7 shadow-card max-w-2xl mx-auto">
          <h2 className="text-base font-bold text-foreground mb-6">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={inputClass}
                required
              />
              <input
                type="email"
                placeholder="Your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={inputClass}
                required
              />
            </div>

            <input
              type="text"
              placeholder="Subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className={inputClass}
              required
            />

            <textarea
              rows={5}
              placeholder="Your message…"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className={`${inputClass} resize-none`}
              required
            />

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-primary-foreground rounded-full font-bold text-sm hover:bg-primary/90 transition-colors"
            >
              <Send className="w-4 h-4" strokeWidth={2} />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
