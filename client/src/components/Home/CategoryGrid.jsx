import { Link } from "react-router-dom";
import { categories } from "../../data/products";
import { ChevronRight } from "lucide-react";

const CategoryGrid = () => {
  return (
    <section className="py-10">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-extrabold text-foreground">Shop by Category</h2>
        <Link
          to="/products"
          className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/70 transition-colors"
        >
          See all <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Category pills — horizontal scroll on mobile, grid on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map((category, i) => (
          <Link
            key={category.id}
            to={`/products?category=${category.name}`}
            className="category-pill group animate-fade-in-up"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            {/* image */}
            <div className="w-16 h-16 mx-auto mb-3 overflow-hidden rounded-xl bg-secondary">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
              {category.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">In store</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
