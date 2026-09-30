import { useState } from 'react';
import { motion } from 'framer-motion';

export function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen pt-28 pb-20 bg-white">
      {/* Hero Section */}
      <section className="relative h-[360px] sm:h-[440px] flex items-end text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/contact-hero.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/45 via-slate-900/30 to-slate-900/70" />
        <div className="absolute inset-0 opacity-[0.16]" style={{ backgroundImage: 'radial-gradient(ellipse 60% 50% at 30% 60%, rgba(168, 85, 247, 0.15), transparent), radial-gradient(ellipse 40% 40% at 70% 30%, rgba(96, 165, 250, 0.12), transparent)' }} />

        <div className="relative max-w-4xl mx-auto pb-12 sm:pb-16 px-4 sm:px-8 text-center">
          <span className="inline-block rounded-full bg-blue-500/20 border border-blue-400/30 px-3.5 py-1 text-xs font-bold text-blue-300 uppercase tracking-wider mb-4">
           Customer Support
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4">
            We're here to help 24/7
          </h1>
          <p className="text-lg text-slate-200/90 leading-relaxed max-w-2xl mx-auto">
            Have questions about a booking, need help listing your business, or want to partner with us? Reach out directly.
          </p>
    
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
             Our Contact Platforms
          </span>
          <br></br>
        </div>

        {/* Contact Info Cards */}
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {[
            {
              title: 'Email Support',
              detail: 'support@linkme.app',
              sub: 'For inquires, follow-ups, and general support questions',
              icon: '✉️',
            },
            {
              title: 'Phone Support',
              detail: '+1 (800) 555-LINK',
              sub: 'Available 24/7 for active bookings',
              icon: '📞',
            },
            {
              title: 'Office premises',
              detail: '450 Innovation Way, Suite 300',
              sub: 'San Francisco, CA 94107',
              icon: '🏢',
            },
          ].map((c, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center hover:border-blue-300 transition-colors"
            >
              <div className="text-3xl mb-3">{c.icon}</div>
              <h3 className="font-bold text-slate-900 text-lg">{c.title}</h3>
              <p className="font-extrabold text-blue-600 mt-1">{c.detail}</p>
              <p className="text-xs text-slate-500 mt-2 font-medium">{c.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Form Section */}
        <div className="mt-16 grid gap-12 lg:grid-cols-2 items-start">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Send us a message</h2>
            <p className="text-slate-500 text-sm mt-1">Fill out the form below and a support specialist will reply promptly.</p>

            {!sent ? (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">First Name</label>
                    <input required type="text" placeholder="Sarah" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">Last Name</label>
                    <input required type="text" placeholder="Jenkins" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">Email Address</label>
                  <input required type="email" placeholder="sarah@example.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">Topic</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none font-medium text-slate-700">
                    <option>Existing Service Request inquiry</option>
                    <option>Pro Verification & Onboarding</option>
                    <option>Billing & Payment Guarantee</option>
                    <option>Partnership & Press</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">Your Message</label>
                  <textarea required rows={4} placeholder="How can we assist you today?" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 shadow-md shadow-blue-500/20 transition-all"
                >
                  Send Message
                </button>
              </form>
            ) : (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">✓</div>
                <h3 className="text-2xl font-bold text-slate-900">Message Received!</h3>
                <p className="text-slate-600 text-sm mt-2 max-w-sm mx-auto">
                  Thank you for contacting us. Ticket <strong>#LM-84920</strong> has been assigned to our support team.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800"
                >
                  Send another inquiry
                </button>
              </div>
            )}
          </div>

          {/* Frequently Asked Questions */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h3>
            {[
              {
                q: 'How fast can a service pro arrive for emergency home repairs?',
                a: 'Pros tagged with "Same Day" can typically arrive at your location within 30 to 60 minutes of booking confirmation.',
              },
              {
                q: 'Are all service professionals background checked?',
                a: 'Yes. Every professional displaying the Verified badge has cleared comprehensive criminal record scans, identity verification, and professional licensing checks.',
              },
              {
                q: 'What happens if I am not satisfied with the finished job?',
                a: 'Under our Link Me Guarantee, funds remain in secure escrow until job sign-off. If there is an issue, our dispute team steps in immediately or arranges a re-service at zero cost.',
              },
              {
                q: 'How do I list my service business on Link Me?',
                a: 'Click the "Become a Pro" button in the menu or footer to start our 10-minute onboarding verification process.',
              },
            ].map((faq, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <h4 className="font-bold text-slate-900 text-base">{faq.q}</h4>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
