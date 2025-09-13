// Base Types
export interface BaseEntity {
  id: string
  createdAt: Date
  updatedAt: Date
}

// Speaker Types
export interface Speaker extends BaseEntity {
  name: string
  title: string
  company: string
  bio: string
  image: string
  social: {
    twitter?: string
    linkedin?: string
    website?: string
    github?: string
  }
  featured: boolean
  sessions: string[]
}

// Schedule Types
export interface ScheduleSession {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  duration: number // in minutes
  type: 'keynote' | 'workshop' | 'panel' | 'break' | 'networking' | 'presentation'
  speakers: string[] // Speaker IDs
  location: string
  capacity?: number
  tags: string[]
  level: 'beginner' | 'intermediate' | 'advanced' | 'all'
}

export interface ScheduleDay {
  date: string
  dayName: string
  sessions: ScheduleSession[]
}

export interface Schedule {
  days: ScheduleDay[]
  timezone: string
}

// Pricing Types
export interface PricingFeature {
  name: string
  included: boolean
  description?: string
}

export interface PricingTier {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  currency: string
  period: string
  features: PricingFeature[]
  popular: boolean
  available: boolean
  maxQuantity?: number
  earlyBird?: {
    price: number
    deadline: Date
  }
  cta: string
  benefits: string[]
}

// Gallery Types
export interface GalleryImage {
  id: string
  src: string
  alt: string
  title?: string
  description?: string
  category: 'conference' | 'networking' | 'workshops' | 'venue' | 'speakers'
  year?: number
  photographer?: string
  width: number
  height: number
}

export interface GalleryCategory {
  id: string
  name: string
  description: string
  images: GalleryImage[]
}

// Sponsor Types
export interface Sponsor {
  id: string
  name: string
  logo: string
  website: string
  description: string
  tier: 'platinum' | 'gold' | 'silver' | 'bronze' | 'partner'
  featured: boolean
  benefits: string[]
}

// Contact Types
export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
  company?: string
  phone?: string
  type: 'general' | 'sponsorship' | 'speaking' | 'media' | 'partnership'
}

export interface ContactInfo {
  email: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  socialMedia: {
    twitter?: string
    linkedin?: string
    facebook?: string
    instagram?: string
    youtube?: string
  }
}

// Venue Types
export interface VenueLocation {
  name: string
  address: string
  city: string
  state: string
  country: string
  zipCode: string
  coordinates: {
    lat: number
    lng: number
  }
  description: string
  capacity: number
  amenities: string[]
  images: string[]
  transportation: {
    parking: boolean
    publicTransport: string[]
    accessibility: string[]
  }
}

// FAQ Types
export interface FAQ {
  id: string
  question: string
  answer: string
  category: 'general' | 'tickets' | 'venue' | 'speakers' | 'schedule' | 'accommodation'
  order: number
}

// Newsletter Types
export interface NewsletterSubscription {
  email: string
  preferences: {
    updates: boolean
    speakers: boolean
    schedule: boolean
    sponsors: boolean
  }
  subscribeDate: Date
}

// Event Types
export interface EventInfo {
  name: string
  tagline: string
  description: string
  startDate: Date
  endDate: Date
  venue: VenueLocation
  capacity: number
  registrationOpen: boolean
  registrationDeadline: Date
  earlyBirdDeadline: Date
  theme: string
  year: number
  edition: number
}

// Statistics Types
export interface EventStats {
  attendees: number
  speakers: number
  sessions: number
  countries: number
  companies: number
  sponsors: number
  years: number
}

// Animation Types
export interface AnimationConfig {
  duration: number
  delay: number
  easing: string
  direction: 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale'
}

// Modal Types
export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
}

// Form Types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio'
  required: boolean
  placeholder?: string
  options?: { value: string; label: string }[]
  validation?: {
    pattern?: string
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
  }
}

export interface FormState {
  values: Record<string, any>
  errors: Record<string, string>
  touched: Record<string, boolean>
  isSubmitting: boolean
  isValid: boolean
}

// API Response Types
export interface APIResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  timestamp: string
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Component Props Types
export interface ComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface SectionProps extends ComponentProps {
  id?: string
  background?: 'primary' | 'secondary' | 'tertiary' | 'transparent'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

// Navigation Types
export interface NavItem {
  label: string
  href: string
  external?: boolean
  children?: NavItem[]
}

export interface NavigationConfig {
  items: NavItem[]
  cta?: {
    label: string
    href: string
    variant: 'primary' | 'secondary'
  }
}

// Theme Types
export interface ThemeConfig {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
  }
  fonts: {
    sans: string[]
    serif: string[]
    mono: string[]
  }
  spacing: Record<string, string>
  borderRadius: Record<string, string>
}

// Countdown Timer Types
export interface CountdownTime {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
}

// Social Media Types
export interface SocialLink {
  platform: 'twitter' | 'linkedin' | 'facebook' | 'instagram' | 'youtube' | 'github' | 'website'
  url: string
  label: string
  icon: string
}
