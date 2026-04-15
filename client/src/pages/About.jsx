import { Users, Target, Award, Heart, Leaf } from "lucide-react";

const About = () => {
  const values = [
    { icon: Heart,   title: "Customer First",    description: "We put our customers at the heart of everything we do.", color: "bg-red-50 text-red-500 dark:bg-red-900/20" },
    { icon: Award,   title: "Quality Products",  description: "We ensure all products meet our high standards.",           color: "bg-amber-50 text-amber-500 dark:bg-amber-900/20" },
    { icon: Users,   title: "Community",         description: "Building lasting relationships with our customers.",         color: "bg-blue-50 text-blue-500 dark:bg-blue-900/20" },
    { icon: Target,  title: "Innovation",        description: "Constantly improving our platform and services.",            color: "bg-purple-50 text-purple-500 dark:bg-purple-900/20" },
  ];

  return (
    <div className="min-h-screen bg-background pt-6 pb-16">
      <div className="max-w-4xl mx-auto px-4">

        {/* Hero */}
        <div className="bg-brand-green rounded-2xl px-8 py-14 text-center mb-10">
          <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center mx-auto mb-5">
            <Leaf className="w-7 h-7 text-accent-foreground" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-3">About DivKart</h1>
          <p className="text-white/65 text-base max-w-md mx-auto leading-relaxed">
            Your trusted e-commerce platform for quality products and exceptional service.
          </p>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl border border-border p-6 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${value.color} flex items-center justify-center mb-4`}>
                <value.icon className="w-5 h-5" strokeWidth={2} />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">{value.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>

        {/* Story */}
        <div className="bg-card rounded-2xl border border-border p-8 shadow-card">
          <h2 className="text-lg font-bold text-foreground mb-4">Our Story</h2>
          <p className="text-sm text-foreground/80 leading-loose">
            Founded with a vision to make online shopping simple and enjoyable, DivKart has grown to become a trusted
            platform for thousands of customers worldwide. We believe that everyone deserves access to quality products
            at fair prices, backed by exceptional customer service. Since our founding, we've been committed to
            sustainability, community, and innovation — making every shopping experience as delightful as possible.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
