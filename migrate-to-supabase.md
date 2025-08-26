# 🔄 WECON Masawat: Neon to Supabase Migration Guide

## 📋 **Migration Overview**

This guide will help you migrate from Neon database to Supabase and update the Vercel domain configuration.

### **Current Setup**
- **Old Database**: Neon (free tier limit reached)
- **Old Domain**: https://wecon-events-five.vercel.app/
- **Current Status**: Prisma Client initialization fixed

### **New Setup**
- **New Database**: Supabase PostgreSQL
- **New Domain**: https://wecon-events.vercel.app/
- **Project URL**: https://supabase.com/dashboard/project/xhkbbctbyyeoucwmdspr

---

## 🔧 **Step 1: Get Supabase Database Password**

1. **Open Supabase Dashboard**: https://supabase.com/dashboard/project/xhkbbctbyyeoucwmdspr/settings/database
2. **Copy Database Password** from the connection string section
3. **Save the password** - you'll need it for the DATABASE_URL

---

## 🔧 **Step 2: Update Vercel Environment Variables**

Go to: https://vercel.com/muzammil309s-projects/wecon-events/settings/environment-variables

**Replace these environment variables:**

```env
# Database Connection (NEW SUPABASE)
DATABASE_URL=postgresql://postgres:[YOUR-SUPABASE-PASSWORD]@db.xhkbbctbyyeoucwmdspr.supabase.co:5432/postgres

# Authentication Secrets
NEXTAUTH_SECRET=d48a7fac2990b9cca4a08ed6457203ee06b2b16f1a396ff47094712b9fa91239
JWT_SECRET=86f164addc398e6da202c8f62fa8155dacdead8cf9fbf7189e5356e1a12a87c8

# Application URLs (UPDATED DOMAIN)
NEXTAUTH_URL=https://wecon-events.vercel.app

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Optional: Supabase Direct Access
NEXT_PUBLIC_SUPABASE_URL=https://xhkbbctbyyeoucwmdspr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[get-from-supabase-dashboard]
```

---

## 🔧 **Step 3: Setup Supabase Database Schema**

### **Option A: Using Prisma Migrations (Recommended)**

1. **Update DATABASE_URL locally** (create `.env` file):
```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xhkbbctbyyeoucwmdspr.supabase.co:5432/postgres
```

2. **Run Prisma commands**:
```bash
# Generate Prisma client
npx prisma generate

# Push schema to new database
npx prisma db push

# Optional: Run migrations if you have them
npx prisma migrate deploy
```

### **Option B: Manual SQL Setup**

Run this SQL in Supabase SQL Editor:

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'ORGANIZER', 'SPEAKER', 'ATTENDEE');

-- Create User table
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

-- Create unique constraints
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Create Event table (add other tables as needed)
-- [Additional tables from your Prisma schema]
```

---

## 🔧 **Step 4: Update Vercel Domain Configuration**

### **Change Project Domain**

1. **Go to Vercel Project Settings**: https://vercel.com/muzammil309s-projects/wecon-events/settings/domains
2. **Remove old domain**: `wecon-events-five.vercel.app` (if present)
3. **Add new domain**: `wecon-events.vercel.app`
4. **Set as primary domain**

### **Update Git Repository (if needed)**

If your Vercel project is connected to the wrong repository:
1. Go to **Settings > Git**
2. Reconnect to: `https://github.com/Muzammil309/WECON-Events`

---

## 🔧 **Step 5: Test Migration**

### **Database Connectivity Test**
```bash
# Test database connection
npx prisma db pull

# Verify schema
npx prisma studio
```

### **Application Testing**
1. **Deploy to Vercel**: Push changes to trigger deployment
2. **Test Homepage**: https://wecon-events.vercel.app
3. **Test Admin Login**: https://wecon-events.vercel.app/login
4. **Test API Routes**: https://wecon-events.vercel.app/api/auth/login
5. **Test Database Operations**: Create/read/update/delete operations

---

## 🚨 **Troubleshooting**

### **Common Issues**

1. **Database Connection Error**
   - Verify DATABASE_URL is correct
   - Check Supabase password
   - Ensure database is accessible

2. **Domain Not Working**
   - Clear browser cache
   - Check Vercel domain settings
   - Verify DNS propagation

3. **Authentication Issues**
   - Update NEXTAUTH_URL to new domain
   - Clear cookies and try again
   - Check JWT_SECRET configuration

### **Rollback Plan**

If migration fails:
1. Revert DATABASE_URL to old Neon connection
2. Revert NEXTAUTH_URL to old domain
3. Redeploy application

---

## ✅ **Migration Checklist**

- [ ] Get Supabase database password
- [ ] Update Vercel environment variables
- [ ] Run Prisma migrations on new database
- [ ] Update Vercel domain configuration
- [ ] Test database connectivity
- [ ] Test application functionality
- [ ] Verify authentication flows
- [ ] Test API endpoints
- [ ] Update documentation references

---

**🎉 Migration Complete!**

Your WECON Masawat platform should now be running on:
- **Database**: Supabase PostgreSQL
- **Domain**: https://wecon-events.vercel.app
- **Status**: Ready for production use
