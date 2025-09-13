// Speaker interface
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
  featured?: boolean
}

// Schedule/Agenda interface
export interface ScheduleItem {
  id: string
  title: string
  description: string
  speaker?: Speaker
  speakers?: Speaker[]
  startTime: string
  endTime: string
  duration: number
  type: 'keynote' | 'workshop' | 'panel' | 'break' | 'networking'
  location: string
  day: number
}

// Pricing tier interface
export interface PricingTier {
  id: string
  name: string
  price: number
  originalPrice?: number
  currency: string
  period: string
  description: string
  features: string[]
  popular?: boolean
  buttonText: string
  buttonVariant: 'primary' | 'secondary' | 'outline'
}

// FAQ interface
export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

// Gallery image interface
export interface GalleryImage {
  id: string
  src: string
  alt: string
  caption?: string
  category?: string
}

// Sponsor interface
export interface Sponsor {
  id: string
  name: string
  logo: string
  website: string
  tier: 'platinum' | 'gold' | 'silver' | 'bronze'
  description?: string
}

// News/Blog post interface
export interface NewsPost {
  id: string
  title: string
  excerpt: string
  content: string
  image: string
  author: string
  publishedAt: string
  category: string
  tags: string[]
  slug: string
}

// Contact form interface
export interface ContactForm {
  name: string
  email: string
  subject?: string
  message: string
  company?: string
  phone?: string
}

// Newsletter subscription interface
export interface NewsletterSubscription {
  email: string
  name?: string
  interests?: string[]
}

// Event details interface
export interface EventDetails {
  name: string
  tagline: string
  description: string
  startDate: string
  endDate: string
  location: {
    venue: string
    address: string
    city: string
    country: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  capacity: number
  website: string
  social: {
    twitter?: string
    linkedin?: string
    facebook?: string
    instagram?: string
    youtube?: string
  }
}

// Statistics interface
export interface Statistic {
  id: string
  label: string
  value: number
  suffix?: string
  prefix?: string
  description?: string
  icon?: string
}

// Feature interface
export interface Feature {
  id: string
  title: string
  description: string
  icon: string
  image?: string
}

// Testimonial interface
export interface Testimonial {
  id: string
  content: string
  author: {
    name: string
    title: string
    company: string
    image: string
  }
  rating?: number
}

// Navigation menu item interface
export interface MenuItem {
  id: string
  label: string
  href: string
  children?: MenuItem[]
  external?: boolean
}

// Animation configuration interface
export interface AnimationConfig {
  duration: number
  delay?: number
  easing?: string
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade'
}

// Modal configuration interface
export interface ModalConfig {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
}

// API response interface
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  code?: number
}

// Form validation interface
export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
}

export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio'
  placeholder?: string
  options?: { label: string; value: string }[]
  validation?: ValidationRule
  defaultValue?: any
}

// Theme configuration interface
export interface ThemeConfig {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
  }
  fonts: {
    heading: string
    body: string
  }
  spacing: {
    section: string
    container: string
  }
}

// SEO metadata interface
export interface SEOMetadata {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: string
  siteName?: string
  locale?: string
}

// Component props interfaces
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
  id?: string
}

export interface SectionProps extends BaseComponentProps {
  background?: 'light' | 'dark' | 'gradient'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  container?: boolean
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  href?: string
  external?: boolean
}

export interface CardProps extends BaseComponentProps {
  title?: string
  description?: string
  image?: string
  href?: string
  hover?: boolean
  gradient?: boolean
}

// Countdown timer interface
export interface CountdownTime {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
}

// Device type
export type DeviceType = 'mobile' | 'tablet' | 'desktop'

// Animation direction
export type AnimationDirection = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade'

// Button variants
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link'

// Section backgrounds
export type SectionBackground = 'light' | 'dark' | 'gradient'

// Component sizes
export type ComponentSize = 'sm' | 'md' | 'lg' | 'xl'
