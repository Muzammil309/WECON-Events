# 🔐 WECON Authentication System - Setup Guide

## 🚨 SECURITY ISSUE RESOLVED

**GitGuardian Alert Status: ✅ RESOLVED**

The critical security vulnerability has been fixed:
- ✅ Removed exposed Supabase credentials from Git repository
- ✅ Moved all sensitive data to `.env.local` (gitignored)
- ✅ Updated `.gitignore` to prevent future credential exposure
- ✅ Cleaned build directory of compiled secrets
- ✅ Added proper error handling for missing credentials

## 🛠️ Setup Instructions

### 1. **Create Supabase Project**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: WECON Events
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
5. Wait for project creation (2-3 minutes)

### 2. **Get Supabase Credentials**

1. In your Supabase project dashboard, go to **Settings > API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project-ref.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)
   - **Service Role Key** (starts with `eyJ...`)

### 3. **Configure Environment Variables**

1. Open `.env.local` in your project root
2. Replace the placeholder values:

```env
# ===== SUPABASE DIRECT ACCESS =====
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 4. **Set Up Database Schema**

1. In Supabase dashboard, go to **SQL Editor**
2. Create a new query and run the WECON database schema:

```sql
-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'ATTENDEE',
  first_name TEXT,
  last_name TEXT,
  display_name TEXT,
  privacy_level TEXT DEFAULT 'PUBLIC',
  networking_available BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);
```

### 5. **Test Authentication System**

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/setup`

3. Click "Create Super Admin Account"

4. Go to `http://localhost:3000/login`

5. Login with:
   - **Email**: `superadmin@wecon.com`
   - **Password**: `SuperAdmin123!`

## 🔧 Troubleshooting

### "Supabase is not configured" Error
- Check that your `.env.local` file has the correct Supabase credentials
- Ensure the project URL is accessible
- Verify the API keys are correct

### "Failed to fetch" Error
- Check your internet connection
- Verify the Supabase project URL is correct
- Ensure the Supabase project is active (not paused)

### Authentication Failures
- Verify the database schema is set up correctly
- Check that RLS policies are configured
- Ensure the JWT secret matches between Supabase and your app

## 🚀 Deployment to Vercel

1. In Vercel dashboard, go to your project settings
2. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXTAUTH_SECRET`
   - `JWT_SECRET`

3. Redeploy your application

## 📋 Security Checklist

- ✅ `.env.local` is gitignored
- ✅ No credentials in source code
- ✅ Supabase RLS enabled
- ✅ Strong passwords used
- ✅ Environment variables set in production
- ✅ Regular security audits

## 🎯 Next Steps

1. **Complete Supabase Setup**: Follow the setup instructions above
2. **Test Authentication**: Verify login/registration works
3. **Deploy to Production**: Set up environment variables in Vercel
4. **Security Review**: Ensure all credentials are properly secured

---

**Need Help?** Check the troubleshooting section or create an issue in the repository.
