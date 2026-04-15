import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Premium Electronics",
      subtitle: "Discover the latest tech innovations",
      description: "Up to 50% off on premium headphones, smartwatches, and more",
      image: "./electronics.jpg",
      cta: "Shop Electronics",
      url: "/products?category=Electronics",
    },
    {
      id: 2,
      title: "Fashion Forward",
      subtitle: "Style meets comfort",
      description: "New arrivals in designer clothing and accessories",
      image: "./fashion.jpg",
      cta: "Explore Fashion",
      url: "/products?category=Fashion",
    },
    {
      id: 3,
      title: "Home & Garden",
      subtitle: "Transform your space",
      description: "Beautiful furniture and decor for every home",
      image: "./furniture.jpg",
      cta: "Shop Home",
      url: `/products?category=Home & Garden`,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  });

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const slide = slides[currentSlide];

  return (
    <div className="relative overflow-hidden rounded-2xl mx-4 sm:mx-6 lg:mx-8 mt-4">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out scale-105"
        style={{ backgroundImage: `url(${slide.image})` }}
      />
      {/* Green overlay */}
      <div className="absolute inset-0 bg-brand-green/75" />

      {/* Content */}
      <div className="relative min-h-[400px] md:min-h-[480px] flex items-center px-8 md:px-16 py-12">
        <div className="max-w-lg animate-fade-in-up">
          <p className="text-accent text-sm font-bold mb-3 tracking-wide">{slide.subtitle}</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            {slide.title}
          </h1>
          <p className="text-white/75 text-base mb-8 leading-relaxed">{slide.description}</p>
          <Link
            to={slide.url}
            className="inline-block px-8 py-3.5 bg-accent text-accent-foreground rounded-full font-bold text-sm hover:bg-accent/90 transition-all duration-200 shadow-lg"
          >
            {slide.cta} →
          </Link>
        </div>

        {/* Decorative circles */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden md:block">
          <div className="w-56 h-56 rounded-full bg-white/5 flex items-center justify-center">
            <div className="w-40 h-40 rounded-full bg-white/5 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-accent/20" />
            </div>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full items-center justify-center text-white transition-all"
      >
        <ChevronLeft className="w-5 h-5" strokeWidth={2} />
      </button>
      <button
        onClick={nextSlide}
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full items-center justify-center text-white transition-all"
      >
        <ChevronRight className="w-5 h-5" strokeWidth={2} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-6 h-2 bg-accent"
                : "w-2 h-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
