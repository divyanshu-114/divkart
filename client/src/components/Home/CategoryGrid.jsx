import { Link } from "react-router-dom";
import { categories } from "../../data/products";
const CategoryGrid = () => {
  return (
    <section className="py-16">
      <div className="text-center mb-12 animate-fade-in-up">
        <h2 className="text-4xl font-bold text-foreground mb-4">
          Shop by Category
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover our wide range of products across different categories
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((category, i) => (
          <Link
            key={category.id}
            to={`/products?category=${category.name}`}
            className="group glass-card p-6 text-center hover:glow-on-hover rounded-2xl overflow-hidden"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="relative overflow-hidden rounded-xl mb-4">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
            </div>
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
              {category.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
