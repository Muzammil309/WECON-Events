# 🚀 WECON Supabase Integration Setup

## Current Status: ✅ Connection Successful, ❌ Database Schema Missing

Your Supabase connection is working! The error "Could not find the table 'public.users'" confirms that the authentication system can reach your Supabase project, but the database tables haven't been created yet.

## 📋 Required Steps

### Step 1: Get Your Service Role Key

1. **Open your Supabase dashboard** in Chrome
2. **Navigate to**: Settings → API
3. **Find the "Service Role" section**
4. **Copy the Service Role key** (starts with `eyJ...`, much longer than anon key)
5. **Update your `.env.local` file**:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key-here
   ```

### Step 2: Execute Database Schema

1. **In Supabase dashboard**: Go to **SQL Editor**
2. **Click**: "New Query"
3. **Copy and paste** the entire contents of `database/wecon_schema.sql`
4. **Click**: "Run" to execute
5. **Verify**: You should see "Success. No rows returned" message

### Step 3: Execute RLS Policies

1. **Create another new query** in SQL Editor
2. **Copy and paste** the entire contents of `database/wecon_rls_policies.sql`
3. **Click**: "Run" to execute
4. **Verify**: You should see "Success. No rows returned" message

### Step 4: Verify Database Setup

After executing both SQL files, you should see these tables in your Supabase dashboard under **Table Editor**:

- ✅ `users` - User profiles and authentication
- ✅ `events` - Event management
- ✅ `sessions` - Event sessions
- ✅ `event_registrations` - User event registrations
- ✅ `session_registrations` - User session registrations
- ✅ `connections` - User networking connections
- ✅ `meetings` - Scheduled meetings
- ✅ `notifications` - User notifications
- ✅ `admin_tasks` - Admin task management
- ✅ `digital_signage` - Digital signage content

## 🔧 Testing the Setup

Once you've completed the database setup:

1. **Refresh the setup page**: `http://localhost:3000/setup`
2. **Click**: "Create Super Admin Account"
3. **Expected result**: Success message with super admin creation
4. **Test login**: Go to `/login` and use `superadmin@wecon.com` / `SuperAdmin123!`

## 🚨 Troubleshooting

### If you get "Service Role Key" errors:
- Make sure you copied the **Service Role** key, not the **Anon** key
- The Service Role key should be much longer than the Anon key
- Update `.env.local` and restart the dev server

### If you get "Table does not exist" errors:
- Make sure you executed `wecon_schema.sql` first
- Check the SQL Editor for any error messages
- Verify tables appear in the Table Editor

### If you get "Permission denied" errors:
- Make sure you executed `wecon_rls_policies.sql` after the schema
- Check that RLS policies were created successfully

## 📊 What the Database Schema Includes

### Core Tables:
- **Users**: Complete user profiles with roles and privacy settings
- **Events**: Full event management with venues, pricing, registration
- **Sessions**: Event sessions with speakers, rooms, and capacity
- **Registrations**: Event and session registration tracking

### Advanced Features:
- **Networking**: User connections and scheduled meetings
- **Notifications**: Real-time user notifications
- **Admin Tools**: Task management and digital signage
- **Security**: Row Level Security (RLS) policies for data protection

### Performance Optimizations:
- **Indexes**: Optimized database queries
- **Triggers**: Automatic timestamp updates
- **Constraints**: Data integrity and validation

## 🎯 Next Steps After Database Setup

1. **Test Super Admin Creation**: Verify the setup page works
2. **Test Authentication**: Login with super admin credentials
3. **Test Registration**: Create attendee/speaker accounts
4. **Test Dashboards**: Verify role-based dashboard access
5. **Test Data Operations**: Create events, sessions, and registrations

---

**Need Help?** If you encounter any issues during setup, let me know the specific error message and I'll help troubleshoot!
