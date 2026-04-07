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
      description:
        "Up to 50% off on premium headphones, smartwatches, and more",
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slide = slides[currentSlide];

  return (
    <div className="relative h-[85vh] w-full overflow-hidden">
      {/* Single Active Slide */}
      <div className="relative h-full w-full">
        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out"
          style={{ backgroundImage: `url(${slide.image})` }}
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative h-full flex items-center justify-center text-center px-6">
          <div className="max-w-4xl animate-fade-in-up mt-16">
            <h3 className="text-sm font-semibold text-white/90 mb-4 tracking-[0.2em] uppercase">
              {slide.subtitle}
            </h3>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              {slide.title}
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light">
              {slide.description}
            </p>
            <Link
              to={slide.url}
              className="inline-block px-10 py-4 bg-white text-black hover:bg-neutral-200 font-semibold text-xs tracking-widest uppercase transition-colors"
            >
              {slide.cta}
            </Link>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="hidden sm:flex absolute left-8 top-1/2 -translate-y-1/2 p-2 text-white hover:opacity-70 transition-opacity"
      >
        <ChevronLeft className="w-10 h-10" strokeWidth={1} />
      </button>
      <button
        onClick={nextSlide}
        className="hidden sm:flex absolute right-8 top-1/2 -translate-y-1/2 p-2 text-white hover:opacity-70 transition-opacity"
      >
        <ChevronRight className="w-10 h-10" strokeWidth={1} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 ${
              index === currentSlide
                ? "w-8 h-1 bg-white"
                : "w-4 h-1 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
