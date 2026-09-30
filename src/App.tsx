import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import { RippleButton } from './components/RippleButton';
import { WaveTransition } from './components/WaveTransition';
import { ProfileModal } from './components/ProfileModal';

import type { PageType } from './types';
import {
  providers,
  testimonials,
  SearchIcon,
  StarIcon,
  VerifiedIcon,
  LocationIcon,
  ArrowRightIcon,
} from './data';
import { MarketplacePage } from './pages/MarketplacePage';
import { AboutPage } from './pages/AboutPage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { ContactPage } from './pages/ContactPage';

export default function App() {
  const [history, setHistory] = useState<PageType[]>(['home']);
  const currentPage = history[history.length - 1];

  // Wave transition state
  const [wave, setWave] = useState<{ active: boolean; x: number; y: number; target: PageType | null; isBack: boolean }>({
    active: false, x: 0, y: 0, target: null, isBack: false,
  });

  const triggerWave = (e: MouseEvent<HTMLElement>, target: PageType) => {
    if (target === currentPage) return;
    const x = e.clientX;
    const y = e.clientY;
    setWave({ active: true, x, y, target, isBack: false });
  };

  const handleWaveComplete = () => {
    if (wave.target && wave.target !== currentPage) {
      setHistory((prev) => [...prev, wave.target!]);
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
    setTimeout(() => setWave({ active: false, x: 0, y: 0, target: null, isBack: false }), 180);
  };

  const navigateTo = (page: PageType) => {
    if (page !== currentPage) {
      setHistory((prev) => [...prev, page]);
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  const goBack = (e?: MouseEvent<HTMLElement>) => {
    if (history.length > 1) {
      const prevPage = history[history.length - 2];
      if (e) {
        setWave({ active: true, x: e.clientX, y: e.clientY, target: prevPage, isBack: true });
      } else {
        setHistory((prev) => prev.slice(0, -1));
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    }
  };

  const handleBackWaveComplete = () => {
    setHistory((prev) => prev.slice(0, -1));
    window.scrollTo({ top: 0, behavior: 'auto' });
    setTimeout(() => setWave({ active: false, x: 0, y: 0, target: null, isBack: false }), 180);
  };

  const [splashDone, setSplashDone] = useState(false);
  const [search, setSearch] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<typeof providers[0] | null>(null);

  const heroRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);

  // Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    // @ts-ignore
    lenis.on('scroll', ({ scroll }: { scroll: number }) => {
      setScrolled(scroll > 64);
      setShowTop(scroll > 650);
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // smooth anchor links
    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const a = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el as HTMLElement, { offset: -80, duration: 1.2 });
      }
    };
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
      lenis.destroy();
    };
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 240, damping: 32, mass: 0.2 });

  // Hero parallax
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 700], [0, 220]);
  const heroScale = useTransform(scrollY, [0, 520], [1, 1.09]);
  const heroBlur = useTransform(scrollY, [0, 400], ['blur(0px)', 'blur(4px)']);
  const searchLift = useTransform(scrollY, [0, 320], [0, -28]);



  const scrollToServices = () => {
    servicesRef.current?.scrollIntoView({ behavior: 'auto' });
    // lenis will smooth it because we intercept anchor click – fallback manual
    // @ts-ignore
    window.lenis?.scrollTo?.(servicesRef.current, { offset: -80 });
    if (servicesRef.current) {
      // basic smooth fallback
      const target = servicesRef.current;
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'auto' });
      // lenis already smooths via raf so if no direct call it's fine
    }
    // Use anchor
    setTimeout(() => {
      document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };

  return (
    <>
      {/* Splash Screen */}
      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}

      {/* Wave page transition overlay */}
      <WaveTransition
        active={wave.active}
        originX={wave.x}
        originY={wave.y}
        onComplete={wave.isBack ? handleBackWaveComplete : handleWaveComplete}
      />

      {/* Main app — hidden until splash completes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: splashDone ? 1 : 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{ willChange: 'opacity', fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif' }}
        className="min-h-screen bg-white text-slate-900 antialiased"
      >
      {/* scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 origin-left z-[100] h-[3px] bg-gradient-to-r from-violet-600 via-indigo-500 to-fuchsia-500"
        style={{ scaleX }}
      />

      {/* Header */}
      <motion.header
        initial={{ y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-[3px] left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/88 backdrop-blur-xl shadow-[0_1px_0_0_rgba(15,23,42,0.06)] border-b border-slate-200/80'
            : 'bg-white/0 backdrop-blur-[2px] border-b border-transparent'
        }`}
      >
        <div className={`mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-all duration-300 ${scrolled ? 'h-[62px]' : 'h-[74px]'}`}>
          <RippleButton
            as="div"
            rippleColor="rgba(99,102,241,0.25)"
            onClick={(e) => triggerWave(e, 'home')}
            className="flex items-center gap-3 cursor-pointer group rounded-xl px-1 py-1"
          >
            <motion.div
              whileHover={{ rotate: [0, -8, 7, -4, 0], scale: 1.04 }}
              transition={{ duration: 0.55 }}
              className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-200 flex items-center justify-center"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </motion.div>
            <span className="text-[20px] font-[780] tracking-[-0.015em] text-slate-900 group-hover:text-blue-600 transition-colors">Link Me</span>
          </RippleButton>

          <nav className="hidden md:flex items-center gap-7 text-[14px] font-[500] text-slate-600">
            {[
              { label: 'Home', id: 'home' as const },
              { label: 'Marketplace', id: 'marketplace' as const },
              { label: 'About Us', id: 'about' as const },
              { label: 'Testimonials', id: 'testimonials' as const },
              { label: 'Contact Us', id: 'contact' as const },
            ].map((n) => (
              <RippleButton
                key={n.id}
                rippleColor="rgba(59,130,246,0.30)"
                onClick={(e) => triggerWave(e, n.id)}
                className={`relative group transition-colors py-1 px-2 rounded-lg cursor-pointer font-[550] ${
                  currentPage === n.id ? 'text-blue-600 font-[700]' : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                <span>{n.label}</span>
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-blue-600 transition-all duration-300 rounded-full ${
                    currentPage === n.id ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </RippleButton>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* Bell Notification Button */}
            <RippleButton
              rippleColor="rgba(239,68,68,0.25)"
              className="relative rounded-full w-10 h-10 flex items-center justify-center bg-slate-100/70 hover:bg-slate-200/80 text-slate-600 hover:text-red-600 transition-colors cursor-pointer"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-5 5v-5zM9 17h5l-5 5V17zM4 14h16l-2 7H6l-2-7z" />
              </svg>
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[14px] items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold px-1">
                3
              </span>
            </RippleButton>

            <RippleButton
              rippleColor="rgba(37,99,235,0.25)"
              className="hidden sm:block rounded-[11px] border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-[7px] text-[13.5px] font-[620] transition-colors cursor-pointer"
            >
              Log in
            </RippleButton>
            <RippleButton
              rippleColor="rgba(255,255,255,0.40)"
              className="rounded-[11px] bg-blue-600 hover:bg-blue-500 px-4 py-[9px] text-[13.5px] font-[620] text-white shadow-md shadow-blue-900/20 transition-all cursor-pointer"
            >
              Sign Up
            </RippleButton>
          </div>
        </div>
      </motion.header>

      {/* Fixed Back Button beneath header */}
      <AnimatePresence>
        {history.length > 1 && currentPage !== 'home' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`fixed z-40 left-4 sm:left-8 transition-all duration-300 ${
              scrolled ? 'top-[68px]' : 'top-[80px]'
            }`}
          >
            <RippleButton
              rippleColor="rgba(59,130,246,0.35)"
              onClick={(e) => goBack(e)}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white/95 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-md hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all cursor-pointer"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to{' '}
              {history[history.length - 2] === 'home'
                ? 'Home'
                : history[history.length - 2] === 'about'
                ? 'About Us'
                : history[history.length - 2] === 'testimonials'
                ? 'Testimonials'
                : history[history.length - 2] === 'contact'
                ? 'Contact Us'
                : 'Marketplace'}
            </RippleButton>
          </motion.div>
        )}
      </AnimatePresence>

      {currentPage === 'home' && (
        <>
          {/* Hero */}
          <section ref={heroRef} className="relative min-h-[88vh] flex items-center overflow-hidden pt-[74px]">
        <motion.div style={{ y: heroY, scale: heroScale, filter: heroBlur }} className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url(/images/hero-bg.jpg)" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,11,34,0.72)_0%,rgba(10,9,24,0.62)_36%,rgba(9,9,24,0.86)_100%)]" />
          <div className="absolute inset-0 opacity-[0.16]" style={{ backgroundImage: 'radial-gradient(circle at 22% 30%, #a78bfa 0, transparent 35%), radial-gradient(circle at 80% 18%, #60a5fa 0, transparent 28%)' }} />
        </motion.div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-[880px] mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="inline-flex items-center gap-[10px] rounded-full border border-white/[0.19] bg-white/[0.072] backdrop-blur-md px-[14px] py-[7px] text-[12.5px] font-[520] text-white/92 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.10)]"
            >
              <span className="relative flex h-[8px] w-[8px]">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-[8px] w-[8px] rounded-full bg-emerald-400" />
              </span>
              2,400+ local pros ready to help
              <span className="text-white/45 ml-1 hidden sm:inline">• Verified & insured</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.68, ease: [0.22,1,0.36,1], delay: 0.28 }}
              className="mt-7 text-[40px] leading-[1.06] sm:text-[64px] sm:leading-[0.98] lg:text-[80px] font-[800] tracking-[-0.027em] text-white"
            >
              Link your need<br />
              to the right{' '}
              <span className="bg-gradient-to-r from-violet-300 via-indigo-200 to-fuchsia-200 bg-clip-text text-transparent">
                local service
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.45 }}
              className="mx-auto mt-6 max-w-[620px] text-[18px] leading-relaxed text-slate-200/90 font-[440]"
            >
              From emergency repairs to everyday help, Link Me instantly connects you with trusted,
              verified service providers in your neighborhood.
            </motion.p>

            <motion.div
              style={{ y: searchLift }}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.62, delay: 0.6, ease: [0.22,1,0.36,1] }}
              className="mx-auto mt-11 max-w-[670px] text-left"
            >
              <div className="relative rounded-[20px] border border-white/[0.19] bg-white/[0.085] backdrop-blur-xl p-[9px] shadow-[0_24px_70px_rgba(0,0,0,0.34)]">
                <div className="flex items-center gap-1">
                  <div className="pl-[14px] text-white/55">
                    <SearchIcon />
                  </div>
                  <input
                    value={search}
                    onChange={(e)=>setSearch(e.target.value)}
                    placeholder="What do you need help with?"
                    className="h-[54px] flex-1 bg-transparent border-0 outline-none text-[15.5px] text-white placeholder:text-white/50 px-3"
                  />
                  <button
                    onClick={() => {
                      // nudge scroll to services
                      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="hidden sm:inline-flex rounded-[14px] bg-indigo-600 hover:bg-indigo-500 px-[22px] py-[13px] text-[14px] font-[630] text-white transition-colors shadow"
                  >
                    Search
                  </button>
                </div>
              </div>
              <div className="mt-[14px] flex flex-wrap gap-[9px] items-center justify-center text-[13px]">
                <span className="text-white/48">Popular:</span>
                {['Plumber','House Cleaning','Wi-Fi Setup','Massage'].map((t) => (
                  <button
                    key={t}
                    onClick={()=> setSearch(t)}
                    className="rounded-full px-[13px] py-[6px] bg-white/[0.09] text-white/80 backdrop-blur-sm border border-white/[0.15] hover:bg-white/[0.16] hover:text-white transition-all"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.95, duration: 0.55 }}
              className="mt-12 flex items-center justify-center gap-9 text-[13px] text-white/60"
            >
              <div>⏳ Avg reply <span className="text-white">9 min</span></div>
              <div className="h-4 w-px bg-white/18" />
              <div>★ 4.8/5 average</div>
              <div className="h-4 w-px bg-white/18" />
              <div>✓ 2,412 verified</div>
            </motion.div>
          </div>
        </div>

        {/* scroll hint */}
        <motion.button
          onClick={scrollToServices}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute left-1/2 bottom-8 -translate-x-1/2 flex flex-col items-center gap-2 text-white/56 hover:text-white transition-colors"
        >
          <span className="text-[11px] uppercase tracking-wider">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.55, ease: 'easeInOut' }}
            className="w-[22px] h-[34px] rounded-full border border-white/34 flex justify-center pt-[7px]"
          >
            <div className="w-[3px] h-[8px] rounded-full bg-white/70" />
          </motion.div>
        </motion.button>

        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white via-white/96 to-transparent pointer-events-none" />
      </section>

      {/* Services */}
      <main id="services" ref={servicesRef} className="relative bg-white">
        <Reveal>
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-[64px] pb-20">

            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                  Featured Professionals
                </span>
                <h2 className="mt-4 text-[32px] sm:text-[38px] font-[760] tracking-[-0.018em] text-slate-900">
                  Browse services near you
                </h2>
                <p className="mt-2 text-[16px] text-slate-500">
                  Hand-picked top-rated professionals. Click a card to view their full profile.
                </p>
              </div>
              <RippleButton
                rippleColor="rgba(37,99,235,0.22)"
                onClick={(e) => triggerWave(e, 'marketplace')}
                className="shrink-0 inline-flex items-center gap-2 rounded-[14px] border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-5 py-3 text-[14px] font-[700] transition-all cursor-pointer"
              >
                View All Professionals
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </RippleButton>
            </div>

            {/* Featured 3 provider cards */}
            <div className="grid gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
              {providers.slice(0, 3).map((p, idx) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.48, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -6 }}
                  onClick={() => setSelectedProfile(p)}
                  className="group relative flex flex-col rounded-[22px] border border-slate-200 bg-white p-[20px] shadow-[0_8px_28px_rgba(2,8,23,0.06)] hover:shadow-[0_20px_50px_rgba(59,130,246,0.13)] hover:border-blue-200 transition-all cursor-pointer"
                >
                  {/* Click hint */}
                  <div className="absolute top-4 right-4 text-[11px] font-semibold text-slate-400 group-hover:text-blue-500 transition-colors flex items-center gap-1">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View profile
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="h-[54px] w-[54px] rounded-2xl object-cover ring-[3px] ring-slate-100 shadow-sm group-hover:ring-blue-200 transition-all"
                    />
                    <div>
                      <div className="flex items-center gap-[6px]">
                        <div className="font-[700] text-slate-900">{p.name}</div>
                        {p.verified && <VerifiedIcon />}
                      </div>
                      <div className="text-[13px] font-semibold text-blue-600">{p.service}</div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-[5px] text-[13px] text-slate-600">
                    <div className="flex">{[1,2,3,4,5].map(s => <StarIcon key={s} filled={s <= Math.round(p.rating)} />)}</div>
                    <span className="font-[700] text-slate-900 ml-1">{p.rating}</span>
                    <span className="text-slate-400">({p.reviews} reviews)</span>
                  </div>

                  <div className="mt-2 text-[13px] text-slate-500 flex items-center gap-[6px]">
                    <LocationIcon /> {p.location}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-[6px]">
                    {p.tags.map(tag => (
                      <span key={tag} className="text-[11px] font-[600] bg-slate-100 text-slate-600 px-[10px] py-[5px] rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                      {p.price}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // don't open profile
                        setSelectedProfile(p);
                      }}
                      className="text-[12.5px] font-[700] text-white bg-slate-900 hover:bg-blue-600 transition-colors px-4 py-2 rounded-xl shadow-sm"
                    >
                      Request Quote
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* View All CTA banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-10 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden"
            >
              <div className="absolute right-0 top-0 w-64 h-64 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
              <div className="relative text-center sm:text-left">
                <p className="text-white font-bold text-lg">
                  Showing 3 of <span className="text-blue-400">2,400+</span> verified professionals
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  Filter by category, location, rating and more in the full marketplace.
                </p>
              </div>
              <RippleButton
                rippleColor="rgba(255,255,255,0.3)"
                onClick={(e) => triggerWave(e, 'marketplace')}
                className="relative shrink-0 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-[14px] shadow-lg shadow-blue-900/40 transition-colors cursor-pointer"
              >
                Explore Full Marketplace
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </RippleButton>
            </motion.div>

          </section>
        </Reveal>

        {/* How it Works */}
        <section id="how-it-works" className="relative py-[96px] bg-[#f7f7fb] overflow-hidden">
          <ParallaxStripe />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal y={22}>
              <div className="text-center max-w-[690px] mx-auto">
                <h2 className="text-[34px] sm:text-[40px] font-[760] tracking-[-0.018em] text-slate-900">How Link Me works</h2>
                <p className="mt-3 text-[17px] text-slate-600">Get help in three simple steps</p>
              </div>
            </Reveal>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {[
                {
                  title: 'Describe your need',
                  desc: 'Search by service type, keyword, or browse categories to find exactly what you need.',
                  icon: <SearchIcon />,
                },
                {
                  title: 'Compare local pros',
                  desc: 'Review verified profiles, transparent pricing, ratings, and availability in your area.',
                  icon: (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                },
                {
                  title: 'Book & relax',
                  desc: 'Schedule instantly, communicate securely, and pay only when the job is done right.',
                  icon: (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                },
              ].map((s, i) => (
                <Reveal key={i} y={34} delay={i * 0.11}>
                  <div className="relative rounded-[22px] bg-white p-[30px] shadow-[0_10px_40px_rgba(20,28,70,0.06)] border border-slate-100">
                    <div className="flex items-center justify-center w-[50px] h-[50px] rounded-[14px] bg-violet-100 text-violet-700 mb-4">
                      {s.icon}
                    </div>
                    <div className="absolute right-[22px] top-[18px] text-[52px] font-[750] text-slate-100 leading-none">0{i+1}</div>
                    <div className="text-[18px] font-[670] text-slate-900">{s.title}</div>
                    <div className="mt-[9px] text-[15px] leading-relaxed text-slate-600">{s.desc}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-[94px] bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="text-center">
                <h2 className="text-[34px] sm:text-[39px] font-[760] tracking-[-0.018em]">Loved by locals</h2>
                <p className="mt-3 text-[17px] text-slate-600">Real stories from real customers</p>
              </div>
            </Reveal>

            <div className="mt-12 grid gap-[20px] md:grid-cols-3">
              {testimonials.map((t, idx) => (
                <Reveal key={t.id} y={24} delay={idx * 0.09} direction={idx % 2 === 0 ? 'left' : 'right'}>
                  <div className="h-full rounded-[20px] border border-slate-155 bg-slate-50/95 p-[22px] hover:border-violet-200 hover:bg-violet-50/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <img src={t.avatar} alt={t.name} className="h-[44px] w-[44px] rounded-full object-cover" />
                      <div>
                        <div className="font-[620] text-slate-900">{t.name}</div>
                        <div className="text-[13px] text-slate-500">{t.role}</div>
                      </div>
                    </div>
                    <p className="mt-[15px] text-[15.3px] leading-[1.62] text-slate-700">“{t.quote}”</p>
                    <div className="mt-[14px] flex gap-[2px]">
                      {[1,2,3,4,5].map(s=><StarIcon key={s} filled />)}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <Reveal>
          <section className="relative overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-[26px]">
              <div className="rounded-[30px] bg-[#0f111b] text-white px-[32px] sm:px-[56px] py-[70px] sm:py-[82px] text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.44]" style={{ backgroundImage: 'radial-gradient(60% 80% at 70% 20%, rgba(124,58,237,0.25), transparent 60%), radial-gradient(42% 55% at 14% 80%, rgba(59,130,246,0.2), transparent 60%)' }} />
                <div className="relative">
                  <h3 className="text-[30px] sm:text-[40px] font-[750] tracking-[-0.018em]">Ready to get things done?</h3>
                  <p className="mt-[12px] max-w-[620px] mx-auto text-[17px] leading-relaxed text-slate-300">
                    Join thousands of locals who use Link Me to find reliable help for any task, any time.
                  </p>
                   <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                     <RippleButton
                       rippleColor="rgba(255,255,255,0.35)"
                       onClick={(e) => triggerWave(e, 'marketplace')}
                       className="inline-flex items-center gap-2 rounded-[14px] bg-indigo-600 hover:bg-indigo-500 px-[24px] py-[13px] text-[14.5px] font-[630] text-white shadow-lg shadow-indigo-950/35 transition-colors cursor-pointer"
                     >
                       Find a Service <ArrowRightIcon />
                     </RippleButton>
                     <RippleButton
                       rippleColor="rgba(255,255,255,0.25)"
                       onClick={(e) => triggerWave(e, 'contact')}
                       className="rounded-[14px] border border-slate-640 bg-slate-800/85 px-[24px] py-[13px] text-[14.5px] font-[600] text-white hover:bg-slate-700 transition-colors cursor-pointer"
                     >
                       List Your Business
                     </RippleButton>
                   </div>
                </div>
              </div>
            </div>
          </section>
        </Reveal>
      </main>
        </>
      )}

      {currentPage === 'marketplace' && <MarketplacePage />}
      {currentPage === 'about' && <AboutPage />}
      {currentPage === 'testimonials' && <TestimonialsPage />}
      {currentPage === 'contact' && <ContactPage />}

      <footer id="footer-contact" className="border-t border-slate-200 bg-white pt-20 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-[10px]">
                <div className="h-8 w-8 rounded-[10px] bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <span className="text-[18px] font-[760] tracking-[-0.01em] text-slate-900">Link Me</span>
              </div>
              <p className="mt-5 max-w-xs text-[14.5px] leading-relaxed text-slate-500">
                The fastest way to connect your needs to verified, top-rated service professionals in your local area.
              </p>
              <div className="mt-6 flex gap-4 text-slate-400">
                <a href="#" className="hover:text-indigo-600 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                </a>
                <a href="#" className="hover:text-indigo-600 transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                </a>
                <a href="#" className="hover:text-indigo-600 transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-[13px] font-[650] tracking-wider text-slate-900 uppercase">Customers</h3>
              <ul className="mt-5 space-y-3.5 text-[14.5px] text-slate-500">
                <li><button onClick={() => navigateTo('about')} className="hover:text-indigo-600 transition-colors cursor-pointer">How it works</button></li>
                <li><button onClick={() => navigateTo('about')} className="hover:text-indigo-600 transition-colors cursor-pointer">Safety & Guarantee</button></li>
                <li><button onClick={() => navigateTo('marketplace')} className="hover:text-indigo-600 transition-colors cursor-pointer">Service Categories</button></li>
                <li><button onClick={() => navigateTo('marketplace')} className="hover:text-indigo-600 transition-colors cursor-pointer">Pricing Guide</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-[13px] font-[650] tracking-wider text-slate-900 uppercase">Professionals</h3>
              <ul className="mt-5 space-y-3.5 text-[14.5px] text-slate-500">
                <li><button onClick={() => navigateTo('contact')} className="hover:text-indigo-600 transition-colors cursor-pointer">Become a Pro</button></li>
                <li><button onClick={() => navigateTo('contact')} className="hover:text-indigo-600 transition-colors cursor-pointer">Pro Dashboard</button></li>
                <li><button onClick={() => navigateTo('testimonials')} className="hover:text-indigo-600 transition-colors cursor-pointer">Success Stories</button></li>
                <li><button onClick={() => navigateTo('contact')} className="hover:text-indigo-600 transition-colors cursor-pointer">Community</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-[13px] font-[650] tracking-wider text-slate-900 uppercase">Company</h3>
              <ul className="mt-5 space-y-3.5 text-[14.5px] text-slate-500">
                <li><button onClick={() => navigateTo('about')} className="hover:text-indigo-600 transition-colors cursor-pointer">About Us</button></li>
                <li><button onClick={() => navigateTo('about')} className="hover:text-indigo-600 transition-colors cursor-pointer">Careers</button></li>
                <li><button onClick={() => navigateTo('contact')} className="hover:text-indigo-600 transition-colors cursor-pointer">Contact</button></li>
                <li><button onClick={() => navigateTo('contact')} className="hover:text-indigo-600 transition-colors cursor-pointer">Press</button></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[14px] text-slate-500">
              © {new Date().getFullYear()} Link Me Inc. All rights reserved.
            </p>
            <div className="flex gap-6 text-[13.5px] font-[500] text-slate-500">
              <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Cookie Settings</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}
            className="fixed bottom-6 right-6 z-50 rounded-full bg-slate-900 text-white w-12 h-12 shadow-xl shadow-slate-900/30 hover:bg-indigo-600 transition-colors flex items-center justify-center"
            aria-label="Back to top"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      <ProfileModal
        provider={selectedProfile}
        onClose={() => setSelectedProfile(null)}
      />

      <style>{`
        html { scroll-behavior: auto !important; }
        body { overscroll-behavior-y: none; }
        /* lenis */
        html.lenis, html.lenis body { height: auto; }
        .lenis.lenis-smooth { scroll-behavior: auto !important; }
        .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
        .lenis.lenis-stopped { overflow: hidden; }
        .lenis.lenis-smooth iframe { pointer-events: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </motion.div>
    </>
  );
}

// Reveal helper – smooth, gpu-accelerated, no jank
function Reveal({
  children,
  y = 26,
  delay = 0,
  direction = 'up',
}: {
  children: ReactNode;
  y?: number;
  delay?: number;
  direction?: 'up' | 'left' | 'right';
}) {
  const offset =
    direction === 'left' ? { x: -36, y: 0 } :
    direction === 'right' ? { x: 36, y: 0 } :
    { x: 0, y };
  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-80px 0px -60px 0px', amount: 0.15 }}
      transition={{
        duration: 0.58,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
}

// --- Splash Screen ---
function SplashScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'initial' | 'out' | 'gone'>('initial');

  useEffect(() => {
    // chain: 2.2s show, 0.7s fade out, then done
    const t1 = setTimeout(() => setPhase('out'), 2000);
    const t2 = setTimeout(() => {
      setPhase('gone');
      onDone();
    }, 2650);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  const handleClick = () => {
    if (phase === 'initial') {
      setPhase('out');
      setTimeout(() => {
        setPhase('gone');
        onDone();
      }, 500);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-[#0a0918]"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'gone' ? 0 : 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ willChange: 'opacity' }}
    >
      {/* Background similar to Hero */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/hero-bg.jpg)" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,11,34,0.85)_0%,rgba(10,9,24,0.75)_36%,rgba(9,9,24,0.92)_100%)]" />
        <div className="absolute inset-0 opacity-[0.25]" style={{ backgroundImage: 'radial-gradient(circle at 22% 30%, #a78bfa 0, transparent 35%), radial-gradient(circle at 80% 18%, #60a5fa 0, transparent 28%)' }} />
        <div className="absolute inset-0 backdrop-blur-[6px]" />
      </motion.div>

      {/* click to skip */}
      <motion.button
        onClick={handleClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'out' ? 0 : 0.35 }}
        transition={{ delay: 0.8 }}
        className="absolute top-5 right-6 text-white/35 text-[11.5px] font-[500] tracking-wide uppercase"
      >
        Tap to skip
      </motion.button>

      {/* logo icon */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{
          scale: phase === 'out' ? 0.82 : 1,
          opacity: phase === 'out' ? 0 : 1,
        }}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
          delay: phase === 'out' ? 0 : 0.15,
        }}
        className="relative"
      >
        <div className="w-[112px] h-[112px] rounded-[28px] bg-gradient-to-br from-violet-500 via-indigo-500 to-indigo-600 shadow-2xl shadow-indigo-900/60 flex items-center justify-center">
          <svg className="w-[56px] h-[56px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>

        {/* ring pulse */}
        <motion.div
          className="absolute -inset-4 rounded-[36px] border border-violet-400/25"
          initial={{ scale: 0.88, opacity: 0 }}
          animate={{ scale: 1.06, opacity: 0 }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeOut', delay: 0.5 }}
        />
      </motion.div>

      {/* brand name */}
      <motion.div
        initial={{ y: 18, opacity: 0 }}
        animate={{
          y: phase === 'out' ? -12 : 0,
          opacity: phase === 'out' ? 0 : 1,
        }}
        transition={{
          duration: 0.65,
          ease: [0.22, 1, 0.36, 1],
          delay: phase === 'out' ? 0.05 : 0.4,
        }}
        className="mt-8 text-center"
      >
        <h1 className="text-[48px] font-[800] tracking-[-0.025em] text-white leading-none">
          Link Me
        </h1>
        <p className="mt-[14px] text-[15px] font-[440] tracking-[0.02em] text-slate-400/80">
          Connect · Trust · Solve
        </p>
      </motion.div>

      {/* loading dots */}
      <motion.div
        className="mt-16 flex items-center gap-[6px]"
        initial={{ opacity: 0 }}
        animate={{
          opacity: phase === 'out' ? 0 : 1,
        }}
        transition={{ delay: 0.7, duration: 0.4 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-[7px] h-[7px] rounded-full bg-violet-400"
            animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
            transition={{
              repeat: Infinity,
              duration: 0.9,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

// subtle parallax stripe background
function ParallaxStripe() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const x = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div style={{ x }} className="absolute -top-28 -left-24 w-[520px] h-[520px] rounded-full blur-[120px] opacity-[0.17] bg-gradient-to-br from-violet-300 via-indigo-200 to-fuchsia-200" />
      <motion.div style={{ x: useTransform(x, v => typeof v === 'string' ? '0%' : `${-parseFloat(String(v))}px`) }} className="absolute -bottom-28 -right-24 w-[460px] h-[460px] rounded-full blur-[110px] opacity-[0.14] bg-gradient-to-tr from-sky-200 via-violet-200 to-indigo-200" />
    </div>
  );
}