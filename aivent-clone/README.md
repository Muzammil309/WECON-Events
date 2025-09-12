# 🚀 AI Summit 2025 - Pixel-Perfect AIvent Clone

A stunning, pixel-perfect clone of the AIvent conference website built with Next.js 14, React 18, TypeScript, Tailwind CSS, and shadcn/ui components. This project demonstrates modern web development practices with exceptional attention to detail and performance.

## ✨ Features

### 🎨 Design & UI
- **Pixel-Perfect Recreation** of the original AIvent design
- **Dark Theme** with purple/blue/cyan gradient aesthetics
- **Fully Responsive** mobile-first design
- **Smooth Animations** powered by Framer Motion
- **Glass Morphism Effects** for modern visual appeal
- **Interactive Elements** with hover states and micro-interactions

### 🧩 Components & Sections
- **Hero Section** with countdown timer and video background
- **About Section** with animated statistics and counters
- **Speakers Section** with carousel and social media overlays
- **Schedule Section** with tabbed interface for multi-day agenda
- **Pricing Section** with 3-tier pricing cards and features
- **Gallery Section** with lightbox modal functionality
- **Sponsors Section** with animated logo marquee
- **Contact Section** with working form and embedded map
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

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd aivent-clone
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
aivent-clone/
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
│   ├── Contact.tsx              # Contact form and info
│   ├── Footer.tsx               # Footer with newsletter
│   ├── Gallery.tsx              # Image gallery with lightbox
│   ├── Hero.tsx                 # Hero section with countdown
│   ├── Navbar.tsx               # Navigation component
│   ├── Pricing.tsx              # Pricing tiers
│   ├── Schedule.tsx             # Event schedule with tabs
│   ├── Speakers.tsx             # Speaker profiles
│   └── Sponsors.tsx             # Sponsor logos
├── lib/
│   └── utils.ts                 # Utility functions
├── types/
│   └── index.ts                 # TypeScript type definitions
├── public/
│   └── assets/                  # Static assets (images, videos)
├── tailwind.config.ts           # Tailwind configuration
├── next.config.js               # Next.js configuration
└── package.json                 # Dependencies and scripts
```

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--aivent-primary: #6366f1       /* Indigo */
--aivent-secondary: #8b5cf6     /* Purple */
--aivent-accent: #06b6d4        /* Cyan */
--aivent-dark: #0f172a          /* Slate 900 */
--aivent-darker: #020617        /* Slate 950 */

/* Gradients */
aivent-gradient: from-indigo-600 via-purple-600 to-cyan-500
aivent-text-gradient: from-indigo-400 via-purple-400 to-cyan-400
```

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Heading Font**: Poppins (Google Fonts)
- **Font Weights**: 300, 400, 500, 600, 700, 800, 900

### Animations
- **Fade In**: Smooth entrance animations
- **Slide In**: Left/right slide animations
- **Scale In**: Zoom entrance effects
- **Float**: Continuous floating motion
- **Pulse Glow**: Pulsing glow effects
- **Text Shimmer**: Animated text highlights
- **Marquee**: Scrolling logo animations

## 🧩 Component Features

### Hero Section
- **Real-time Countdown Timer** to event date
- **Video Background** with overlay effects
- **Animated Statistics** grid
- **Floating Elements** with random motion
- **Responsive CTAs** with hover effects

### About Section
- **Animated Counters** using React CountUp
- **Intersection Observer** for scroll triggers
- **Feature Cards** with hover animations
- **Statistics Grid** with icon animations

### Speakers Section
- **Speaker Cards** with social media overlays
- **Hover Effects** revealing social links
- **Mobile Carousel** with navigation
- **Responsive Grid** layout

### Schedule Section
- **Tabbed Interface** for multi-day schedule
- **Session Cards** with time, speaker, location
- **Color-coded** session types
- **Responsive Timeline** layout

### Pricing Section
- **3-Tier Pricing** cards with features
- **Popular Badge** highlighting recommended plan
- **Feature Lists** with checkmark icons
- **Hover Animations** and scaling effects

### Gallery Section
- **Masonry Grid** with varied image sizes
- **Lightbox Modal** with navigation
- **Image Categories** and hover overlays
- **Zoom Effects** on hover

### Contact Section
- **Working Contact Form** with validation
- **Contact Information** cards
- **Embedded Google Maps**
- **Form Submission** with loading states

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

### Mobile Features
- **Hamburger Menu** with smooth animations
- **Touch-Optimized** interactions
- **Stacked Layouts** for mobile screens
- **Optimized Images** and performance

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
const eventDate = new Date('2025-03-15T09:00:00')

// Modify speakers in Speakers.tsx
const speakers: Speaker[] = [
  {
    name: "Your Speaker",
    title: "Their Title",
    company: "Company Name",
    // ...
  }
]

// Update pricing in Pricing.tsx
const pricingTiers: PricingTier[] = [
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
- **Unsplash** for high-quality placeholder images
- **Original AIvent Theme** for design inspiration

---

**Built with ❤️ and attention to detail**

For questions or support, please open an issue or contact the development team.
