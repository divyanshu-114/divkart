import { useState } from "react";
import { Mail, Send } from "lucide-react";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");

  return (
    <section className="py-24 border-t border-border mt-16">
      <div className="max-w-xl mx-auto text-center px-4">
        <h2 className="text-2xl font-bold text-foreground mb-6 uppercase tracking-[0.2em]">
          Stay in the Loop
        </h2>
        <p className="text-xs text-foreground/70 mb-12 tracking-widest uppercase font-semibold">
          Sign up to receive updates on new arrivals and special offers.
        </p>

        <form className="flex w-full mx-auto border-b border-foreground mb-4 pb-3">
          <input
            type="email"
            placeholder="ENTER YOUR EMAIL ADDRESS"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-foreground placeholder-foreground/40 text-xs tracking-[0.1em]"
            required
          />
          <button
            type="submit"
            className="text-foreground hover:opacity-60 transition-opacity font-bold text-xs tracking-[0.2em] uppercase flex items-center ml-4"
          >
            Submit
          </button>
        </form>

        <p className="text-[10px] text-foreground/50 mt-10 tracking-widest uppercase font-medium">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
};

export default NewsletterSection;
