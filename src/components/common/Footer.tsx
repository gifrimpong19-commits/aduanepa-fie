import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { MapPin, Phone, Mail, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { universities, setActiveUniversity } = useMarketplace();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          
          {/* Col 1: About AduanePa Fie */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-500 to-amber-500 flex items-center justify-center text-white text-xl">
                🍲
              </div>
              <span className="font-display font-black text-2xl text-white">
                Aduane<span className="text-brand-500">Pa</span> Fie
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Ghana's dedicated university food delivery network. Connecting hungry students directly to trusted campus chop bars, cafeterias, and fast bites with guaranteed Pay on Delivery security.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold bg-stone-800/80 p-2.5 rounded-xl border border-stone-700">
              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>"Enjoy the Taste in Every Bite"</span>
            </div>
          </div>

          {/* Col 2: Campus Coverage */}
          <div>
            <h4 className="text-white font-bold font-display text-sm tracking-wide uppercase mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-500" />
              Active Campuses
            </h4>
            <ul className="space-y-2 text-xs">
              {universities.map(u => (
                <li key={u.id}>
                  <button 
                    onClick={() => {
                      setActiveUniversity(u);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-brand-400 transition-colors text-stone-400 flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                    <span>{u.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Business & Deliveries */}
          <div>
            <h4 className="text-white font-bold font-display text-sm tracking-wide uppercase mb-4">
              Partner With Us
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <span className="text-stone-200 font-semibold">Campus Chop Bar Owners:</span>
                <p className="text-[11px] text-stone-400">List your restaurant, manage your menu, and boost student orders without upfront cost.</p>
              </li>
              <li>
                <span className="text-stone-200 font-semibold">Student & Local Riders:</span>
                <p className="text-[11px] text-stone-400">Deliver with Bicycle, Motorbike, or Car across campus landmarks and earn instant cash.</p>
              </li>
            </ul>
          </div>

          {/* Col 4: Safety & Contact */}
          <div>
            <h4 className="text-white font-bold font-display text-sm tracking-wide uppercase mb-4">
              Safety & Support
            </h4>
            <p className="text-xs text-stone-400 mb-3 leading-relaxed">
              Every delivery is secured with a unique 4-digit customer confirmation code before payment handoff.
            </p>
            <div className="space-y-2 text-xs text-stone-300">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-brand-500" />
                <span>+233 (0) 54 000 4821</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-500" />
                <span>support@aduanepafie.com.gh</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>&copy; {new Date().getFullYear()} AduanePa Fie Technologies Ltd. Built for Ghanaian Universities.</p>
          <p className="flex items-center gap-1.5">
            Crafted with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for university students across Ghana.
          </p>
        </div>
      </div>
    </footer>
  );
};
