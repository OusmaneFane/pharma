// PharmaConnect — shared TypeScript types

export type { BreadcrumbItem, NavItem } from './navigation';
export type { TwoFactorSetupData, TwoFactorSecretKey } from './auth';
export type { AppLayoutProps, AuthLayoutProps } from './ui';

export type UserRole = 'client' | 'pharmacy' | 'admin' | 'delivery';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  avatar?: string | null;
  email_verified_at?: string | null;
  verified_at?: string | null;
  two_factor_enabled?: boolean;
  created_at?: string;
  updated_at?: string;
  role: UserRole;
  avatar?: string | null;
  email_verified_at?: string | null;
  verified_at?: string | null;
  two_factor_enabled?: boolean;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
  role: UserRole;
  avatar?: string | null;
  email_verified_at?: string | null;
  verified_at?: string | null;
  two_factor_enabled?: boolean;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export type OrderType = 'prescription' | 'list';
export type OrderStatus =
  | 'pending'
  | 'offers_received'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'in_delivery'
  | 'completed'
  | 'cancelled';
export type DeliveryType = 'pickup' | 'delivery';
export type Urgency = 'normal' | 'express';

export interface OrderItem {
  id: number;
  order_id: number;
  medicine_name: string;
  quantity: number;
  dosage?: string | null;
  notes?: string | null;
}

export interface Order {
  id: number;
  client_id: number;
  type: OrderType;
  status: OrderStatus;
  prescription_path?: string | null;
  notes?: string | null;
  zone?: string | null;
  address?: string | null;
  lat?: number | null;
  lng?: number | null;
  accepts_generics: boolean;
  accepts_substitution: boolean;
  accepts_partial: boolean;
  delivery_type: DeliveryType;
  urgency: Urgency;
  chosen_offer_id?: number | null;
  total_amount?: number | null;
  pickup_code?: string | null;
  pickup_confirmed_at?: string | null;
  expires_at?: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  offers?: Offer[];
  chosen_offer?: Offer | null;
}

export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'expired';
export type Availability = 'full' | 'partial' | 'order';

export interface OfferItem {
  id: number;
  offer_id: number;
  order_item_id: number;
  medicine_name: string;
  is_generic: boolean;
  is_substitute: boolean;
  unit_price: number;
  quantity: number;
  available: boolean;
}

export interface Pharmacy {
  id: number;
  user_id: number;
  name: string;
  license_number?: string | null;
  address?: string | null;
  zone?: string | null;
  is_verified: boolean;
  is_active: boolean;
  avg_response_time?: number | null;
  rating: number;
  total_orders: number;
  user?: User;
}

export interface Offer {
  id: number;
  order_id: number;
  pharmacy_id: number;
  status: OfferStatus;
  total_price: number;
  availability: Availability;
  delay_minutes?: number | null;
  delivery_type: DeliveryType;
  delivery_fee: number;
  service_fee: number;
  notes?: string | null;
  reliability_score?: number | null;
  global_score?: number | null;
  expires_at?: string | null;
  created_at: string;
  pharmacy?: Pharmacy;
  items?: OfferItem[];
}

export interface Message {
  id: number;
  order_id: number;
  sender_id: number;
  type: 'logistics' | 'advice';
  content: string;
  is_paid: boolean;
  price?: number | null;
  read_at?: string | null;
  created_at: string;
  sender?: User;
}

export interface Review {
  id: number;
  order_id: number;
  pharmacy_id: number;
  client_id: number;
  rating: number;
  comment?: string | null;
  created_at: string;
}

export interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
