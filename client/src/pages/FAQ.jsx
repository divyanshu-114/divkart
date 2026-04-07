import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openItems, setOpenItems] = useState({});

  const faqs = [
    {
      question: 'How do I place an order?',
      answer: 'Simply browse our products, add items to your cart, and proceed to checkout. Follow the prompts to complete your order.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and other secure payment methods.'
    },
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 3-5 business days. Express shipping options are available at checkout.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for most items. Items must be in original condition with tags attached.'
    }
  ];

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-2xl font-bold uppercase tracking-[0.2em] text-foreground mb-6">Frequently Asked Questions</h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Find answers to common questions</p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-border">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-secondary/50 transition-colors"
              >
                <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">{faq.question}</h3>
                {openItems[index] ? (
                  <ChevronUp className="w-4 h-4 text-foreground ml-4 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-foreground ml-4 shrink-0" />
                )}
              </button>
              {openItems[index] && (
                <div className="px-8 pb-6 border-t border-border pt-6 bg-secondary/20">
                  <p className="text-sm text-foreground/80 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;