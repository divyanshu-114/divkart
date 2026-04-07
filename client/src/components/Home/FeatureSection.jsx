import { Truck, Shield, Headphones, CreditCard } from 'lucide-react';

const FeatureSection = () => {
  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Free shipping on orders over $50 worldwide'
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '100% secure payment with SSL encryption'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Dedicated customer support available anytime'
    },
    {
      icon: CreditCard,
      title: 'Easy Returns',
      description: '30-day return policy for your peace of mind'
    }
  ];

  return (
    <section className="py-20 border-t border-b border-border my-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center">
            <feature.icon className="w-8 h-8 text-foreground mb-6" strokeWidth={1} />
            <h3 className="text-sm font-bold text-foreground mb-3 tracking-widest uppercase">
              {feature.title}
            </h3>
            <p className="text-muted-foreground text-sm font-light leading-relaxed max-w-[200px] mx-auto">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;