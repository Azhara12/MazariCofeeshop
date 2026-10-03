import React from 'react';
import { TEAM } from '../data/team';
import SectionTitle from '../components/cards/SectionTitle';
import { Camera } from 'lucide-react';

const TeamSection = () => {
  return (
    <section className="py-24 px-6 md:px-12 bg-stone-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <SectionTitle title="Meet The Artisans" subtitle="The passionate people behind every perfect cup." />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {TEAM.map((member, i) => (
            <div
              key={member.id}
              className="bg-white border border-stone-100 rounded-[2.5rem] p-4 shadow-sm hover:shadow-xl hover:border-[#C68B45]/30 transition-all duration-300 group animate-fadeInUp"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="relative overflow-hidden rounded-[2rem] h-80 mb-6 bg-stone-100 ">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3D2817]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <a
                    href={member.instagram}
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-[#C68B45] transition-colors"
                  >
                    <Camera className="w-5 h-5" />
                  </a>
                </div>
              </div>
              <div className="text-center px-4 pb-4">
                <h3 className="text-xl font-bold text-[#3D2817] mb-1 font-serif">{member.name}</h3>
                <p className="text-[#C68B45] text-sm font-semibold mb-3">{member.role}</p>
                <p className="text-stone-500 text-sm leading-relaxed mb-4">{member.bio}</p>
                <span className="inline-block px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-xs font-semibold">
                  {member.specialty}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
