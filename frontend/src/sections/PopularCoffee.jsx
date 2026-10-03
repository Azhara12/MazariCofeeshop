import React, { useState, useEffect } from "react";
import { PRODUCTS } from "../data/products";
import ProductCard from "../components/cards/ProductCard";
import SectionTitle from "../components/cards/SectionTitle";
import ProductModal from "../components/cards/ProductModal";
import { useModal } from "../hooks/useModal";

const PopularCoffee = () => {
  const populars = PRODUCTS.filter((p) => p.popular);
  const modal = useModal();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = React.useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 px-6 md:px-12 bg-white transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto">
        <div
          className={`transition-all duration-1000 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <SectionTitle
            title="Our Most Loved Coffee"
            subtitle="Discover the artisanal favorites that keep our community coming back day after day."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 scroll-x pb-4">
            {populars.map((product, index) => (
              <div
                key={product.id}
                className={`scroll-snap transition-all duration-700 delay-${index * 100}`}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(20px)",
                }}
              >
                <ProductCard product={product} onQuickView={modal.open} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <ProductModal
        isOpen={modal.isOpen}
        onClose={modal.close}
        product={modal.data}
      />
    </section>
  );
};

export default PopularCoffee;
