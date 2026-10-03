import React, { useState, useEffect } from 'react';
import { TESTIMONIALS } from '../data/testimonials';
import Rating from '../components/ui/Rating';
import SectionTitle from '../components/cards/SectionTitle';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5500);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(prev => (prev + 1) % TESTIMONIALS.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(prev => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <section className="py-24 px-6 md:px-12 bg-white overflow-hidden transition-colors duration-300">
      <div className="max-w-5xl mx-auto">

        {/* Section Title with explicit margin to prevent overlap */}
        <div className="mb-14">
          <SectionTitle
            title="What Our Community Says"
            subtitle="Don't just take our word for it — hear from our loyal regulars."
          />
        </div>

        {/* Carousel Wrapper */}
        <div className="relative max-w-3xl mx-auto">

          {/* Fixed-height slide container (prevents layout shift / overlap) */}
          <div className="relative min-h-[420px] md:min-h-[380px] flex items-center justify-center">
            {TESTIMONIALS.map((t, index) => {
              const isActive = index === currentIndex;
              return (
                <div
                  key={t.id}
                  className={`absolute inset-0 flex items-center justify-center px-4 transition-all duration-500 ease-in-out ${
                    isActive ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 pointer-events-none z-0'
                  }`}
                  aria-hidden={!isActive}
                >
                  <div className="w-full bg-stone-50 p-8 md:p-12 rounded-[2.5rem] text-center border border-stone-200 shadow-sm relative overflow-hidden">
                    {/* Decorative quote */}
                    <Quote className="absolute top-6 left-8 w-12 h-12 text-amber-900/10 rotate-180" />

                    {/* Review Text */}
                    <p className="text-lg md:text-xl text-stone-600 mb-8 italic relative z-10 leading-relaxed max-w-2xl mx-auto">
                      &ldquo;{t.comment}&rdquo;
                    </p>

                    {/* Reviewer */}
                    <div className="flex flex-col items-center gap-3">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-16 h-16 rounded-full object-cover shadow-md border-4 border-white "
                        loading="lazy"
                      />
                      <div>
                        <h4 className="text-base font-bold text-[#3D2817] ">{t.name}</h4>
                        <p className="text-xs text-stone-400 mt-0.5">{t.role}</p>
                      </div>
                      <Rating value={t.rating} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Prev / Next Controls */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 md:-translate-x-14 w-12 h-12 rounded-full bg-white shadow-lg border border-stone-100 flex items-center justify-center text-stone-600 hover:text-[#C68B45] hover:scale-110 transition-all z-20 cursor-pointer"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 md:translate-x-14 w-12 h-12 rounded-full bg-white shadow-lg border border-stone-100 flex items-center justify-center text-stone-600 hover:text-[#C68B45] hover:scale-110 transition-all z-20 cursor-pointer"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dot indicators — properly separated below card */}
          <div className="flex justify-center gap-2 mt-10">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  i === currentIndex ? 'w-8 bg-[#C68B45]' : 'w-2 bg-stone-300 '
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;