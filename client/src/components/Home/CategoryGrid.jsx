import { Link } from "react-router-dom";
import { categories } from "../../data/products";
const CategoryGrid = () => {
  return (
    <section className="py-24">
      <div className="text-center mb-16 animate-fade-in-up">
        <h2 className="text-3xl font-bold text-foreground mb-4 tracking-wide uppercase">
          Shop by Category
        </h2>
        <div className="w-12 h-[1px] bg-foreground mx-auto mb-6"></div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover our wide range of products across different categories
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
        {categories.map((category, i) => (
          <Link
            key={category.id}
            to={`/products?category=${category.name}`}
            className="group flex flex-col items-center text-center"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="w-full aspect-square relative overflow-hidden mb-6 bg-secondary">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
            <h3 className="text-sm font-semibold text-foreground tracking-widest uppercase">
              {category.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
