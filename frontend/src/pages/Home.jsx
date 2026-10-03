import React from 'react';
import Hero from '../sections/Hero';
import PopularCoffee from '../sections/PopularCoffee';
import AboutSection from '../sections/AboutSection';
import WhyChooseUs from '../sections/WhyChooseUs';
import Testimonials from '../sections/Testimonials';
import NewsletterSection from '../sections/NewsletterSection';

const Home = ({ setActiveTab }) => {
  return (
    <div className="page-enter bg-white text-stone-900 transition-colors duration-300">
      <Hero setActiveTab={setActiveTab} />
      <PopularCoffee />
      <AboutSection />
      <WhyChooseUs />
      <Testimonials />
      <NewsletterSection />
    </div>
  );
};

export default Home;