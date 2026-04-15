import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQ = () => {
  const [openItems, setOpenItems] = useState({});

  const faqs = [
    {
      question: "How do I place an order?",
      answer: "Simply browse our products, add items to your cart, and proceed to checkout. Follow the prompts to enter your shipping details and complete payment via Razorpay.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, UPI, net banking, and wallets through our secure Razorpay payment gateway.",
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 3–5 business days. Express shipping options are available at checkout for faster delivery.",
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most items. Items must be in original condition with tags attached. Initiate a return from your Orders page.",
    },
    {
      question: "Is my payment information secure?",
      answer: "Absolutely. All payments are processed through Razorpay with industry-standard SSL encryption. We never store your payment credentials.",
    },
    {
      question: "How do I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email. You can also view order status anytime on your Orders page.",
    },
  ];

  const toggleItem = (index) => {
    setOpenItems((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="min-h-screen bg-background pt-6 pb-16">
      <div className="max-w-2xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-bold mb-4">
            <HelpCircle className="w-4 h-4" strokeWidth={2} />
            Help Center
          </div>
          <h1 className="text-3xl font-extrabold text-foreground mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground">Find answers to common questions about DivKart.</p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl border border-border shadow-card overflow-hidden"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-secondary/50 transition-colors gap-4"
              >
                <h3 className="text-sm font-bold text-foreground">{faq.question}</h3>
                <ChevronDown
                  className={`w-4 h-4 text-primary shrink-0 transition-transform duration-300 ${
                    openItems[index] ? "rotate-180" : ""
                  }`}
                  strokeWidth={2.5}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openItems[index] ? "max-h-40" : "max-h-0"
                }`}
              >
                <div className="px-6 pb-5 border-t border-border pt-4 bg-secondary/30">
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 bg-brand-green rounded-2xl p-7 text-center">
          <h3 className="text-white font-bold text-base mb-2">Still have questions?</h3>
          <p className="text-white/60 text-sm mb-5">Our support team is here to help you.</p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-accent text-accent-foreground rounded-full font-bold text-sm hover:bg-accent/90 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
