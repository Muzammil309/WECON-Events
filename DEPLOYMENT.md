# WECON Masawat - Deployment Guide

## Vercel Deployment with Supabase

### Prerequisites
1. GitHub account
2. Vercel account (free tier)
3. Supabase account (free tier)

### Step 1: Set up Supabase Database

1. Go to [Supabase](https://supabase.com) and create a new project
2. Choose a project name: `wecon-masawat`
3. Set a strong database password
4. Wait for the project to be created
5. Go to Settings > Database and copy the connection string
6. The connection string format: `postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:5432/postgres`

### Step 2: Deploy to Vercel

1. Push your code to GitHub repository
2. Go to [Vercel](https://vercel.com) and import your GitHub repository
3. Set the project name as `wecon-events` (this will be your subdomain)
4. Configure environment variables in Vercel:

```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:5432/postgres
NEXT_PUBLIC_SITE_NAME=WECON Masawat
JWT_SECRET=your-super-secret-jwt-key-here-change-this
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-admin-password
```

### Step 3: Database Migration

After deployment, you need to set up the database schema:

1. In your Supabase project, go to SQL Editor
2. Run the following commands to create the database schema:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'ORGANIZER', 'SPEAKER', 'ATTENDEE');
CREATE TYPE "EventStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED');
CREATE TYPE "TicketStatus" AS ENUM ('ACTIVE', 'SOLD_OUT', 'CANCELLED');
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED', 'REFUNDED');

-- Create tables (simplified schema for deployment)
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'ATTENDEE',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT,
    "emailUpdates" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "venue" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- Create unique constraints
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");

-- Insert default admin user (password: admin123)
INSERT INTO "User" ("id", "name", "email", "password", "role", "emailVerified") 
VALUES (
    'admin-' || uuid_generate_v4()::text,
    'Admin User',
    'admin@weconmasawat.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'ADMIN',
    true
);
```

### Step 4: Custom Domain (Optional)

1. In Vercel dashboard, go to your project settings
2. Navigate to Domains section
3. Your free Vercel domain will be: `wecon-events.vercel.app`
4. You can add a custom domain if you have one

### Step 5: Verify Deployment

1. Visit your deployed site: `https://wecon-events.vercel.app`
2. Test admin login: admin@weconmasawat.com / admin123
3. Test attendee registration and login
4. Verify both dashboards work correctly

### Environment Variables Reference

```
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
NEXT_PUBLIC_SITE_NAME=WECON Masawat
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-admin-password
```

### Troubleshooting

1. **Build Errors**: Check Vercel build logs for specific errors
2. **Database Connection**: Verify DATABASE_URL is correct
3. **Environment Variables**: Ensure all required variables are set
4. **Prisma Issues**: Check if database schema matches Prisma schema

### Post-Deployment

1. Change default admin password
2. Set up proper JWT secret (32+ characters)
3. Configure email settings if needed
4. Set up monitoring and analytics
