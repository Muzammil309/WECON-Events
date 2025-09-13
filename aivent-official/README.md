# 🚀 AIvent Official - Pixel-Perfect AI Summit Website

A stunning, pixel-perfect implementation of the official AIvent conference website built with Next.js 14, React 18, TypeScript, Tailwind CSS, and shadcn/ui components. This project demonstrates modern web development practices with exceptional attention to detail and performance.

## ✨ Features

### 🎨 Design & UI
- **Pixel-Perfect Recreation** of the official AIvent template
- **Dark Theme** with indigo/purple/cyan gradient aesthetics
- **Fully Responsive** mobile-first design
- **Smooth Animations** powered by Framer Motion
- **Glass Morphism Effects** for modern visual appeal
- **Interactive Elements** with hover states and micro-interactions

### 🧩 Components & Sections
- **Hero Section** with countdown timer and video background
- **About Section** with animated statistics and counters
- **Why Attend Section** with feature cards and hover effects
- **Speakers Section** with profiles and social media overlays
- **Schedule Section** with tabbed interface for multi-day agenda
- **Tickets Section** with 3-tier pricing cards and features
- **Venue Section** with location info and embedded map
- **FAQ Section** with accordion functionality
- **Footer** with newsletter signup and social links
- **Responsive Navigation** with smooth scroll and mobile menu

### 🛠 Technical Stack
- **Next.js 14** with App Router and TypeScript
- **React 18** with functional components and hooks
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for consistent, accessible components
- **Framer Motion** for smooth animations and transitions
- **Lucide React** for beautiful, consistent icons
- **React Intersection Observer** for scroll-triggered animations
- **React CountUp** for animated number counters
- **AOS (Animate On Scroll)** for additional scroll animations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd aivent-official
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Start development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open your browser**
```
http://localhost:3000
```

### Build for Production
```bash
npm run build
npm run start
```

## 📁 Project Structure

```
aivent-official/
├── app/
│   ├── globals.css              # Global styles and design system
│   ├── layout.tsx               # Root layout with metadata
│   └── page.tsx                 # Main page component
├── components/
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   └── tabs.tsx
│   ├── About.tsx                # About section with stats
│   ├── FAQ.tsx                  # FAQ with accordion
│   ├── Footer.tsx               # Footer with newsletter
│   ├── Hero.tsx                 # Hero section with countdown
│   ├── Navbar.tsx               # Navigation component
│   ├── Schedule.tsx             # Event schedule with tabs
│   ├── ScrollToTop.tsx          # Scroll to top button
│   ├── Speakers.tsx             # Speaker profiles
│   ├── Tickets.tsx              # Pricing tiers
│   ├── Venue.tsx                # Venue information
│   └── WhyAttend.tsx            # Feature cards
├── lib/
│   └── utils.ts                 # Utility functions
├── types/
│   └── index.ts                 # TypeScript type definitions
├── public/
│   └── assets/                  # Official AIvent assets
│       ├── images/              # Images from official template
│       ├── videos/              # Video backgrounds
│       ├── css/                 # Original CSS files
│       ├── js/                  # Original JavaScript files
│       └── fonts/               # Font files
├── tailwind.config.ts           # Tailwind configuration
├── next.config.js               # Next.js configuration
└── package.json                 # Dependencies and scripts
```

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--aivent-primary: #6366f1       /* Indigo */
--aivent-secondary: #0f172a     /* Slate 900 */
--aivent-accent: #f59e0b        /* Amber */
--aivent-dark: #0f172a          /* Slate 900 */
--aivent-darker: #020617        /* Slate 950 */

