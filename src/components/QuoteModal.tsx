import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ServiceProvider } from '../types';
import { VerifiedIcon } from '../data';
import { ChatRoom } from './ChatRoom';

interface QuoteModalProps {
  provider: ServiceProvider | null;
  onClose: () => void;
}

const inputClass =
  'w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400';
const labelClass = 'block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5';

const availabilityOptions = [
  'As soon as possible',
  'Today (within hours)',
  'Tomorrow',
  'This week',
  'Next week',
  'Flexible — let the pro suggest',
];

export function QuoteModal({ provider, onClose }: QuoteModalProps) {
  const [step, setStep] = useState<'form' | 'chat'>('form');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [issue, setIssue] = useState('');
  const [location, setLocation] = useState('');
  const [availability, setAvailability] = useState('');
  const [useMap, setUseMap] = useState(false);
  const [mapPin, setMapPin] = useState<{ lat: number; lng: number } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Reset state when provider changes
  useEffect(() => {
    if (provider) {
      setStep('form');
      setName('');
      setPhone('');
      setEmail('');
      setIssue('');
      setLocation('');
      setAvailability('');
      setUseMap(false);
      setMapPin(null);
    }
  }, [provider]);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // Simulate lat/lng from click position
    const lat = 40.7128 + (0.5 - y / rect.height) * 0.08;
    const lng = -74.006 + (x / rect.width - 0.5) * 0.12;
    setMapPin({ lat: parseFloat(lat.toFixed(4)), lng: parseFloat(lng.toFixed(4)) });
    setLocation(`${lat.toFixed(4)}°N, ${Math.abs(lng).toFixed(4)}°W`);
  };

  const canSubmit = name.trim() && phone.trim() && issue.trim() && location.trim() && availability;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setStep('chat');
  };

  if (!provider) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        <motion.div
          className="relative w-full sm:max-w-xl bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl z-10 max-h-[95vh] flex flex-col overflow-hidden"
          initial={{ y: 80, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {step === 'form' && (
            <>
              {/* Header */}
              <div className="px-6 pt-6 pb-4 border-b border-slate-100 shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={provider.avatar} alt={provider.name} className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100 shadow" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-slate-900">{provider.name}</h3>
                        {provider.verified && <VerifiedIcon />}
                      </div>
                      <p className="text-xs font-semibold text-blue-600">{provider.service}</p>
                    </div>
                  </div>
                  <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 text-sm font-bold transition-colors">
                    ✕
                  </button>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-1.5 flex-1 rounded-full bg-blue-600" />
                  <div className="h-1.5 flex-1 rounded-full bg-slate-200" />
                </div>
                <p className="mt-2 text-xs text-slate-500">Step 1 of 2 — Fill in your details to request a quote</p>
              </div>

              {/* Form body */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 max-sm:pr-2 [scrollbar-width:thin] [scrollbar-color:#94a3b8_ transparent]">
                {/* Name */}
                <div>
                  <label className={labelClass}>Full Name <span className="text-red-500">*</span></label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Alex Rivera" className={inputClass} />
                </div>

                {/* Phone */}
                <div>
                  <label className={labelClass}>Phone Number <span className="text-red-500">*</span></label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 123-4567" className={inputClass} />
                </div>

                {/* Email */}
                <div>
                  <label className={labelClass}>Email Address <span className="text-slate-400">(optional)</span></label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alex@example.com" className={inputClass} />
                </div>

                {/* Issue */}
                <div>
                  <label className={labelClass}>Describe Your Issue <span className="text-red-500">*</span></label>
                  <textarea
                    rows={3}
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    placeholder={`e.g. I need help with ${provider.service.toLowerCase()}. The problem started yesterday and...`}
                    className={inputClass}
                  />
                </div>

                {/* Location */}
                <div>
                  <label className={labelClass}>Your Location <span className="text-red-500">*</span></label>
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      onClick={() => setUseMap(false)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${!useMap ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      Type Address
                    </button>
                    <button
                      onClick={() => setUseMap(true)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${useMap ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Pin on Map
                    </button>
                  </div>

                  {!useMap ? (
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. 123 Oak Street, Apt 4B, Springfield"
                      className={inputClass}
                    />
                  ) : (
                    <div className="space-y-2">
                      <div
                        ref={mapRef}
                        onClick={handleMapClick}
                        className="relative w-full h-44 rounded-xl overflow-hidden cursor-crosshair border border-slate-200 bg-slate-100 select-none"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='40' height='40' fill='%23f1f5f9'/%3E%3Cpath d='M0 20h40M20 0v40' stroke='%23e2e8f0' stroke-width='0.5'/%3E%3C/svg%3E")`,
                          backgroundSize: '40px 40px',
                        }}
                      >
                        {/* Simulated map layer */}
                        <div className="absolute inset-0">
                          {/* Road lines */}
                          <div className="absolute top-1/2 left-0 right-0 h-[3px] bg-slate-300/80" />
                          <div className="absolute top-0 bottom-0 left-1/3 w-[3px] bg-slate-300/80" />
                          <div className="absolute top-0 bottom-0 left-2/3 w-[3px] bg-slate-300/80" />
                          <div className="absolute top-1/4 left-0 right-0 h-[2px] bg-slate-200/80" />
                          <div className="absolute top-3/4 left-0 right-0 h-[2px] bg-slate-200/80" />
                          {/* Park area */}
                          <div className="absolute top-[15%] left-[10%] w-[22%] h-[25%] rounded-xl bg-emerald-100/60 border border-emerald-200/50" />
                          {/* Water */}
                          <div className="absolute bottom-[5%] right-[5%] w-[28%] h-[18%] rounded-xl bg-sky-100/70 border border-sky-200/50" />
                          {/* Buildings */}
                          <div className="absolute top-[45%] left-[42%] w-3 h-3 rounded-sm bg-slate-300" />
                          <div className="absolute top-[55%] left-[52%] w-4 h-2.5 rounded-sm bg-slate-300" />
                          <div className="absolute top-[30%] left-[72%] w-2.5 h-4 rounded-sm bg-slate-300" />
                          <div className="absolute top-[60%] left-[22%] w-3.5 h-3 rounded-sm bg-slate-300" />
                          {/* Labels */}
                          <span className="absolute top-[18%] left-[13%] text-[8px] font-bold text-emerald-600/70">Park</span>
                          <span className="absolute bottom-[8%] right-[11%] text-[8px] font-bold text-sky-600/70">River</span>
                          <span className="absolute top-[48%] left-[6%] text-[7px] font-semibold text-slate-400">Main St</span>
                        </div>

                        {/* Click prompt */}
                        {!mapPin && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-slate-200 text-center">
                              <p className="text-xs font-bold text-slate-700">Click to drop a pin</p>
                              <p className="text-[10px] text-slate-500">Tap anywhere on the map</p>
                            </div>
                          </div>
                        )}

                        {/* Pin */}
                        {mapPin && (
                          <motion.div
                            initial={{ y: -30, scale: 0 }}
                            animate={{ y: 0, scale: 1 }}
                            className="absolute"
                            style={{
                              left: `${((mapPin.lng + 74.006) / 0.12 + 0.5) * 100}%`,
                              top: `${(0.5 - (mapPin.lat - 40.7128) / 0.08) * 100}%`,
                              transform: 'translate(-50%, -100%)',
                            }}
                          >
                            <div className="relative">
                              <svg className="w-8 h-10 text-blue-600 drop-shadow-lg" viewBox="0 0 24 36" fill="currentColor">
                                <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24s12-15 12-24C24 5.373 18.627 0 12 0z" />
                                <circle cx="12" cy="12" r="5" fill="white" />
                              </svg>
                              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-1 rounded-full bg-black/20 blur-sm" />
                            </div>
                          </motion.div>
                        )}
                      </div>
                      {mapPin && (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-bold text-slate-700">📍 Pinned:</span>
                          <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Availability */}
                <div>
                  <label className={labelClass}>Availability <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-2 gap-2">
                    {availabilityOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setAvailability(opt)}
                        className={`text-xs font-semibold px-3 py-2.5 rounded-xl border transition-all text-left ${
                          availability === opt
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <div className="px-6 py-4 border-t border-slate-100 bg-white shrink-0">
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${
                    canSubmit
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Submit & Start Conversation →
                </button>
                {!canSubmit && (
                  <p className="text-[10px] text-center text-slate-400 mt-2">Please fill all required fields (*) to continue</p>
                )}
              </div>
            </>
          )}

          {step === 'chat' && (
            <ChatRoom
              provider={provider}
              customerName={name}
              issue={issue}
              location={location}
              availability={availability}
              onClose={onClose}
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
