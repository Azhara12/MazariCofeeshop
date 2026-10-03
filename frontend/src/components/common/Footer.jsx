import React, { useState } from 'react';
import { Share2, Globe, MessageCircle, Video, Mail, MapPin, Phone, Clock, Coffee, Heart } from 'lucide-react';

const Footer = ({ setActiveTab }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const navigate = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const links = [
    { id: 'home',    label: 'Home' },
    { id: 'about',   label: 'About Us' },
    { id: 'menu',    label: 'Our Menu' },
    { id: 'contact', label: 'Contact' },
    { id: 'cart',    label: 'Order Online' },
  ];

  const social = [
    { icon: Share2,        href: '#', label: 'Share',      color: 'hover:text-pink-400' },
    { icon: MessageCircle, href: '#', label: 'Message',    color: 'hover:text-sky-400' },
    { icon: Globe,         href: '#', label: 'Website',    color: 'hover:text-blue-400' },
    { icon: Video,         href: '#', label: 'Video',      color: 'hover:text-red-400' },
  ];

  return (
    <footer className="bg-[#2A1B10] text-[#FAF6F0] pt-14 pb-6 px-6 md:px-12 border-t border-amber-900/20">
      <div className="max-w-7xl mx-auto">
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#C68B45] flex items-center justify-center shadow-md">
                <Coffee className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-[#EAD0B3]" style={{ fontFamily: 'var(--font-serif)' }}>
                MazariCS
              </span>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed">
              Bringing warmth, craft, and community to every cup since 2019. Artisanal coffee made with love.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-1">
              {social.map(({ icon: Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`w-9 h-9 rounded-full bg-white/8 hover:bg-white/15 flex items-center justify-center transition-all duration-200 text-stone-400 ${color}`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-[#EAD0B3] mb-4">Navigate</h4>
            <ul className="space-y-2.5">
              {links.map(({ id, label }) => (
                <li key={id}>
                  <button
                    onClick={() => navigate(id)}
                    className="text-sm text-stone-400 hover:text-[#EAD0B3] transition-colors duration-150 hover:translate-x-1 inline-block transition-transform"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-[#EAD0B3] mb-4">Visit Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-stone-400">
                <MapPin className="w-4 h-4 text-[#C68B45] mt-0.5 flex-shrink-0" />
                Faisal Town SadiqAbad
              </li>
              <li className="flex items-center gap-2.5 text-sm text-stone-400">
                <Phone className="w-4 h-4 text-[#C68B45] flex-shrink-0" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2.5 text-sm text-stone-400">
                <Mail className="w-4 h-4 text-[#C68B45] flex-shrink-0" />
                hello@mazarics.com
              </li>
              <li className="flex items-center gap-2.5 text-sm text-stone-400">
                <Clock className="w-4 h-4 text-[#C68B45] flex-shrink-0" />
                Mon–Fri: 8AM–10PM · Sat–Sun: 9AM–11PM
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-[#EAD0B3] mb-4">Stay in the Loop</h4>
            <p className="text-sm text-stone-400 mb-4">Get exclusive offers, new blends, and coffee tips straight to your inbox.</p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium animate-fadeInUp">
                <span>✓</span> You're subscribed! Welcome to the family.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-2.5 bg-white/8 border border-white/15 rounded-xl text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#C68B45] focus:bg-white/12 transition-all"
                />
                <button
                  type="submit"
                  className="w-full bg-[#C68B45] hover:bg-[#b07839] text-white py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p>© 2026 MazariCS. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>FAQs</span>
          </div>
          <p className="flex items-center gap-1">Made with <Heart className="w-3 h-3 text-[#C68B45]" /> & Coffee</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;