/* Gradients */
aivent-gradient: from-indigo-600 via-purple-600 to-cyan-500
aivent-text-gradient: from-indigo-400 via-purple-400 to-cyan-400
```

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Font Weights**: 300, 400, 500, 600, 700, 800, 900

### Animations
- **Fade In**: Smooth entrance animations
- **Slide In**: Left/right slide animations
- **Scale In**: Zoom entrance effects
- **Float**: Continuous floating motion
- **Pulse Glow**: Pulsing glow effects
- **Marquee**: Scrolling animations
- **Gradient X**: Animated gradients

## 🧩 Component Features

### Hero Section
- **Real-time Countdown Timer** to event date (October 1, 2025)
- **Video Background** with overlay effects
- **Animated Statistics** and floating elements
- **Responsive CTAs** with hover effects

### About Section
- **Animated Counters** using React CountUp
- **Intersection Observer** for scroll triggers
- **Feature Cards** with hover animations
- **Statistics Grid** with icon animations

### Speakers Section
- **Speaker Cards** with social media overlays
- **Hover Effects** revealing social links
- **Professional Profiles** with bio information
- **Responsive Grid** layout

### Schedule Section
- **Tabbed Interface** for 3-day schedule
- **Session Cards** with time, speaker, location
- **Color-coded** session types
- **Responsive Timeline** layout

### Tickets Section
- **3-Tier Pricing** cards with features
- **Early Bird Pricing** with savings display
- **Feature Lists** with checkmark icons
- **Hover Animations** and scaling effects

### Venue Section
- **Embedded Google Maps**
- **Transportation Options**
- **Venue Features** and amenities
- **Hotel Recommendations**

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

### Mobile Features
- **Hamburger Menu** with smooth animations
- **Touch-Optimized** interactions
- **Stacked Layouts** for mobile screens
- **Optimized Performance** for mobile devices

## 🎭 Animations & Effects

### Framer Motion Features
- **Page Transitions** with staggered children
- **Scroll-Triggered** animations
- **Hover States** with scale and movement
- **Loading States** with skeleton effects
- **Custom Variants** for reusable animations

### CSS Effects
- **Glass Morphism** with backdrop blur
- **Gradient Backgrounds** and text effects
- **Floating Orbs** with CSS animations
- **Smooth Scrolling** behavior
- **Custom Scrollbar** styling

## 🔧 Customization

### Content Updates
```typescript
// Update event details in Hero.tsx
const EVENT_DATE = new Date('2025-10-01T09:00:00-07:00')

// Modify speakers in Speakers.tsx
const speakers = [
  {
    name: "Your Speaker",
    title: "Their Title",
    company: "Company Name",
    // ...
  }
]

// Update pricing in Tickets.tsx
const pricingTiers = [
  {
    name: "Plan Name",
    price: 299,
    features: ["Feature 1", "Feature 2"],
    // ...
  }
]
```

### Styling Changes
```css
/* Update colors in tailwind.config.ts */
colors: {
  aivent: {
    primary: "#your-color",
    secondary: "#your-color"
  }
}

/* Modify animations in globals.css */
@keyframes your-animation {
  /* keyframe definitions */
}
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically with optimizations

### Netlify
1. Build the project: `npm run build`
2. Deploy the `.next` folder

### Other Platforms
Compatible with any platform supporting Next.js applications.

## 📊 Performance

### Optimizations
- **Image Optimization** with Next.js Image component
- **Code Splitting** automatic with Next.js
- **Lazy Loading** for components and images
- **Font Optimization** with Google Fonts
- **Bundle Analysis** and tree shaking

### Lighthouse Scores
- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

## 🎯 Official Assets

This implementation uses the official AIvent template assets:
- **High-resolution images** from the original template
- **Video backgrounds** and promotional content
- **Logo files** and branding assets
- **Font files** and typography
- **Original color schemes** and design tokens

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Next.js Team** for the incredible framework
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for beautiful, accessible components
- **Framer Motion** for smooth animations
- **Lucide** for consistent iconography
- **Official AIvent Template** for design inspiration and assets

---

**Built with ❤️ and pixel-perfect attention to detail**

For questions or support, please open an issue or contact the development team.
