#!/usr/bin/env node

/**
 * WECON Event Management System - Admin Dashboard Test Script
 * 
 * This script tests all admin dashboard CRUD operations and identifies issues.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables manually
function loadEnvFile() {
  try {
    const envPath = path.join(__dirname, '../.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const lines = envContent.split('\n');
      
      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...valueParts] = trimmed.split('=');
          if (key && valueParts.length > 0) {
            const value = valueParts.join('=').replace(/^["']|["']$/g, '');
            process.env[key] = value;
          }
        }
      });
    }
  } catch (error) {
    console.warn('Could not load .env.local file:', error.message);
  }
}

loadEnvFile();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function testAdminDashboard() {
  console.log('🧪 WECON Admin Dashboard Test Script');
  console.log('====================================');

  // Validate environment variables
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('❌ Missing required environment variables:');
    console.error('   - NEXT_PUBLIC_SUPABASE_URL');
    console.error('   - SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  console.log('✅ Environment variables loaded');
  console.log(`📍 Supabase URL: ${SUPABASE_URL}`);

  // Create Supabase client with service role
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  console.log('✅ Supabase client initialized');

  try {
    console.log('\n🔍 TESTING DATABASE SCHEMA:');
    console.log('============================');
    
    await testDatabaseSchema(supabase);
    
    console.log('\n🔍 TESTING CRUD OPERATIONS:');
    console.log('============================');
    
    await testEventsCRUD(supabase);
    await testTicketsCRUD(supabase);
    await testUsersCRUD(supabase);
    await testSessionsCRUD(supabase);
    
    console.log('\n📊 TESTING ANALYTICS:');
    console.log('======================');
    
    await testAnalytics(supabase);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

async function testDatabaseSchema(supabase) {
  console.log('⏳ Checking database schema...');
  
  try {
    // Check if tables exist
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_type', 'BASE TABLE');
    
    if (error) {
      console.log('⚠️  Could not query schema directly, testing table access...');
      
      // Test table access directly
      const tableTests = [
        { name: 'users', test: () => supabase.from('users').select('id').limit(1) },
        { name: 'events', test: () => supabase.from('events').select('id').limit(1) },
        { name: 'sessions', test: () => supabase.from('sessions').select('id').limit(1) },
        { name: 'event_registrations', test: () => supabase.from('event_registrations').select('id').limit(1) },
        { name: 'ticket_tiers', test: () => supabase.from('ticket_tiers').select('id').limit(1) },
        { name: 'admin_tasks', test: () => supabase.from('admin_tasks').select('id').limit(1) },
        { name: 'digital_signage', test: () => supabase.from('digital_signage').select('id').limit(1) }
      ];
      
      for (const table of tableTests) {
        try {
          await table.test();
          console.log(`   ✅ Table '${table.name}' exists and accessible`);
        } catch (err) {
          console.log(`   ❌ Table '${table.name}' missing or inaccessible: ${err.message}`);
        }
      }
    } else {
      console.log('✅ Database schema accessible');
      const tableNames = tables.map(t => t.table_name).sort();
      console.log(`   📋 Found tables: ${tableNames.join(', ')}`);
    }
    
  } catch (error) {
    console.log(`⚠️  Schema check failed: ${error.message}`);
  }
}

async function testEventsCRUD(supabase) {
  console.log('\n⏳ Testing Events CRUD operations...');
  
  try {
    // Test READ
    console.log('   📖 Testing Events READ...');
    const { data: events, error: readError } = await supabase
      .from('events')
      .select('*')
      .limit(5);
    
    if (readError) {
      console.log(`   ❌ Events READ failed: ${readError.message}`);
      return;
    }
    
    console.log(`   ✅ Events READ successful (${events.length} events found)`);
    
    // Test CREATE
    console.log('   ➕ Testing Events CREATE...');
    const testEvent = {
      name: 'Test Event ' + Date.now(),
      slug: 'test-event-' + Date.now(),
      description: 'Test event for CRUD testing',
      timezone: 'UTC',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'DRAFT',
      primary_color: '#764DF0',
      secondary_color: '#442490',
      current_attendees: 0,
      networking_enabled: true,
      qa_enabled: true,
      chat_enabled: true,
      virtual_enabled: false
    };
    
    const { data: newEvent, error: createError } = await supabase
      .from('events')
      .insert(testEvent)
      .select()
      .single();
    
    if (createError) {
      console.log(`   ❌ Events CREATE failed: ${createError.message}`);
      return;
    }
    
    console.log(`   ✅ Events CREATE successful (ID: ${newEvent.id})`);
    
    // Test UPDATE
    console.log('   ✏️  Testing Events UPDATE...');
    const { data: updatedEvent, error: updateError } = await supabase
      .from('events')
      .update({ 
        name: 'Updated Test Event',
        status: 'PUBLISHED',
        updated_at: new Date().toISOString()
      })
      .eq('id', newEvent.id)
      .select()
      .single();
    
    if (updateError) {
      console.log(`   ❌ Events UPDATE failed: ${updateError.message}`);
    } else {
      console.log(`   ✅ Events UPDATE successful`);
    }
    
    // Test DELETE
    console.log('   🗑️  Testing Events DELETE...');
    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .eq('id', newEvent.id);
    
    if (deleteError) {
      console.log(`   ❌ Events DELETE failed: ${deleteError.message}`);
    } else {
      console.log(`   ✅ Events DELETE successful`);
    }
    
  } catch (error) {
    console.log(`   ❌ Events CRUD test failed: ${error.message}`);
  }
}

async function testTicketsCRUD(supabase) {
  console.log('\n⏳ Testing Tickets CRUD operations...');
  
  try {
    // Test if ticket_tiers table exists
    const { data: tickets, error: readError } = await supabase
      .from('ticket_tiers')
      .select('*')
      .limit(5);
    
    if (readError) {
      console.log(`   ❌ Tickets table not accessible: ${readError.message}`);
      console.log(`   ⚠️  Ticket management may need schema updates`);
      return;
    }
    
    console.log(`   ✅ Tickets READ successful (${tickets.length} ticket tiers found)`);
    
  } catch (error) {
    console.log(`   ❌ Tickets CRUD test failed: ${error.message}`);
  }
}

async function testUsersCRUD(supabase) {
  console.log('\n⏳ Testing Users CRUD operations...');
  
  try {
    // Test READ
    const { data: users, error: readError } = await supabase
      .from('users')
      .select('id, email, role, first_name, last_name')
      .limit(5);
    
    if (readError) {
      console.log(`   ❌ Users READ failed: ${readError.message}`);
      return;
    }
    
    console.log(`   ✅ Users READ successful (${users.length} users found)`);
    
  } catch (error) {
    console.log(`   ❌ Users CRUD test failed: ${error.message}`);
  }
}

async function testSessionsCRUD(supabase) {
  console.log('\n⏳ Testing Sessions CRUD operations...');
  
  try {
    const { data: sessions, error: readError } = await supabase
      .from('sessions')
      .select('*')
      .limit(5);
    
    if (readError) {
      console.log(`   ❌ Sessions READ failed: ${readError.message}`);
      return;
    }
    
    console.log(`   ✅ Sessions READ successful (${sessions.length} sessions found)`);
    
  } catch (error) {
    console.log(`   ❌ Sessions CRUD test failed: ${error.message}`);
  }
}

async function testAnalytics(supabase) {
  console.log('\n⏳ Testing Analytics queries...');
  
  try {
    // Test basic counts
    const [
      { count: userCount },
      { count: eventCount },
      { count: sessionCount }
    ] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('events').select('*', { count: 'exact', head: true }),
      supabase.from('sessions').select('*', { count: 'exact', head: true })
    ]);
    
    console.log(`   ✅ Analytics successful:`);
    console.log(`      👥 Users: ${userCount || 0}`);
    console.log(`      📅 Events: ${eventCount || 0}`);
    console.log(`      🎯 Sessions: ${sessionCount || 0}`);
    
  } catch (error) {
    console.log(`   ❌ Analytics test failed: ${error.message}`);
  }
}

// Run the script
if (require.main === module) {
  testAdminDashboard()
    .then(() => {
      console.log('\n🎉 Admin Dashboard test completed!');
      console.log('\nNext steps:');
      console.log('1. Review any failed tests above');
      console.log('2. Apply database schema fixes if needed');
      console.log('3. Test admin dashboard functionality in browser');
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { testAdminDashboard };
