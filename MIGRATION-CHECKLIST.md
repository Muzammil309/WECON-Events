# 🔄 WECON Masawat Migration Checklist

## ✅ **Issue Resolution Summary**

### **Issue 1: Domain Conflict - RESOLVED**
- ❌ **Problem**: `wecon-events.vercel.app` already assigned to another project
- ✅ **Solution**: Use `wecon-masawat.vercel.app` instead
- ✅ **Status**: All documentation updated with new domain

### **Issue 2: Supabase Account Migration - IN PROGRESS**
- ❌ **Problem**: Still connected to old Supabase account
- ✅ **Solution**: Configuration templates created for new account
- 🔄 **Status**: Waiting for your new Supabase project details

---

## 📋 **Step-by-Step Migration Actions**

### **Step 1: Get New Supabase Project Details** ⏳
**You need to do this now:**

1. **Open your NEW Supabase project** (already open in Chrome)
2. **Get Project Reference ID**:
   - Go to Settings > General
   - Copy the "Reference ID" (looks like: `abcdefghijklmnop`)
3. **Get Database Password**:
   - Go to Settings > Database
   - Find "Connection string" section
   - Copy the password
4. **Get API Keys**:
   - Go to Settings > API
   - Copy "anon public" key
   - Copy "service_role" key (keep secret!)

### **Step 2: Update Environment Variables** ⏳
**After getting Supabase details:**

1. **Edit `.env.new-supabase` file** (already created)
2. **Replace these placeholders**:
   - `[YOUR-NEW-SUPABASE-PASSWORD]` → Your actual password
   - `[YOUR-PROJECT-REF]` → Your project reference ID
   - `[YOUR-ANON-KEY]` → Your anon public key
   - `[YOUR-SERVICE-ROLE-KEY]` → Your service role key

### **Step 3: Update Vercel Configuration** ⏳
**Go to Vercel dashboard:**

1. **Environment Variables**: https://vercel.com/dashboard
   - Find your WECON project
   - Go to Settings > Environment Variables
   - Update these variables:
     ```
     DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
     NEXTAUTH_URL=https://wecon-masawat.vercel.app
     NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-REF].supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
     ```

2. **Domain Settings**:
   - Go to Settings > Domains
   - Add domain: `wecon-masawat.vercel.app`
   - Set as primary domain

### **Step 4: Test Database Migration** ⏳
**Run these commands:**

```bash
# Copy environment file
cp .env.new-supabase .env

# Generate Prisma client
npx prisma generate

# Push schema to new database
npx prisma db push

# Verify database
npx prisma studio
```

### **Step 5: Deploy and Test** ⏳
**After Vercel configuration:**

1. **Trigger deployment**: Push to GitHub or redeploy in Vercel
2. **Test new domain**: https://wecon-masawat.vercel.app
3. **Test authentication**: Login with admin/admin123
4. **Test database**: Create/read/update operations

---

## 🚨 **Quick Reference**

### **New Configuration Summary**
- **Domain**: `wecon-masawat.vercel.app` (avoiding conflict)
- **Database**: New Supabase account (free tier)
- **Status**: Ready for your Supabase project details

### **Files Created**
- ✅ `.env.new-supabase` - Environment template
- ✅ `scripts/setup-new-supabase.js` - Setup script
- ✅ `MIGRATION-CHECKLIST.md` - This checklist

### **Next Immediate Action**
🔄 **Get your new Supabase project details and update `.env.new-supabase`**

---

## 📞 **Need Help?**

If you encounter issues:
1. Check the generated `.env.new-supabase` file
2. Verify Supabase project details are correct
3. Test database connection with `npx prisma db pull`
4. Check Vercel deployment logs

**🎉 Once completed, your WECON Masawat platform will be running on the new Supabase account with the new domain!**
