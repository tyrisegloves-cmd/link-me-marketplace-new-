import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ServiceProvider } from '../types';
import { StarIcon, VerifiedIcon } from '../data';

type BookingStatus = 'Pending' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';

interface BookingRecord {
  id: string;
  providerId: number;
  providerName: string;
  service: string;
  date: string;
  time: string;
  location: string;
  description: string;
  payment: 'online' | 'after-service';
  status: BookingStatus;
}

interface BookingModalProps {
  provider: ServiceProvider | null;
  onClose: () => void;
}

const bookingStorageKey = 'link-me:demo-bookings';
const times = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM'];

function readBookings(): BookingRecord[] {
  try {
    const data: unknown = JSON.parse(window.localStorage.getItem(bookingStorageKey) ?? '[]');
    return Array.isArray(data) ? data as BookingRecord[] : [];
  } catch {
    return [];
  }
}

function writeBookings(bookings: BookingRecord[]) {
  window.localStorage.setItem(bookingStorageKey, JSON.stringify(bookings));
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(`${value}T12:00:00`));
}

function nextAvailableDates() {
  return Array.from({ length: 10 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index + 1);
    return date;
  }).filter((date) => date.getDay() !== 0).slice(0, 7);
}

export function BookingModal({ provider, onClose }: BookingModalProps) {
  const dates = useMemo(nextAvailableDates, []);
  const [step, setStep] = useState(1);
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(dateKey(dates[0]));
  const [selectedTime, setSelectedTime] = useState('');
  const [location, setLocation] = useState('');
  const [payment, setPayment] = useState<'online' | 'after-service'>('after-service');
  const [bookings, setBookings] = useState<BookingRecord[]>(readBookings);
  const [notice, setNotice] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);

  if (!provider) return null;

  const unavailableTimes = new Set(
    bookings
      .filter((booking) => booking.providerId === provider.id && booking.date === selectedDate && booking.status !== 'Cancelled')
      .map((booking) => booking.time),
  );
  const canContinue = step === 1 ? description.trim().length >= 10 : step === 2 ? Boolean(selectedTime) : location.trim().length >= 6;
  const estimatedCost = provider.price.includes('/hr') ? provider.price.replace('/hr', ' for the first hour') : provider.price;
  const activeBooking = bookings.find((booking) => booking.providerId === provider.id && booking.date === selectedDate && booking.time === selectedTime && booking.status === 'Pending');

  const saveBooking = () => {
    if (!selectedTime || !location.trim() || unavailableTimes.has(selectedTime)) {
      setNotice('That time is no longer available. Please select another slot.');
      setStep(2);
      return;
    }
    const booking: BookingRecord = {
      id: reschedulingId ?? `BK-${Date.now().toString().slice(-6)}`,
      providerId: provider.id,
      providerName: provider.name,
      service: provider.service,
      date: selectedDate,
      time: selectedTime,
      location: location.trim(),
      description: description.trim(),
      payment,
      status: 'Pending',
    };
    const nextBookings = reschedulingId
      ? bookings.map((currentBooking) => currentBooking.id === reschedulingId ? booking : currentBooking)
      : [booking, ...bookings];
    writeBookings(nextBookings);
    setBookings(nextBookings);
    setReschedulingId(null);
    setStep(4);
    setNotice(reschedulingId ? 'Booking rescheduled. We’ll notify you when the professional responds.' : 'Booking request sent. We’ll notify you when the professional responds.');
  };

  const cancelBooking = (id: string) => {
    const nextBookings = bookings.map((booking) => booking.id === id ? { ...booking, status: 'Cancelled' as const } : booking);
    writeBookings(nextBookings);
    setBookings(nextBookings);
    setNotice('Booking cancelled. No charge was made.');
  };

  const startReschedule = (booking: BookingRecord) => {
    setReschedulingId(booking.id);
    setDescription(booking.description);
    setSelectedDate(booking.date);
    setSelectedTime('');
    setLocation(booking.location);
    setPayment(booking.payment);
    setNotice('Choose a new date and time for this booking.');
    setShowHistory(false);
    setStep(2);
  };

  const statusClasses: Record<BookingStatus, string> = {
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
    'In Progress': 'bg-violet-50 text-violet-700 border-violet-200',
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Cancelled: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-[250] flex items-end justify-center bg-slate-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl" initial={{ y: 32, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 32, opacity: 0 }} transition={{ type: 'spring', damping: 26, stiffness: 280 }}>
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
            <div><p className="text-xs font-bold uppercase tracking-wider text-blue-600">Link Me booking</p><h2 className="text-lg font-extrabold text-slate-900">Book a service</h2></div>
            <div className="flex items-center gap-2"><button onClick={() => setShowHistory(!showHistory)} className="rounded-lg px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50">{showHistory ? 'Booking flow' : 'My bookings'}</button><button onClick={onClose} aria-label="Close booking" className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100">✕</button></div>
          </div>

          {showHistory ? (
            <div className="p-5 sm:p-7"><h3 className="text-xl font-extrabold text-slate-900">Booking history</h3><p className="mt-1 text-sm text-slate-500">Manage bookings saved in this browser.</p>
              <div className="mt-5 space-y-3">{bookings.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">No bookings yet. Choose a professional to get started.</div> : bookings.map((booking) => <div key={booking.id} className="rounded-2xl border border-slate-200 p-4 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-bold text-slate-900">{booking.providerName}</p><p className="text-sm text-blue-600">{booking.service}</p><p className="mt-2 text-sm text-slate-600">{formatDate(booking.date)} · {booking.time}</p></div><span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${statusClasses[booking.status]}`}>{booking.status}</span></div><div className="mt-3 flex items-center justify-between gap-4 border-t border-slate-100 pt-3"><span className="text-xs text-slate-500">{booking.id}</span>{booking.status === 'Pending' && <div className="flex gap-3"><button onClick={() => startReschedule(booking)} className="text-xs font-bold text-blue-600 hover:underline">Reschedule</button><button onClick={() => cancelBooking(booking.id)} className="text-xs font-bold text-red-600 hover:underline">Cancel booking</button></div>}</div></div>)}</div>
            </div>
          ) : (
            <div className="p-5 sm:p-7">
              <div className="mb-7 grid grid-cols-4 gap-1">{['Details', 'Schedule', 'Location', 'Confirm'].map((label, index) => <div key={label} className="text-center"><div className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${step >= index + 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{index + 1}</div><p className={`mt-1 text-[10px] font-bold sm:text-xs ${step >= index + 1 ? 'text-blue-600' : 'text-slate-400'}`}>{label}</p></div>)}</div>
              <div className="grid gap-6 lg:grid-cols-[1fr_280px]"><div>
                {step === 1 && <section><h3 className="text-xl font-extrabold text-slate-900">Describe what you need</h3><p className="mt-1 text-sm text-slate-500">Give {provider.name.split(' ')[0]} enough detail to review your request.</p><textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="For example: The kitchen sink is leaking below the cabinet and needs attention this week." className="mt-5 min-h-36 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20" /><button onClick={() => setDescription(`I need help with ${provider.service.toLowerCase()}. Please review the details and let me know what to prepare before the appointment.`)} className="mt-2 text-xs font-bold text-blue-600 hover:underline">Use a structured description draft</button></section>}
                {step === 2 && <section><h3 className="text-xl font-extrabold text-slate-900">Choose a date and time</h3><p className="mt-1 text-sm text-slate-500">Unavailable slots are disabled to avoid double booking.</p><div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-7">{dates.map((date) => { const key = dateKey(date); return <button key={key} onClick={() => { setSelectedDate(key); setSelectedTime(''); }} className={`rounded-xl border px-2 py-3 text-center ${selectedDate === key ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 text-slate-600 hover:border-blue-300'}`}><span className="block text-[10px] font-bold uppercase">{new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date)}</span><span className="text-lg font-extrabold">{date.getDate()}</span></button>; })}</div><div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">{times.map((time) => { const unavailable = unavailableTimes.has(time); return <button key={time} disabled={unavailable} onClick={() => setSelectedTime(time)} className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${unavailable ? 'cursor-not-allowed border-slate-100 bg-slate-100 text-slate-400 line-through' : selectedTime === time ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'border-slate-200 text-slate-700 hover:border-blue-300'}`}>{time}</button>; })}</div></section>}
                {step === 3 && <section><h3 className="text-xl font-extrabold text-slate-900">Service location & payment</h3><p className="mt-1 text-sm text-slate-500">Your exact address is shared only after the booking is accepted.</p><label className="mt-5 block text-sm font-bold text-slate-700">Address</label><input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Street address, apartment, city" autoComplete="street-address" className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20" /><div className="mt-6"><p className="text-sm font-bold text-slate-700">Payment preference</p><div className="mt-2 grid gap-2 sm:grid-cols-2"><button onClick={() => setPayment('after-service')} className={`rounded-xl border p-3 text-left ${payment === 'after-service' ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}><b className="block text-sm text-slate-900">Pay after service</b><span className="text-xs text-slate-500">Confirm price with your professional.</span></button><button onClick={() => setPayment('online')} className={`rounded-xl border p-3 text-left ${payment === 'online' ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}><b className="block text-sm text-slate-900">Pay online</b><span className="text-xs text-slate-500">Available after approval.</span></button></div></div></section>}
                {step === 4 && <section className="rounded-2xl bg-emerald-50 p-6 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-2xl text-white">✓</div><h3 className="mt-4 text-xl font-extrabold text-slate-900">Request sent</h3><p className="mt-2 text-sm text-slate-600">{notice}</p>{activeBooking && <p className="mt-3 text-xs font-bold text-emerald-700">Reference {activeBooking.id}</p>}<button onClick={() => setShowHistory(true)} className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/25 hover:bg-blue-500">View booking history</button></section>}
                {notice && step !== 4 && <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">{notice}</p>}
                {step < 4 && <div className="mt-7 flex justify-between"><button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1} className="rounded-xl px-4 py-3 text-sm font-bold text-slate-500 disabled:invisible">Back</button><button onClick={() => step === 3 ? saveBooking() : canContinue && setStep(step + 1)} disabled={!canContinue} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/25 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-200">{step === 3 ? 'Send booking request' : 'Continue'}</button></div>}
              </div>
              <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-center gap-3"><img src={provider.avatar} alt={provider.name} className="h-12 w-12 rounded-xl object-cover" /><div><div className="flex items-center gap-1"><p className="font-bold text-slate-900">{provider.name}</p>{provider.verified && <VerifiedIcon />}</div><p className="text-xs font-semibold text-blue-600">{provider.service}</p></div></div><div className="mt-4 flex items-center gap-1 text-xs text-slate-500"><div className="flex">{[1, 2, 3, 4, 5].map((star) => <StarIcon key={star} filled={star <= Math.round(provider.rating)} />)}</div><b className="text-slate-700">{provider.rating}</b><span>({provider.reviews})</span></div><div className="mt-4 border-t border-slate-200 pt-4 text-sm"><div className="flex justify-between"><span className="text-slate-500">Estimated cost</span><b className="text-slate-900">{estimatedCost}</b></div>{selectedTime && <div className="mt-2 flex justify-between"><span className="text-slate-500">Appointment</span><b className="text-right text-slate-900">{formatDate(selectedDate)}<br />{selectedTime}</b></div>}</div></aside>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
