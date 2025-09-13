# 🚀 AIvent Official - Pixel-Perfect AI Summit Website

A stunning, pixel-perfect implementation of the official AIvent Demo 1 template built with Next.js 14, React 18, TypeScript, Tailwind CSS, and shadcn/ui components. This project demonstrates modern web development practices with exceptional attention to detail and performance.

## ✨ Features

### 🎨 Design & UI
- **Pixel-Perfect Recreation** of the official AIvent Demo 1 template
- **Official Color Scheme** (#764DF0 primary, #442490 secondary)
- **Dark Theme** with purple/blue gradient aesthetics
- **Fully Responsive** mobile-first design
- **Smooth Animations** powered by Framer Motion
- **Glass Morphism Effects** for modern visual appeal
- **Interactive Elements** with hover states and micro-interactions

### 🧩 Components & Sections
- **Hero Section** with video background and countdown timer
- **About Section** with rotating image and animated statistics
- **Marquee Section** with scrolling text animations
- **Why Attend Section** with feature cards and hover effects
- **Quote Section** with testimonial and profile image
- **Speakers Section** (placeholder for speaker profiles)
- **Schedule Section** (placeholder for event agenda)
- **Tickets Section** (placeholder for pricing tiers)
- **Contact Section** with form and event information
- **Footer** with newsletter signup and links
- **Responsive Navigation** with smooth scroll and mobile menu

### 🛠 Technical Stack
- **Next.js 14** with App Router and TypeScript
- **React 18** with functional components and hooks
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for consistent, accessible components
- **Framer Motion** for smooth animations and transitions
- **Lucide React** for beautiful, consistent icons
- **React Intersection Observer** for scroll-triggered animations
- **Official AIvent Assets** integrated from template

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Navigate to the project directory**
```bash
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
│   ├── globals.css              # Global styles with official AIvent design system
│   ├── layout.tsx               # Root layout with metadata and fonts
│   └── page.tsx                 # Main page component
├── components/
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   └── tabs.tsx
│   ├── About.tsx                # About section with rotating image
│   ├── Contact.tsx              # Contact form and information
│   ├── Footer.tsx               # Footer with newsletter signup
│   ├── Hero.tsx                 # Hero section with video background
│   ├── MarqueeSection.tsx       # Scrolling text animations
│   ├── Navbar.tsx               # Navigation component
│   ├── News.tsx                 # News section placeholder
│   ├── Quote.tsx                # Testimonial quote section
│   ├── Schedule.tsx             # Event schedule placeholder
│   ├── ScrollToTop.tsx          # Scroll to top button
│   ├── Speakers.tsx             # Speaker profiles placeholder
│   ├── Sponsors.tsx             # Sponsor logos placeholder
│   ├── Tickets.tsx              # Pricing tiers placeholder
│   └── WhyAttend.tsx            # Feature cards with hover effects
├── lib/
│   └── utils.ts                 # Utility functions
├── types/
│   └── index.ts                 # TypeScript type definitions
├── public/
│   └── assets/                  # Official AIvent assets
│       ├── images/              # All original images from template
│       ├── videos/              # Video backgrounds
│       └── css/                 # Original CSS files for reference
├── tailwind.config.ts           # Tailwind configuration with official colors
├── next.config.js               # Next.js configuration
└── package.json                 # Dependencies and scripts
```

## 🎨 Design System

### Official AIvent Colors
```css
/* Primary Colors from scheme-01.css */
--primary-color: #764DF0       /* Main purple */
--secondary-color: #442490     /* Darker purple */
```

### Typography
- **Primary Font**: Manrope (Google Fonts)
- **Font Weights**: 200, 300, 400, 500, 600, 700, 800

### Key Components
- **Hero Section**: Video background with countdown timer
- **About Section**: Rotating image with animated content
- **Marquee Section**: Scrolling text with rotation effects
- **Why Attend**: Feature cards with hover animations
- **Quote Section**: Testimonial with profile image

## 🧩 Component Features

### Hero Section
- **Video Background** with poster fallback
- **Real-time Countdown Timer** to October 1, 2025
- **Animated Statistics** and floating elements
- **Responsive CTAs** with smooth scroll navigation
- **Bottom info card** with event details

### About Section
- **Rotating Image** with continuous animation
- **Animated Content** with staggered reveals
- **Checklist Items** with checkmark icons
- **Floating Elements** for visual interest

### Marquee Section
- **Dual Marquee Rows** with opposite directions
- **Rotation Effects** matching original template
- **Smooth Animations** with proper timing

### Why Attend Section
- **6 Feature Cards** with hover effects
- **Image Overlays** with gradient transitions
- **Scale Animations** on hover
- **Staggered Reveals** for smooth loading

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

### Mobile Features
- **Hamburger Menu** with slide-out navigation
- **Touch-Optimized** interactions
- **Stacked Layouts** for mobile screens
- **Optimized Performance** for mobile devices

## 🎭 Animations & Effects

### Framer Motion Features
- **Page Transitions** with staggered children
- **Scroll-Triggered** animations using Intersection Observer
- **Hover States** with scale and movement effects
- **Loading States** with smooth reveals
- **Custom Variants** for reusable animations

### CSS Effects
- **Glass Morphism** with backdrop blur
- **Gradient Backgrounds** and text effects
- **Rotating Elements** with CSS animations
- **Smooth Scrolling** behavior
- **Custom Scrollbar** styling

## 🔧 Customization

### Content Updates
```typescript
// Update event details in Hero.tsx
const EVENT_DATE = new Date('2025-10-01T09:00:00-07:00')

// Modify features in WhyAttend.tsx
const features = [
  {
    title: "Your Feature",
    description: "Feature description",
    image: "/assets/images/misc/your-image.webp"
  }
]
```

### Styling Changes
```css
/* Update colors in tailwind.config.ts */
colors: {
  primary: {
    DEFAULT: '#764DF0', // Official AIvent primary
    // ... other shades
  }
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
- **Asset Optimization** with proper sizing

### Expected Lighthouse Scores
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 100
- **SEO**: 100

## 🎯 Official Assets

This implementation uses the official AIvent Demo 1 template assets:
- **High-resolution images** from `/assets/images/`
- **Video backgrounds** from `/assets/videos/`
- **Logo files** and branding assets
- **Original color schemes** from scheme-01.css
- **Typography** matching official template

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
