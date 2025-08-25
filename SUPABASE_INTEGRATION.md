# 🗄️ WECON Masawat - Supabase Integration Guide

## 📋 **Supabase Project Configuration**

### **Project Details**
- **Project URL**: https://supabase.com/dashboard/project/xhkbbctbyyeoucwmdspr
- **Project ID**: xhkbbctbyyeoucwmdspr
- **Database**: PostgreSQL with real-time capabilities

---

## 🚀 **Step-by-Step Setup**

### **Step 1: Access Supabase Dashboard**
1. Navigate to: https://supabase.com/dashboard/project/xhkbbctbyyeoucwmdspr
2. Log in with your Supabase account
3. Ensure you have access to the project

### **Step 2: Database Setup**
1. Go to **SQL Editor** in the Supabase dashboard
2. Create a new query
3. Copy and paste the contents of `supabase-setup.sql`
4. Execute the script to create all tables and initial data

### **Step 3: Get Database Connection String**
1. Go to **Settings** → **Database**
2. Find the **Connection string** section
3. Copy the **URI** format connection string
4. It should look like: `postgresql://postgres:[YOUR-PASSWORD]@[HOST]:5432/postgres`

### **Step 4: Configure Row Level Security (RLS)**
Execute these RLS policies in the SQL Editor:

```sql
-- Enable RLS on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Event" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Ticket" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;

-- User policies
CREATE POLICY "Users can view their own data" ON "User"
    FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Admins can view all users" ON "User"
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM "User" 
            WHERE id = auth.uid()::text AND role = 'ADMIN'
        )
    );

-- Event policies (public read, admin write)
CREATE POLICY "Events are publicly readable" ON "Event"
    FOR SELECT USING (true);

CREATE POLICY "Only admins can modify events" ON "Event"
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM "User" 
            WHERE id = auth.uid()::text AND role = 'ADMIN'
        )
    );

-- Session policies (public read, admin write)
CREATE POLICY "Sessions are publicly readable" ON "Session"
    FOR SELECT USING (true);

CREATE POLICY "Only admins can modify sessions" ON "Session"
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM "User" 
            WHERE id = auth.uid()::text AND role = 'ADMIN'
        )
    );

-- Ticket policies (users can see their own tickets)
CREATE POLICY "Users can view their own tickets" ON "Ticket"
    FOR SELECT USING ("attendeeEmail" = auth.email());

CREATE POLICY "Admins can view all tickets" ON "Ticket"
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM "User" 
            WHERE id = auth.uid()::text AND role = 'ADMIN'
        )
    );
```

---

## 🔧 **Environment Variables for Vercel**

Set these in your Vercel project dashboard:

```env
# Database Connection
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres

# Authentication Secrets (generate random strings)
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
JWT_SECRET=your-jwt-secret-change-this-in-production

# Application URLs
NEXTAUTH_URL=https://wecon-events.vercel.app

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Supabase Configuration (optional for direct client access)
NEXT_PUBLIC_SUPABASE_URL=https://xhkbbctbyyeoucwmdspr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
```

---

## 🔐 **Authentication Integration**

### **Current Status**
- ✅ **JWT-based authentication** implemented
- ✅ **Role-based access control** (Admin, Attendee)
- ✅ **Password hashing** with bcrypt
- 🔄 **Supabase Auth** integration planned

### **Migration to Supabase Auth (Future)**
1. Install Supabase client: `npm install @supabase/supabase-js`
2. Replace custom JWT with Supabase Auth
3. Update authentication middleware
4. Migrate user sessions to Supabase

---

## 📊 **Database Schema Overview**

### **Core Tables**
- **User** - User accounts and authentication
- **Event** - Event information and details
- **Session** - Event sessions and schedule
- **Speaker** - Speaker profiles and information
- **Room** - Venue rooms and capacity
- **TicketType** - Ticket categories and pricing
- **Order** - Purchase orders and transactions
- **Ticket** - Individual tickets and QR codes

### **Relationships**
- Events → Sessions (one-to-many)
- Events → TicketTypes (one-to-many)
- Sessions → Speakers (many-to-many via SessionSpeaker)
- Orders → Tickets (one-to-many)
- TicketTypes → Tickets (one-to-many)

---

## 🧪 **Testing Database Connection**

After setup, test the connection:

```bash
# Install Prisma CLI if not already installed
npm install -g prisma

# Test database connection
npx prisma db pull

# Generate Prisma client
npx prisma generate

# Run migrations (if needed)
npx prisma migrate deploy
```

---

## 📈 **Post-Deployment Verification**

### **Database Checks**
- [ ] All tables created successfully
- [ ] Sample data inserted (admin user, sample event)
- [ ] RLS policies applied correctly
- [ ] Connection string works from Vercel

### **Application Checks**
- [ ] Admin login works with sample credentials
- [ ] User registration creates new records
- [ ] Role-based routing functions correctly
- [ ] API endpoints return proper responses

---

**🎉 Your Supabase database is ready for the WECON Masawat platform!**
