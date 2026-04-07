import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center border border-border p-16 max-w-2xl w-full">
        <div className="mb-12">
          <h1 className="text-[8rem] font-bold text-foreground leading-none mb-6">404</h1>
          <h2 className="text-lg font-bold uppercase tracking-[0.2em] text-foreground mb-6">Page Not Found</h2>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Sorry, the page you are looking for does not exist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center space-x-3 px-8 py-4 bg-foreground text-background font-bold text-xs uppercase tracking-widest hover:opacity-80 transition-opacity"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center space-x-3 px-8 py-4 bg-transparent border border-border text-foreground font-bold text-xs uppercase tracking-widest hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;