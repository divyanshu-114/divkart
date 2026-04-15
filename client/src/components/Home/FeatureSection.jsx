import { Truck, Shield, Headphones, CreditCard } from 'lucide-react';

const FeatureSection = () => {
  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Free shipping on orders over ₹500 across India',
      color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600',
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '100% secure payment with SSL encryption',
      color: 'bg-green-50 dark:bg-green-900/20 text-green-600',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Dedicated customer support available anytime',
      color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600',
    },
    {
      icon: CreditCard,
      title: 'Easy Returns',
      description: '30-day return policy for peace of mind',
      color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600',
    },
  ];

  return (
    <section className="py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-card rounded-2xl border border-border p-5 flex flex-col items-center text-center shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className={`w-12 h-12 rounded-full ${feature.color} flex items-center justify-center mb-4`}>
              <feature.icon className="w-5 h-5" strokeWidth={2} />
            </div>
            <h3 className="text-sm font-bold text-foreground mb-1.5">{feature.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;
