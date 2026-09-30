import type { Category, ServiceProvider } from './types';

export const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={`h-5 w-5 ${className ?? ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg className={`h-4 w-4 ${filled ? 'text-amber-400' : 'text-slate-300'}`} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export const VerifiedIcon = () => (
  <svg className="h-4 w-4 text-sky-500" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

export const LocationIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const ArrowRightIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

export const categories: Category[] = [
  {
    id: 'all',
    label: 'All Services',
    icon: (
      <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    id: 'home',
    label: 'Home Repair',
    icon: (
      <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: 'cleaning',
    label: 'Cleaning',
    icon: (
      <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    id: 'tech',
    label: 'Tech Support',
    icon: (
      <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'wellness',
    label: 'Wellness',
    icon: (
      <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    id: 'events',
    label: 'Events',
    icon: (
      <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
];

export const providers: ServiceProvider[] = [
  {
    id: 1,
    name: 'Marcus Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    service: 'Emergency Plumbing',
    category: 'home',
    rating: 4.9,
    reviews: 128,
    price: '$85/hr',
    location: 'Downtown',
    verified: true,
    tags: ['Same Day', 'Licensed'],
  },
  {
    id: 2,
    name: 'Sarah Miller',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    service: 'Deep Home Cleaning',
    category: 'cleaning',
    rating: 4.8,
    reviews: 96,
    price: '$120',
    location: 'Westside',
    verified: true,
    tags: ['Eco Products', 'Recurring'],
  },
  {
    id: 3,
    name: 'David Park',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    service: 'Wi-Fi & Network Setup',
    category: 'tech',
    rating: 4.7,
    reviews: 64,
    price: '$95/hr',
    location: 'Uptown',
    verified: true,
    tags: ['Remote OK', 'Same Day'],
  },
  {
    id: 4,
    name: 'Elena Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    service: 'Mobile Massage Therapy',
    category: 'wellness',
    rating: 5.0,
    reviews: 42,
    price: '$140',
    location: 'Midtown',
    verified: true,
    tags: ['Certified', 'Spa Quality'],
  },
  {
    id: 5,
    name: 'James Wilson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    service: 'Furniture Assembly',
    category: 'home',
    rating: 4.6,
    reviews: 211,
    price: '$60/hr',
    location: 'Eastside',
    verified: false,
    tags: ['Fast', 'Tools Included'],
  },
  {
    id: 6,
    name: 'Aisha Johnson',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    service: 'Birthday Party Planning',
    category: 'events',
    rating: 4.9,
    reviews: 37,
    price: '$250+',
    location: 'Citywide',
    verified: true,
    tags: ['Custom Themes', 'Full Setup'],
  },
  {
    id: 7,
    name: 'Carlos Mendez',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    service: 'Smart Home Automation',
    category: 'tech',
    rating: 4.9,
    reviews: 83,
    price: '$110/hr',
    location: 'North Hills',
    verified: true,
    tags: ['Alexa/Google', 'Wired/Wireless'],
  },
  {
    id: 8,
    name: 'Hannah Vance',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    service: 'Personal Yoga Instruction',
    category: 'wellness',
    rating: 5.0,
    reviews: 55,
    price: '$90/hr',
    location: 'Downtown & Virtual',
    verified: true,
    tags: ['Beginner Friendly', 'Pre-natal'],
  },
  {
    id: 9,
    name: 'Robert Taylor',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    service: 'Electrical Repair & Rewiring',
    category: 'home',
    rating: 4.8,
    reviews: 142,
    price: '$95/hr',
    location: 'Metro Area',
    verified: true,
    tags: ['Master Electrician', 'Emergency'],
  },
];

export const testimonials = [
  {
    id: 1,
    name: 'Rachel T.',
    role: 'Homeowner',
    quote: 'Link Me found me a plumber in 12 minutes. The leak was fixed before dinner. Absolutely lifesaver!',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    category: 'home',
    rating: 5,
  },
  {
    id: 2,
    name: 'Kevin B.',
    role: 'Small Business Owner',
    quote: 'I use Link Me for all my office cleaning. Verified pros, fair prices, no hassle. Saved me hours every week.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    category: 'cleaning',
    rating: 5,
  },
  {
    id: 3,
    name: 'Monica S.',
    role: 'Event Planner',
    quote: 'The event vendors on Link Me are top tier. My clients are always impressed with the punctuality and flair.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    category: 'events',
    rating: 5,
  },
  {
    id: 4,
    name: 'Daniel W.',
    role: 'Remote Worker',
    quote: 'My router died right before a massive zoom presentation. A Link Me tech showed up in 25 mins and fixed it!',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    category: 'tech',
    rating: 5,
  },
  {
    id: 5,
    name: 'Sonia K.',
    role: 'Busy Mother',
    quote: 'Booking a mobile massage after a hectic work week has become my routine. Elena is fantastic!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    category: 'wellness',
    rating: 5,
  },
  {
    id: 6,
    name: 'Greg P.',
    role: 'Property Manager',
    quote: 'Having Link Me on my phone means I never panic when a tenant reports a leak or broken appliance.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    category: 'home',
    rating: 5,
  },
];
