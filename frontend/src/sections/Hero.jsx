import React from 'react';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import Button from '../components/ui/Button';

const Hero = ({ setActiveTab }) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-6 md:px-12 py-20 overflow-hidden bg-gradient-hero ">
      <div className="hero-grain" />
      
      {/* Decorative Blobs */}
      <div className="hero-blob bg-amber-200 w-[500px] h-[500px] top-[-20%] left-[-10%]" />
      <div className="hero-blob bg-orange-100 w-[400px] h-[400px] bottom-[-10%] right-[-5%]" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center z-10">
        
        {/* Text Content */}
        <div className="text-left space-y-8 animate-fadeInUp delay-100">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 border border-white/80 backdrop-blur-md shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold tracking-wide uppercase text-stone-600">Freshly roasted today</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-[#3D2817] leading-[1.1]">
            Your Perfect <br />
            <span className="gradient-text">Coffee</span>, Made <br />
            With Passion
          </h1>
          
          <p className="text-lg md:text-xl text-stone-600 max-w-xl leading-relaxed">
            Experience the rich, tactile warmth of our artisanal roasts. Crafted for the modern coffee enthusiast who values quality, aroma, and a perfect pour.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-2">
            <Button onClick={() => setActiveTab('menu')} size="lg" className="group">
              Order Now 
              <ShoppingBag className="w-4 h-4 group-hover:animate-bounce" />
            </Button>
            <Button onClick={() => setActiveTab('about')} variant="secondary" size="lg" className="group">
              Our Story
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="flex items-center gap-6 pt-8 border-t border-amber-900/10">
            <div>
              <p className="text-2xl font-bold text-[#3D2817]">2.4k+</p>
              <p className="text-xs text-stone-500 font-medium">Happy Customers</p>
            </div>
            <div className="w-px h-10 bg-amber-900/10" />
            <div>
              <p className="text-2xl font-bold text-[#3D2817]">15+</p>
              <p className="text-xs text-stone-500 font-medium">Artisanal Blends</p>
            </div>
            <div className="w-px h-10 bg-amber-900/10" />
            <div>
              <p className="text-2xl font-bold text-[#3D2817]">2019</p>
              <p className="text-xs text-stone-500 font-medium">Established</p>
            </div>
          </div>
        </div>

        {/* Visual Content */}
        <div className="relative animate-fadeInUp delay-300 hidden lg:block">
          <div className="absolute inset-0 bg-[#C68B45]/10 rounded-full blur-3xl animate-pulse" />
          <img 
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800" 
            alt="Barista pouring latte art" 
            className="relative z-10 w-full h-[600px] object-cover rounded-[3rem] shadow-2xl animate-floatSlow"
          />
          {/* Floating Badge */}
          <div className="absolute bottom-10 -left-10 z-20 glass p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-float" style={{ animationDelay: '1s' }}>
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🌱</span>
            </div>
            <div>
              <p className="text-sm font-bold text-[#3D2817]">100% Organic</p>
              <p className="text-xs text-stone-500">Ethically sourced beans</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;