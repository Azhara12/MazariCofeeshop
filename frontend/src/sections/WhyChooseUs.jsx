import React from 'react';
import { Leaf, Award, Truck } from 'lucide-react';
import SectionTitle from '../components/cards/SectionTitle';

const WhyChooseUs = () => {
  const features = [
    {
      icon: Leaf,
      title: 'Organic Beans',
      desc: 'Ethically sourced 100% Arabica beans grown without synthetic pesticides.',
      color: 'text-emerald-600 ',
      bg: 'bg-emerald-100 '
    },
    {
      icon: Award,
      title: 'Master Roasters',
      desc: 'Roasted in small batches daily to ensure peak freshness and flavor profile.',
      color: 'text-amber-600 ',
      bg: 'bg-amber-100 '
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      desc: 'Warm coffee and fresh pastries delivered straight to your door in 20 minutes.',
      color: 'text-sky-600 ',
      bg: 'bg-sky-100 '
    }
  ];

  return (
    <section className="py-24 px-6 md:px-12 bg-stone-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-16">
        <SectionTitle title="Why Choose MazariCS" subtitle="We go above and beyond to deliver the perfect coffee experience." />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100 hover:shadow-xl hover:border-[#C68B45]/30 transition-all duration-300 hover:-translate-y-2 group text-center animate-fadeInUp" style={{ animationDelay: `${i * 150}ms` }}>
              <div className={`w-16 h-16 mx-auto rounded-2xl ${f.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <f.icon className={`w-8 h-8 ${f.color}`} />
              </div>
              <h3 className="text-xl font-bold text-[#3D2817] mb-3">{f.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;