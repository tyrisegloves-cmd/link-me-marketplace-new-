import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { categories, providers, SearchIcon, StarIcon, VerifiedIcon, LocationIcon } from '../data';
import { ProfileModal } from '../components/ProfileModal';
import { QuoteModal } from '../components/QuoteModal';
import type { ServiceProvider } from '../types';

export function MarketplacePage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'name'>('rating');
  const [quoteProvider, setQuoteProvider] = useState<ServiceProvider | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<ServiceProvider | null>(null);

  const filteredProviders = useMemo(() => {
    const q = search.toLowerCase();
    const matches = providers.filter((p) => {
      const matchCat = activeCategory === 'all' || p.category === activeCategory;
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.service.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.location.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });

    return [...matches].sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.reviews - a.reviews;
      return a.name.localeCompare(b.name);
    });
  }, [search, activeCategory, sortBy]);

  const handleRequestQuote = (p: ServiceProvider) => {
    setQuoteProvider(p);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="relative rounded-3xl overflow-hidden mb-8 h-[360px] sm:h-[440px]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url(/images/marketplace-hero.jpg)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/55 via-slate-900/40 to-slate-900/75" />
          <div className="absolute inset-0 opacity-[0.18]" style={{ backgroundImage: 'radial-gradient(ellipse 60% 50% at 70% 40%, rgba(168, 85, 247, 0.2), transparent), radial-gradient(ellipse 40% 40% at 30% 60%, rgba(96, 165, 250, 0.15), transparent)' }} />

          <div className="absolute bottom-0 left-0 right-0 px-8 py-12 sm:px-14 sm:py-16 text-white">
            <div className="max-w-2xl">
              <span className="inline-block rounded-full bg-blue-500/20 border border-blue-400/30 px-3.5 py-1 text-xs font-semibold text-blue-300 uppercase tracking-wider mb-3">
                Verified Marketplace
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
                Explore Local Service Professionals
              </h1>
              <p className="text-slate-200/90 text-base sm:text-lg leading-relaxed max-w-xl">
                Browse top-tier specialists, compare transparent hourly rates, read verified reviews, and connect directly in seconds.
              </p>
            </div>
          </div>
        </section>

        {/* Filter & Search Controls */}
        <div className="mt-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <SearchIcon />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services, pros, skills, or locations..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-sm font-medium"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
              Sort by:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviews</option>
              <option value="name">Name (A - Z)</option>
            </select>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="mt-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex shrink-0 items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-600'
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results Grid */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between text-sm font-medium text-slate-500">
            <span>Showing <strong className="text-slate-800 font-bold">{filteredProviders.length}</strong> available professionals</span>
            {(search || activeCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearch('');
                  setActiveCategory('all');
                }}
                className="text-blue-600 hover:underline font-semibold"
              >
                Reset filters
              </button>
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredProviders.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => setSelectedProfile(p)}
                  className="group flex cursor-pointer flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.avatar}
                          alt={p.name}
                          className="h-14 w-14 rounded-full object-cover ring-2 ring-slate-100 shadow-sm"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-bold text-slate-900 text-base">{p.name}</h3>
                            {p.verified && <VerifiedIcon />}
                          </div>
                          <p className="text-sm font-medium text-blue-600">{p.service}</p>
                        </div>
                      </div>
                      <span className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-bold text-emerald-700">
                        {p.price}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <StarIcon key={s} filled={s <= Math.round(p.rating)} />
                        ))}
                      </div>
                      <span className="font-bold text-slate-900">{p.rating}</span>
                      <span className="text-slate-400">({p.reviews} verified reviews)</span>
                    </div>

                    <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      <LocationIcon /> {p.location}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.tags.map((t) => (
                        <span key={t} className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProfile(p);
                      }}
                      className="rounded-xl border border-blue-200 bg-blue-50 py-3 text-sm font-bold text-blue-600 transition-all hover:bg-blue-600 hover:text-white"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRequestQuote(p);
                      }}
                      className="rounded-xl bg-slate-900 py-3 text-sm font-bold text-white transition-all hover:bg-blue-600 shadow-sm hover:shadow-md"
                    >
                      Request Quote
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredProviders.length === 0 && (
            <div className="mt-12 text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <SearchIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">No matching professionals found</h3>
              <p className="text-slate-500 mt-2 max-w-md mx-auto">
                We couldn't find any service providers matching your current filters. Try expanding your search terms.
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  setActiveCategory('all');
                }}
                className="mt-6 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quote Modal */}
      <QuoteModal provider={quoteProvider} onClose={() => setQuoteProvider(null)} />

      {/* Profile Modal */}
      <ProfileModal provider={selectedProfile} onClose={() => setSelectedProfile(null)} />
    </div>
  );
}
