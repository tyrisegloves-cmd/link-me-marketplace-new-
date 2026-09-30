import { useState } from 'react';
import { motion } from 'framer-motion';
import { testimonials, StarIcon } from '../data';

export function TestimonialsPage() {
  const [filterCat, setFilterCat] = useState('all');
  const [submitted, setSubmitted] = useState(false);

  const filtered = filterCat === 'all'
    ? testimonials
    : testimonials.filter((t) => t.category === filterCat);

  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50/50">
      {/* Hero Section */}
      <section className="relative h-[360px] sm:h-[440px] flex items-end text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/testimonials-hero.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/45 via-slate-900/30 to-slate-900/70" />
        <div className="absolute inset-0 opacity-[0.16]" style={{ backgroundImage: 'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(168, 85, 247, 0.15), transparent), radial-gradient(ellipse 40% 30% at 60% 40%, rgba(96, 165, 250, 0.12), transparent)' }} />

        <div className="relative max-w-4xl mx-auto pb-12 sm:pb-16 px-4 sm:px-8 text-center">
          <span className="inline-block rounded-full bg-blue-500/20 border border-blue-400/30 px-3.5 py-1 text-xs font-bold text-blue-300 uppercase tracking-wider mb-4">
            Community Stories
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4">
            Trusted by over 40,000 local homeowners & businesses
          </h1>
          <p className="text-lg text-slate-200/90 leading-relaxed max-w-2xl mx-auto">
            Read real, unfiltered feedback from customers who booked emergency repairs, recurring cleanings, and event specialists through Link Me.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16 bg-white rounded-3xl p-8 shadow-xl -mt-10">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
            Community Stories
          </span>
          <h1 className="mt-6 text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900">
            Trusted by over 40,000 local homeowners & businesses
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Read real, unfiltered feedback from customers who booked emergency repairs, recurring cleanings, and event specialists through Link Me.
          </p>
        </div>

        {/* Category Filter */}

        {/* Category Filter */}
        <div className="mt-10 flex justify-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: 'all', label: 'All Reviews (2,410+)' },
            { id: 'home', label: 'Home Repair' },
            { id: 'cleaning', label: 'Cleaning' },
            { id: 'tech', label: 'Tech Support' },
            { id: 'wellness', label: 'Wellness' },
            { id: 'events', label: 'Events' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCat(cat.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                filterCat === cat.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-lg hover:border-blue-200 transition-all"
            >
              <div>
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <StarIcon key={s} filled={s <= t.rating} />
                  ))}
                  <span className="ml-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Verified Booking</span>
                </div>
                <p className="text-slate-800 text-base leading-relaxed font-medium">“{t.quote}”</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100" />
                <div>
                  <h4 className="font-bold text-slate-900">{t.name}</h4>
                  <span className="text-xs font-medium text-slate-500">{t.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Share Story Card */}
        <div className="mt-20 rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-sm max-w-2xl mx-auto text-center">
          {!submitted ? (
            <>
              <h3 className="text-2xl font-bold text-slate-900">Have a Link Me story to share?</h3>
              <p className="text-slate-500 text-sm mt-2">
                Did a professional save your day? Submit your review and get $15 credit towards your next service request!
              </p>
              <div className="mt-6 space-y-3 text-left">
                <input
                  type="text"
                  placeholder="Your Full Name"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                  defaultValue="Michael Carter"
                />
                <textarea
                  rows={3}
                  placeholder="Tell us about the service you booked..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                  defaultValue="Booked an electrician on short notice through Link Me. Super smooth process!"
                />
              </div>
              <button
                onClick={() => setSubmitted(true)}
                className="mt-6 w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 shadow-md shadow-blue-500/20"
              >
                Submit My Review
              </button>
            </>
          ) : (
            <div className="py-6">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">✓</div>
              <h4 className="text-xl font-bold text-slate-900">Thank you for your review!</h4>
              <p className="text-sm text-slate-600 mt-1">Your feedback has been submitted for moderation. Your $15 credit code has been emailed.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
