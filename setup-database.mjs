#!/usr/bin/env node
/**
 * Setup Database: Execute migrations in Supabase
 * This script runs the complete database setup for production
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { config } from 'dotenv';

config();

const SUPABASE_URL = 'https://tvbqzqripcevaryquhfg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2YnF6cXJpcGNldmFyeXF1aGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTI4MzEsImV4cCI6MjA3NDcyODgzMX0.BVHINkyJtK4mwRLX1Nt7_gJbd3ht2qGfvqLvmehkyIM';

// Note: ANON key cannot execute DDL statements
// This script will guide you to execute migrations manually

console.log('\n🚀 NEVENT DATABASE SETUP');
console.log('='.repeat(60));
console.log('\n⚠️  DATABASE MIGRATIONS REQUIRE MANUAL EXECUTION\n');
console.log('The Supabase anon key cannot execute DDL statements (CREATE TABLE, etc.)');
console.log('You need to run the SQL scripts manually in Supabase Dashboard.\n');

console.log('📋 STEP-BY-STEP INSTRUCTIONS:\n');

console.log('1️⃣  Open Supabase Dashboard:');
console.log('   https://supabase.com/dashboard/project/tvbqzqripcevaryquhfg\n');

console.log('2️⃣  Go to: SQL Editor → New Query\n');

console.log('3️⃣  Execute migrations IN ORDER:\n');

const migrations = [
  {
    file: 'migrations/v3.0.0_schema.sql',
    description: 'Create all tables (company_okrs, departments, user_okrs, initiatives, customers, etc.)'
  },
  {
    file: 'migrations/v3.0.0_rls.sql',
    description: 'Setup Row Level Security policies'
  },
  {
    file: 'migrations/PRODUCTION_SETUP.sql',
    description: 'Create users table, triggers, insert departments data'
  }
];

migrations.forEach((migration, index) => {
  console.log(`   ${index + 1}. ${migration.file}`);
  console.log(`      → ${migration.description}\n`);
});

console.log('4️⃣  After running ALL migrations, create test users:\n');
console.log('   Go to: Authentication → Users → Add User\n');
console.log('   Create 4 users (check "Auto Confirm User" for each):\n');

const testUsers = [
  { email: 'ceo@nevent.es', password: 'Test1234!', role: 'CEO' },
  { email: 'director@nevent.es', password: 'Test1234!', role: 'Director' },
  { email: 'csm@nevent.es', password: 'Test1234!', role: 'CSM' },
  { email: 'user@nevent.es', password: 'Test1234!', role: 'User' }
];

testUsers.forEach(user => {
  console.log(`   - ${user.email} / ${user.password} (${user.role})`);
});

console.log('\n5️⃣  Verify setup by running:\n');
console.log('   node tests/automated-tests.mjs\n');

console.log('='.repeat(60));
console.log('\n💡 TIP: Copy and paste the contents of each SQL file into Supabase SQL Editor\n');

// Let's check if tables already exist
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔍 Checking current database state...\n');

async function checkDatabase() {
  const tables = [
    'users',
    'departments',
    'company_okrs',
    'user_okrs',
    'initiatives',
    'customers',
    'actions'
  ];

  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('count').limit(1);

    if (error) {
      console.log(`   ❌ ${table}: NOT FOUND (need to create)`);
    } else {
      const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
      console.log(`   ✅ ${table}: EXISTS (${count || 0} rows)`);
    }
  }

  console.log('\n='.repeat(60));
  console.log('\nReady to proceed with manual migration? (Y/n)\n');
}

checkDatabase();
