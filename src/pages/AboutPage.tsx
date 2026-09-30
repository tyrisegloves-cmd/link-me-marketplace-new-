import { motion } from 'framer-motion';

export function AboutPage() {
  const team = [
    {
      name: 'Jessica Vance',
      role: 'Co-Founder & CEO',
      bio: 'Former VP of Marketplace Operations at tech giants, passionate about empowering local entrepreneurs.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Marcus Thorne',
      role: 'Co-Founder & CTO',
      bio: 'Architected high-scale peer-to-peer trust engines and real-time dispatch systems.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'David Alcantara',
      role: 'Head of Trust & Safety',
      bio: 'Over 12 years ensuring background verification, insurance policies, and secure escrow payments.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 bg-white">
      {/* Hero Section */}
      <section className="relative h-[380px] sm:h-[480px] flex items-end text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/about-hero.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/25 to-slate-900/65" />
        <div className="absolute inset-0 opacity-[0.14]" style={{ backgroundImage: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(168, 85, 247, 0.18), transparent), radial-gradient(ellipse 40% 30% at 50% 60%, rgba(96, 165, 250, 0.12), transparent)' }} />

        <div className="relative max-w-4xl mx-auto pb-12 sm:pb-16 px-4 sm:px-8 text-center">
          <span className="inline-block rounded-full bg-blue-500/20 border border-blue-400/30 px-3.5 py-1 text-xs font-semibold text-blue-300 uppercase tracking-wider mb-4">
            About Link Me
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4">
            Bridging neighbors with trusted local professionals
          </h1>
          <p className="text-lg text-slate-200/90 leading-relaxed max-w-2xl mx-auto">
            Founded in 2024, Link Me started with a simple belief: finding reliable, skilled help right in your community shouldn't be stressful, opaque, or overpriced.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        {/* Stats Grid */}
        <div className="mt-16 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {[
            { label: 'Verified Service Pros', val: '2,400+' },
            { label: 'Completed Home Jobs', val: '50,000+' },
            { label: 'Avg Customer Rating', val: '4.9 / 5.0' },
            { label: 'Earned by Local Pros', val: '$4.8M+' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center"
            >
              <div className="text-3xl sm:text-4xl font-black text-blue-600">{stat.val}</div>
              <div className="mt-2 text-sm font-semibold text-slate-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Our Mission Section */}
        <div className="mt-20 rounded-3xl bg-slate-900 text-white p-8 sm:p-14 grid gap-10 lg:grid-cols-2 items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold">Our Core Pillars</h2>
            <p className="mt-4 text-slate-300 leading-relaxed">
              Every feature on Link Me is engineered around three uncompromising principles designed to protect both homeowners and hardworking service providers.
            </p>
          </div>
          <div className="space-y-6 relative z-10">
            {[
              { title: '100% Verified Identity & Backgrounds', desc: 'Every service pro undergoes thorough licensing checks and identity verification before accepting jobs.' },
              { title: 'Transparent Upfront Pricing', desc: 'No hidden fees or unexpected surprise bills. Review hourly quotes and agree on scope before work begins.' },
              { title: 'Secure Payment Guarantee', desc: 'Funds are held securely and only released once you confirm satisfaction with the finished task.' },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-300 font-bold shrink-0">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">{item.title}</h4>
                  <p className="text-sm text-slate-400 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Grid */}
        <div className="mt-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900">Leadership Team</h2>
            <p className="mt-2 text-slate-600">The people behind the marketplace connecting thousands daily.</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {team.map((member, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 text-center hover:shadow-lg transition-shadow">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto ring-4 ring-blue-50 shadow-md"
                />
                <h3 className="mt-4 text-lg font-bold text-slate-900">{member.name}</h3>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">{member.role}</span>
                <p className="mt-3 text-sm text-slate-500 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
