# WECON Masawat - Event Management Platform

A comprehensive, modern event management web application that combines the best features from Attendize, Indico, Mobilizon, and OSEM into a unified platform.

## 🎯 Project Overview

WECON Masawat is an open-source event management platform designed to handle everything from small meetups to large conferences. It provides a complete solution for event organizers with features for registration, ticketing, agenda management, analytics, and attendee engagement.

## ✨ Features

### 🎫 Registration & Ticketing System
- **Multiple Ticket Tiers**: Early Bird, General, VIP, and Sponsor passes
- **Dynamic Pricing**: Support for different pricing strategies
- **QR Code Generation**: Automatic QR code generation for check-in
- **Real-time Availability**: Live ticket availability tracking
- **Attendee Dashboard**: Personal dashboard for ticket management

### 📅 Agenda & Session Management
- **Multi-track Scheduling**: Support for parallel sessions and tracks
- **Speaker Management**: Comprehensive speaker profiles and bios
- **Session Types**: Keynotes, talks, workshops, panels, and networking
- **Multiple Views**: Grid, list, and timeline agenda views
- **Advanced Filtering**: Filter by day, track, room, or search terms

### 📊 Analytics & Reporting
- **Real-time Dashboards**: Live metrics and KPIs
- **Revenue Tracking**: Detailed financial analytics
- **Attendance Metrics**: Check-in rates and session popularity
- **Export Functionality**: CSV and PDF report generation
- **Visual Charts**: Interactive charts using Chart.js

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Dark Mode Support**: Automatic theme switching
- **Smooth Animations**: Framer Motion for enhanced user experience
- **Accessibility**: WCAG compliant design patterns

## 🛠 Technology Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Styling**: TailwindCSS with custom design system
- **Components**: Custom component library with ShadCN/UI
- **Animations**: Framer Motion + Lottie for hero animations
- **Charts**: Chart.js for data visualization
- **Icons**: Lucide React icon library

### Backend
- **Runtime**: Node.js with Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based auth with bcrypt
- **File Storage**: Local storage with plans for S3 integration
- **API**: RESTful endpoints with comprehensive error handling

### Development Tools
- **Language**: TypeScript for type safety
- **Linting**: ESLint with Next.js configuration
- **Package Manager**: npm with lockfile management
- **Build Tool**: Next.js with Turbopack for fast development

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wecon-masawat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Configure the following variables:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/wecon_masawat"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   JWT_SECRET="your-jwt-secret"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
wecon-masawat/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (pages)/           # Main application pages
│   │   ├── api/               # API routes
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Base UI components
│   │   └── features/         # Feature-specific components
│   ├── data/                 # Mock data and constants
│   ├── lib/                  # Utility functions and configurations
│   └── types/                # TypeScript type definitions
├── prisma/                   # Database schema and migrations
├── public/                   # Static assets
└── docs/                     # Documentation
```

## 🔧 API Endpoints

### Tickets
- `GET /api/tickets` - Get all ticket types for an event
- `POST /api/tickets` - Create a new ticket type
- `PUT /api/tickets` - Update a ticket type
- `DELETE /api/tickets` - Delete a ticket type
- `POST /api/tickets/purchase` - Purchase tickets

### Agenda
- `GET /api/agenda` - Get event sessions with filtering
- `POST /api/agenda` - Create a new session
- `PUT /api/agenda` - Update a session
- `DELETE /api/agenda` - Delete a session

### Analytics
- `GET /api/analytics` - Get event analytics data
- `POST /api/analytics/export` - Export analytics data

### Authentication
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - User logout

## 🎨 Design System

### Colors
- **Primary**: #1E40AF (blue)
- **Accent**: #FACC15 (yellow)
- **Dark**: #111827 (charcoal)
- **Light**: #F9FAFB (off-white)

### Typography
- **Headings**: Inter font family with various weights
- **Body**: System font stack for optimal performance
- **Code**: Monospace for technical content

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e
```

## 📦 Deployment

### Vercel (Recommended for Frontend)
1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Docker
```bash
# Build the container
docker build -t wecon-masawat .

# Run the container
docker run -p 3000:3000 wecon-masawat
```

### Manual Deployment
```bash
# Build the application
npm run build

# Start the production server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Attendize, Indico, Mobilizon, and OSEM
- Built with modern web technologies and best practices
- Community-driven development approach

## 📞 Support

For support, email support@weconmasawat.com or join our community Discord.

---

**WECON Masawat** - Building the future of event management, one event at a time.
