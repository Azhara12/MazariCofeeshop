import React, { useState } from 'react';
import Button from '../components/ui/Button';
import { useToast } from '../hooks/useToast';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Thanks for subscribing! Check your inbox for a special welcome offer.");
    setEmail('');
  };

  return (
    <section className="py-24 px-6 md:px-12 bg-[#C68B45] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="coffee-beans" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path fill="currentColor" d="M20 10c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#coffee-beans)" />
        </svg>
      </div>

      <div className="max-w-3xl mx-auto relative z-10 text-center text-white space-y-8 animate-scaleIn">
        <h2 className="text-4xl md:text-5xl font-serif font-bold">Join the Coffee Club</h2>
        <p className="text-amber-100 text-lg max-w-xl mx-auto">
          Subscribe to our newsletter for early access to seasonal blends, brewing tips, and exclusive discounts.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mt-8">
          <input 
            type="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address" 
            className="flex-1 px-6 py-4 rounded-full text-[#3D2817] focus:outline-none focus:ring-4 focus:ring-white/30 transition-all shadow-lg"
          />
          <Button type="submit" variant="dark" size="lg" className="shadow-lg whitespace-nowrap">
            Subscribe Now
          </Button>
        </form>
        <p className="text-xs text-amber-200 mt-4">We respect your inbox. No spam, ever.</p>
      </div>
    </section>
  );
};

export default NewsletterSection;
