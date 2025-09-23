# WECON Event Management Platform - Critical Issues Resolution Guide

## 🎯 **OVERVIEW**

This guide provides step-by-step instructions to resolve the three critical issues with your WECON event management platform:

1. **User Registration RLS Policy Violations** ❌
2. **Email Verification Redirect Issues** ❌  
3. **Admin Dashboard CRUD Functionality** ❌

---

## 🔧 **ISSUE 1: USER REGISTRATION RLS POLICY VIOLATIONS**

### **Problem:**
Users getting "new row violates row-level security policy for table 'users'" when creating attendee/speaker accounts.

### **Solution:**
Execute the RLS policy fix in Supabase SQL Editor.

### **Steps:**
1. **Go to your Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your project: `xhkbbctbyyeoucwmdspr`

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Execute the RLS Fix**
   - Copy the entire contents of: `database/fix_user_registration_rls.sql`
   - Paste into the SQL Editor
   - Click "Run" to execute

4. **Verify the Fix**
   - The script will show "RLS policies applied successfully" when complete
   - Test user registration at: https://wecon-masawat.vercel.app/register

### **Expected Result:**
✅ User registration works without RLS policy violations
✅ Attendees and speakers can create accounts successfully

---

## 📧 **ISSUE 2: EMAIL VERIFICATION REDIRECT ISSUES**

### **Problem:**
Email verification redirecting to localhost:3000 instead of production URL.

### **Solution:**
Update Supabase authentication configuration manually.

### **Steps:**
1. **Go to Supabase Dashboard**
   - Navigate to: Authentication > Settings

2. **Update Email Settings**
   - Go to **Email** tab
   - Set **Enable email confirmations**: `DISABLED`
   - Set **Enable email change confirmations**: `DISABLED`
   - Set **Enable secure email change**: `DISABLED`

3. **Update Site URL Settings**
   - Go to **Site URL** tab
   - Set **Site URL**: `https://wecon-masawat.vercel.app`
   - Set **Redirect URLs**: `https://wecon-masawat.vercel.app/**`

4. **Update General Settings**
   - Go to **General** tab
   - Set **Enable signup**: `ENABLED`
   - Set **Enable manual linking**: `ENABLED`

### **Expected Result:**
✅ Email verification disabled for immediate login
✅ All redirects use production URL
✅ No localhost:3000 references

---

## 🎛️ **ISSUE 3: ADMIN DASHBOARD CRUD FUNCTIONALITY**

### **Problem:**
Admin dashboard tabs showing schema errors and missing CRUD operations.

### **Solution:**
Execute database schema fixes and verify functionality.

### **Steps:**
1. **Execute Schema Fix**
   - Go to Supabase SQL Editor
   - Copy contents of: `database/fix_admin_dashboard_schema.sql`
   - Paste and execute in SQL Editor

2. **Verify Schema Updates**
   - The script will show "Schema fixes completed successfully"
   - Check that all tables are properly structured

3. **Test Admin Dashboard**
   - Login to: https://wecon-masawat.vercel.app/admin
   - Test each tab:
     - ✅ **Real-Time Analytics**: Should show live data
     - ✅ **Event Management**: Create/edit/delete events
     - ✅ **Ticketing System**: Manage ticket tiers
     - ✅ **Content Management**: Session management
     - ✅ **Attendee Management**: User management

### **Expected Result:**
✅ All admin dashboard tabs fully functional
✅ Complete CRUD operations working
✅ Real database integration active
✅ No schema mismatch errors

---

## 🧪 **TESTING & VERIFICATION**

### **Test Scripts Available:**
- `scripts/test-admin-dashboard.js` - Tests all CRUD operations
- `scripts/fix-rls-policies.js` - Analyzes RLS policy issues
- `scripts/fix-email-verification.js` - Checks email configuration

### **Manual Testing Checklist:**

#### **User Registration Flow:**
- [ ] Go to `/register`
- [ ] Create attendee account
- [ ] Create speaker account  
- [ ] Verify immediate login (no email confirmation)

#### **Admin Dashboard Flow:**
- [ ] Login as super admin (admin@wecon.events)
- [ ] Test Event Management tab
- [ ] Test Ticketing System tab
- [ ] Test Attendee Management tab
- [ ] Test Real-Time Analytics tab

#### **Cross-Dashboard Integration:**
- [ ] Create event in admin dashboard
- [ ] Verify event appears in attendee dashboard
- [ ] Create ticket tier in admin
- [ ] Verify tickets available for registration

---

## 🚨 **TROUBLESHOOTING**

### **If RLS Issues Persist:**
1. Check that service role key is correctly configured
2. Verify policies were applied without errors
3. Clear browser cache and try again

### **If Email Issues Persist:**
1. Double-check Supabase auth settings
2. Verify site URL is exactly: `https://wecon-masawat.vercel.app`
3. Try incognito/private browsing mode

### **If Admin Dashboard Issues Persist:**
1. Check browser console for JavaScript errors
2. Verify database schema was updated successfully
3. Test individual API endpoints manually

---

## 📞 **SUPPORT**

### **Configuration Files Created:**
- `SUPABASE_EMAIL_CONFIG_GUIDE.md` - Detailed email configuration
- `database/fix_user_registration_rls.sql` - RLS policy fixes
- `database/fix_admin_dashboard_schema.sql` - Schema fixes

### **Next Steps After Resolution:**
1. **Test all functionality thoroughly**
2. **Set up proper backup procedures**
3. **Configure monitoring and alerts**
4. **Plan for production scaling**

---

## ✅ **SUCCESS CRITERIA**

When all issues are resolved, you should have:

🎯 **Fully Functional User Registration**
- Attendees can register without errors
- Speakers can create accounts
- Immediate login after registration

🎯 **Proper Email Flow**
- No localhost redirects
- Production URLs in all emails
- Immediate account activation

🎯 **Complete Admin Dashboard**
- All tabs functional with real data
- Full CRUD operations working
- Real-time analytics displaying
- Cross-dashboard synchronization

---

**🚀 Ready to implement? Start with Issue 1 (RLS Policies) and work through each step systematically.**
