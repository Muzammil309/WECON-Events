export interface Speaker {
  id: string
  name: string
  title: string
  company: string
  bio: string
  image: string
  social: {
    twitter?: string
    linkedin?: string
    website?: string
  }
}

export interface ScheduleItem {
  id: string
  time: string
  title: string
  description: string
  speaker?: Speaker
  type: 'keynote' | 'workshop' | 'panel' | 'break' | 'networking'
  duration: number
  location: string
}

export interface PricingTier {
  id: string
  name: string
  price: number
  originalPrice?: number
  features: string[]
  popular?: boolean
  description: string
  buttonText: string
}

export interface GalleryImage {
  id: string
  src: string
  alt: string
  category: string
  width: number
  height: number
}

export interface Sponsor {
  id: string
  name: string
  logo: string
  tier: 'platinum' | 'gold' | 'silver' | 'bronze'
  website: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
}

export interface ContactInfo {
  email: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  social: {
    twitter: string
    facebook: string
    linkedin: string
    instagram: string
  }
}

export interface EventInfo {
  name: string
  tagline: string
  description: string
  date: {
    start: Date
    end: Date
  }
  location: {
    venue: string
    address: string
    city: string
    state: string
    country: string
  }
  stats: {
    attendees: number
    speakers: number
    sessions: number
    days: number
  }
}

export interface NewsletterSubscription {
  email: string
  name?: string
  interests?: string[]
}

export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
  company?: string
  phone?: string
}

export interface NavigationItem {
  label: string
  href: string
  children?: NavigationItem[]
}

export interface SocialLink {
  platform: string
  url: string
  icon: string
}

export interface Testimonial {
  id: string
  name: string
  title: string
  company: string
  content: string
  image: string
  rating: number
}

export interface CountdownTimer {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export interface AnimationConfig {
  duration: number
  delay?: number
  easing?: string
  repeat?: boolean
}

export interface VideoConfig {
  src: string
  poster?: string
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  controls?: boolean
}

export interface CarouselConfig {
  autoplay?: boolean
  interval?: number
  showDots?: boolean
  showArrows?: boolean
  infinite?: boolean
}

export interface ModalConfig {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export interface ToastConfig {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

export interface LoadingState {
  isLoading: boolean
  message?: string
  progress?: number
}

export interface ErrorState {
  hasError: boolean
  message?: string
  code?: string
}

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
