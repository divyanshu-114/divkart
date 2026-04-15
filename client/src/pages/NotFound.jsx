import { Link } from "react-router-dom";
import { Home, ArrowLeft, Leaf } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-lg w-full">

        {/* Big illustrated 404 */}
        <div className="relative inline-block mb-8">
          <div className="w-40 h-40 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <span className="text-7xl font-extrabold text-primary/30 select-none">404</span>
          </div>
          <div className="absolute -top-2 -right-2 w-12 h-12 bg-accent rounded-full flex items-center justify-center shadow-card">
            <Leaf className="w-6 h-6 text-accent-foreground" strokeWidth={2.5} />
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-foreground mb-3">Page Not Found</h1>
        <p className="text-muted-foreground text-sm mb-8 leading-relaxed max-w-sm mx-auto">
          Sorry, we couldn't find the page you're looking for. It may have been moved or deleted.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-full font-bold text-sm hover:bg-primary/90 transition-colors"
          >
            <Home className="w-4 h-4" strokeWidth={2} />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-card border border-border text-foreground rounded-full font-bold text-sm hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
