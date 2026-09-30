import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ServiceProvider } from '../types';
import { StarIcon, VerifiedIcon, LocationIcon } from '../data';
import { BookingModal } from './BookingModal';

interface ProfileModalProps {
  provider: ServiceProvider | null;
  onClose: () => void;
}

export function ProfileModal({ provider, onClose }: ProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'about' | 'reviews'>('about');
  const [bookingProvider, setBookingProvider] = useState<ServiceProvider | null>(null);

  const reviews = [
    { name: 'Jordan L.', date: '2 weeks ago', rating: 5, text: 'Absolutely fantastic work! Showed up on time, professional and friendly. Would definitely book again.' },
    { name: 'Amy T.', date: '1 month ago', rating: 5, text: 'Fixed the issue quickly and cleanly. Explained everything before starting — felt completely informed.' },
    { name: 'Chris R.', date: '3 months ago', rating: 4, text: 'Great service overall. Took a little longer than expected but the quality was spot on.' },
  ];

  return (
    <>
      <AnimatePresence>
        {provider && !bookingProvider && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="relative w-full sm:max-w-lg bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden z-10"
              initial={{ y: 60, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 60, opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Hero banner */}
              <div className="relative h-36 bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-900 overflow-hidden">
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #a78bfa, transparent 50%), radial-gradient(circle at 20% 80%, #60a5fa, transparent 45%)' }} />
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/35 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors text-xs font-bold"
                >
                  ✕
                </button>
                {provider.verified && (
                  <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-sky-500/30 border border-sky-400/40 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                    <VerifiedIcon /> Verified Pro
                  </span>
                )}
              </div>

              {/* Avatar */}
              <div className="relative px-6">
                <div className="-mt-10 mb-3 flex items-end justify-between">
                  <img src={provider.avatar} alt={provider.name} className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-lg" />
                  <span className="mb-1 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-sm font-bold text-emerald-700">{provider.price}</span>
                </div>

                <h2 className="text-xl font-extrabold text-slate-900 leading-tight">{provider.name}</h2>
                <p className="text-sm font-semibold text-blue-600 mt-0.5">{provider.service}</p>

                <div className="mt-2 flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                  <div className="flex items-center gap-1">
                    <div className="flex">{[1, 2, 3, 4, 5].map((s) => <StarIcon key={s} filled={s <= Math.round(provider.rating)} />)}</div>
                    <span className="font-bold text-slate-800 ml-1">{provider.rating}</span>
                    <span>({provider.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500"><LocationIcon /> {provider.location}</div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {provider.tags.map((tag) => (
                    <span key={tag} className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>

              {/* Tabs */}
              <div className="mt-5 px-6 flex gap-1 border-b border-slate-100">
                {(['about', 'reviews'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 px-3 text-sm font-bold capitalize transition-all border-b-2 -mb-px ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="px-6 py-5 max-h-[32vh] overflow-y-auto scrollbar-hide">
                <AnimatePresence mode="wait">
                  {activeTab === 'about' && (
                    <motion.div key="about" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.22 }}>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {provider.name} is a highly-rated professional specialising in <strong>{provider.service}</strong>.
                        Based in <strong>{provider.location}</strong>, they have served hundreds of satisfied customers
                        {provider.verified ? ' and hold all required certifications.' : '.'}
                      </p>
                      <div className="grid grid-cols-3 gap-3 mt-4">
                        {[
                          { label: 'Rating', val: `${provider.rating}★` },
                          { label: 'Reviews', val: `${provider.reviews}+` },
                          { label: 'Response', val: '< 15 min' },
                        ].map((stat) => (
                          <div key={stat.label} className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-center">
                            <div className="text-base font-black text-slate-900">{stat.val}</div>
                            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'reviews' && (
                    <motion.div key="reviews" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.22 }} className="space-y-4">
                      {reviews.map((r, i) => (
                        <div key={i} className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">{r.name[0]}</div>
                              <span className="text-sm font-bold text-slate-900">{r.name}</span>
                            </div>
                            <span className="text-xs text-slate-400">{r.date}</span>
                          </div>
                          <div className="flex gap-0.5 mb-2">{[1, 2, 3, 4, 5].map((s) => <StarIcon key={s} filled={s <= r.rating} />)}</div>
                          <p className="text-xs text-slate-600 leading-relaxed">{r.text}</p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Booking Button */}
              <div className="px-6 py-4 border-t border-slate-100 bg-white">
                <button
                  onClick={() => setBookingProvider(provider)}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors shadow-lg shadow-blue-500/25"
                >
                  Book now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {bookingProvider && (
        <BookingModal
          provider={bookingProvider}
          onClose={() => {
            setBookingProvider(null);
            onClose();
          }}
        />
      )}
    </>
  );
}
