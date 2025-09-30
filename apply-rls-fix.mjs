#!/usr/bin/env node
/**
 * Apply RLS Policies Fix
 * Executes FIX_RLS_POLICIES.sql via Supabase Management API
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SUPABASE_URL = 'https://tvbqzqripcevaryquhfg.supabase.co';

// Try with anon key first
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2YnF6cXJpcGNldmFyeXF1aGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTI4MzEsImV4cCI6MjA3NDcyODgzMX0.BVHINkyJtK4mwRLX1Nt7_gJbd3ht2qGfvqLvmehkyIM';

// Check if service_role key provided as argument
const SERVICE_ROLE_KEY = process.argv[2];

const supabase = createClient(
  SUPABASE_URL,
  SERVICE_ROLE_KEY || SUPABASE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function executeSQL(sql) {
  console.log('\n🔧 Executing SQL migration...\n');

  try {
    // Try direct RPC call
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      console.error('❌ RPC method not available:', error.message);
      return false;
    }

    console.log('✅ SQL executed successfully');
    return true;
  } catch (err) {
    console.error('❌ Error:', err.message);
    return false;
  }
}

async function main() {
  console.log('\n🚀 RLS POLICIES FIX - Automated Migration\n');
  console.log('Reading migration file...');

  // Read SQL file
  const sqlPath = join(__dirname, 'migrations', 'FIX_RLS_POLICIES.sql');
  const sql = readFileSync(sqlPath, 'utf-8');

  console.log(`✓ Loaded ${sql.length} characters of SQL\n`);

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (SERVICE_ROLE_KEY) {
    console.log('🔑 Using SERVICE_ROLE key (admin access)\n');
  } else {
    console.log('⚠️  Using ANON key (limited access)\n');
    console.log('If this fails, provide service_role key:');
    console.log('  node apply-rls-fix.mjs <YOUR_SERVICE_ROLE_KEY>\n');
  }

  // Attempt execution
  const success = await executeSQL(sql);

  if (!success) {
    console.log('\n❌ AUTOMATED EXECUTION FAILED\n');
    console.log('Please execute manually:\n');
    console.log('1. Open: https://supabase.com/dashboard/project/tvbqzqripcevaryquhfg');
    console.log('2. Go to: SQL Editor → New Query');
    console.log('3. Copy content from: migrations/FIX_RLS_POLICIES.sql');
    console.log('4. Click RUN ▶️\n');

    console.log('Or provide service_role key:');
    console.log('  node apply-rls-fix.mjs <SERVICE_ROLE_KEY>\n');

    console.log('To find service_role key:');
    console.log('  Settings → API → Project API keys → service_role\n');

    process.exit(1);
  }

  // Verify policies were created
  console.log('\n🔍 Verifying RLS policies...\n');

  const { data: policies, error: policiesError } = await supabase
    .from('pg_policies')
    .select('tablename, policyname')
    .eq('schemaname', 'public');

  if (policiesError) {
    console.log('⚠️  Cannot verify policies (this is normal with anon key)');
  } else {
    console.log(`✓ Found ${policies?.length || 0} active policies\n`);
  }

  console.log('✅ MIGRATION COMPLETE\n');
  console.log('Next: Test CRUD operations in production');
}

main().catch(error => {
  console.error(`\n💥 Fatal error: ${error.message}`);
  process.exit(1);
});