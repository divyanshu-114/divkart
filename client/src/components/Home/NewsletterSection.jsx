import { useState } from "react";
import { Mail } from "lucide-react";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");

  return (
    <section className="py-8 mb-4">
      <div className="bg-brand-green rounded-2xl px-8 py-10 md:px-14 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-5 h-5 text-accent" strokeWidth={2} />
            <span className="text-accent text-sm font-bold tracking-wide">Newsletter</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mb-2">Stay in the Loop</h2>
          <p className="text-white/60 text-sm max-w-sm">
            Sign up to receive updates on new arrivals, exclusive deals, and special offers.
          </p>
        </div>

        <form
          className="flex w-full md:w-auto gap-2 min-w-0 md:min-w-[380px]"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="Enter your email…"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-5 py-3 rounded-full bg-white/15 border border-white/20 text-white placeholder-white/40 text-sm font-medium focus:outline-none focus:bg-white/20 focus:border-white/40 transition-all min-w-0"
            required
          />
          <button
            type="submit"
            className="px-6 py-3 bg-accent text-accent-foreground rounded-full font-bold text-sm hover:bg-accent/90 transition-all whitespace-nowrap shrink-0"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSection;
