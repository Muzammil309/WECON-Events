# WECON Email Verification Configuration Guide

## 🎯 ISSUE SUMMARY
The email verification redirect is pointing to localhost:3000 instead of the production URL.
This needs to be fixed in the Supabase Dashboard manually.

## 🔧 REQUIRED SUPABASE CONFIGURATION CHANGES

### 1. Authentication Settings
Go to: **Supabase Dashboard > Authentication > Settings**

#### Email Tab:
- ❌ **Enable email confirmations**: DISABLED
- ❌ **Enable email change confirmations**: DISABLED  
- ❌ **Enable secure email change**: DISABLED
- ❌ **Double confirm email changes**: DISABLED

#### Site URL Tab:
- ✅ **Site URL**: `https://wecon-masawat.vercel.app`
- ✅ **Redirect URLs**: `https://wecon-masawat.vercel.app/**`

#### General Tab:
- ✅ **Enable signup**: ENABLED
- ✅ **Enable manual linking**: ENABLED

### 2. Email Templates (Optional)
Go to: **Supabase Dashboard > Authentication > Email Templates**

Update the redirect URLs in email templates to use:
`https://wecon-masawat.vercel.app/auth/callback`

## 🧪 TESTING AFTER CONFIGURATION

1. **Test User Registration**:
   - Go to: https://wecon-masawat.vercel.app/register
   - Create a new account
   - Should work without email confirmation

2. **Test Admin Setup**:
   - Go to: https://wecon-masawat.vercel.app/setup
   - Create super admin account
   - Should work immediately

3. **Test Login**:
   - Go to: https://wecon-masawat.vercel.app/login
   - Login with created accounts
   - Should redirect properly

## 🚨 TROUBLESHOOTING

If issues persist:
1. Clear browser cache and cookies
2. Try incognito/private browsing mode
3. Check browser console for errors
4. Verify environment variables are correct

## ✅ EXPECTED OUTCOME

After configuration:
- ✅ User registration works without email confirmation
- ✅ All redirects use production URL
- ✅ No localhost:3000 references
- ✅ Immediate login after registration
