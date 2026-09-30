import type { ReactNode } from 'react';

export interface ServiceProvider {
  id: number;
  name: string;
  avatar: string;
  service: string;
  category: string;
  rating: number;
  reviews: number;
  price: string;
  location: string;
  verified: boolean;
  tags: string[];
}

export interface Category {
  id: string;
  label: string;
  icon: ReactNode;
}

export type PageType = 'home' | 'marketplace' | 'about' | 'testimonials' | 'contact';
