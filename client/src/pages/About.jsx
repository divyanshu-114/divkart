import { Users, Target, Award, Heart } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'Customer First',
      description: 'We put our customers at the heart of everything we do.'
    },
    {
      icon: Award,
      title: 'Quality Products',
      description: 'We ensure all products meet our high standards.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building lasting relationships with our customers.'
    },
    {
      icon: Target,
      title: 'Innovation',
      description: 'Constantly improving our platform and services.'
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-24">
          <h1 className="text-2xl font-bold uppercase tracking-[0.2em] text-foreground mb-6">About DivKart</h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground leading-loose">
            Your trusted e-commerce platform for quality products and exceptional service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          {values.map((value, index) => (
            <div key={index} className="border border-border p-12 text-center hover:bg-secondary/20 transition-colors">
              <div className="w-16 h-16 mx-auto mb-8 bg-secondary flex items-center justify-center border border-border">
                <value.icon className="w-6 h-6 text-foreground" strokeWidth={1} />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-foreground mb-4">{value.title}</h3>
              <p className="text-xs uppercase tracking-widest text-muted-foreground leading-loose">{value.description}</p>
            </div>
          ))}
        </div>

        <div className="border border-border p-12 text-center">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground mb-8">Our Story</h2>
          <p className="text-sm text-foreground/80 leading-loose max-w-2xl mx-auto">
            Founded with a vision to make online shopping simple and enjoyable, DivKart has grown 
            to become a trusted platform for thousands of customers worldwide. We believe that 
            everyone deserves access to quality products at fair prices, backed by exceptional 
            customer service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;