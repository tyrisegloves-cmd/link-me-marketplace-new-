import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ServiceProvider } from '../types';
import { ChatRoom } from './ChatRoom';

interface BookingModalProps {
  provider: ServiceProvider | null;
  onClose: () => void;
}

const timeSlots = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM'];

function upcomingDates() {
  return Array.from({ length: 8 }, (_, offset) => {
    const date = new Date();
    date.setDate(date.getDate() + offset + 1);
    return date;
  }).filter((date) => date.getDay() !== 0).slice(0, 6);
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatAppointment(date: string, time: string) {
  const formattedDate = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date(`${date}T12:00:00`));
  return `${formattedDate} at ${time}`;
}

export function BookingModal({ provider, onClose }: BookingModalProps) {
  const dates = useMemo(upcomingDates, []);
  const [step, setStep] = useState(1);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(toDateKey(dates[0]));
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  if (!provider) return null;

  const canContinue = step === 1 ? description.trim().length >= 10 : step === 2 ? Boolean(time) : location.trim().length >= 6;

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-[250] flex items-end justify-center bg-slate-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="w-full max-w-2xl overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl" initial={{ y: 32, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 32, opacity: 0 }} transition={{ type: 'spring', damping: 26, stiffness: 280 }}>
          {chatOpen ? (
            <ChatRoom provider={provider} customerName="Customer" issue={description} location={location} availability={formatAppointment(date, time)} onClose={() => setChatOpen(false)} />
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-7">
                <div><p className="text-xs font-bold uppercase tracking-wider text-blue-600">Booking request</p><h2 className="text-lg font-extrabold text-slate-900">{provider.service}</h2></div>
                <button onClick={onClose} aria-label="Close booking form" className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100">✕</button>
              </div>

              {submitted ? (
                <div className="px-5 py-12 text-center sm:px-10">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-2xl text-white">✓</div>
                  <h3 className="mt-5 text-2xl font-extrabold text-slate-900">Your request has been sent</h3>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">{provider.name} will review your request for {formatAppointment(date, time)}. You’ll receive a notification when they respond.</p>
                  <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><button onClick={() => setChatOpen(true)} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-500">Chat with Agent</button><button onClick={onClose} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-600">Book another service</button></div>
                </div>
              ) : (
                <div className="p-5 sm:p-7">
                  <div className="mb-7 grid grid-cols-3 gap-2">{['Service', 'Schedule', 'Location'].map((label, index) => <div key={label} className="text-center"><span className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${step >= index + 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{index + 1}</span><p className={`mt-1 text-[11px] font-bold ${step >= index + 1 ? 'text-blue-600' : 'text-slate-400'}`}>{label}</p></div>)}</div>
                  {step === 1 && <section><h3 className="text-xl font-extrabold text-slate-900">Describe the service you need</h3><p className="mt-1 text-sm text-slate-500">Tell {provider.name.split(' ')[0]} what you need help with.</p><textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe the job, including any important details." className="mt-5 min-h-36 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20" /><button onClick={() => setDescription(`I need help with ${provider.service.toLowerCase()}. Please review the details and let me know what to prepare before the appointment.`)} className="mt-2 text-xs font-bold text-blue-600 hover:underline">Use a description draft</button></section>}
                  {step === 2 && <section><h3 className="text-xl font-extrabold text-slate-900">Select a date and time</h3><div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-6">{dates.map((item) => { const key = toDateKey(item); return <button key={key} onClick={() => { setDate(key); setTime(''); }} className={`rounded-xl border px-2 py-3 ${date === key ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 text-slate-600 hover:border-blue-300'}`}><span className="block text-[10px] font-bold uppercase">{new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(item)}</span><span className="text-lg font-extrabold">{item.getDate()}</span></button>; })}</div><div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">{timeSlots.map((slot) => <button key={slot} onClick={() => setTime(slot)} className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${time === slot ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'border-slate-200 text-slate-700 hover:border-blue-300'}`}>{slot}</button>)}</div></section>}
                  {step === 3 && <section><h3 className="text-xl font-extrabold text-slate-900">Where is the service needed?</h3><p className="mt-1 text-sm text-slate-500">Your address is shared with the agent only after they accept your request.</p><label className="mt-5 block text-sm font-bold text-slate-700" htmlFor="booking-address">Service address</label><input id="booking-address" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Street address, apartment, city" autoComplete="street-address" className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20" /><div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm"><p className="font-bold text-slate-900">Request summary</p><p className="mt-1 text-slate-600">{formatAppointment(date, time)}</p></div></section>}
                  <div className="mt-8 flex items-center justify-between"><button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1} className="rounded-xl px-4 py-3 text-sm font-bold text-slate-500 disabled:invisible">Back</button><button onClick={() => step === 3 ? setSubmitted(true) : setStep(step + 1)} disabled={!canContinue} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/25 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-200">{step === 3 ? 'Send request' : 'Continue'}</button></div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
