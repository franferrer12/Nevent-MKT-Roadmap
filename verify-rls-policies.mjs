#!/usr/bin/env node
/**
 * Verify RLS Policies are fixed
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tvbqzqripcevaryquhfg.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2YnF6cXJpcGNldmFyeXF1aGZnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTE1MjgzMSwiZXhwIjoyMDc0NzI4ODMxfQ.tzOzwRMe9lzKvEDZpy7-mzL4p4LqqVGCZvZF3j9lDxw';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

console.log('\n🔍 CHECKING RLS POLICIES STATUS\n');

// Check if we can query company_okrs (tests if policies work)
try {
  // Login as CEO
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'ceo@nevent.es',
    password: 'Test1234!'
  });

  if (authError) {
    console.log('❌ Cannot login as CEO:', authError.message);
    process.exit(1);
  }

  console.log('✓ Logged in as CEO\n');

  // Try to read company_okrs
  const { data: okrs, error: okrError } = await supabase
    .from('company_okrs')
    .select('*')
    .limit(1);

  if (okrError) {
    console.log('❌ RLS POLICIES STILL BROKEN:');
    console.log(`   ${okrError.message}\n`);
    console.log('You need to execute: migrations/FIX_RLS_POLICIES.sql\n');
    process.exit(1);
  }

  console.log('✅ company_okrs: Readable');

  // Try to read customers
  const { data: customers, error: custError } = await supabase
    .from('customers')
    .select('*')
    .limit(1);

  if (custError) {
    console.log('❌ customers table error:', custError.message);
  } else {
    console.log('✅ customers: Readable');
  }

  // Try to read departments
  const { data: depts, error: deptError } = await supabase
    .from('departments')
    .select('*')
    .limit(1);

  if (deptError) {
    console.log('❌ departments table error:', deptError.message);
  } else {
    console.log('✅ departments: Readable');
  }

  console.log('\n✅ RLS POLICIES ARE WORKING!\n');

} catch (err) {
  console.log('❌ Error:', err.message);
  process.exit(1);
}

await supabase.auth.signOut();