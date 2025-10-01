#!/usr/bin/env node
/**
 * Check actual Supabase schema
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tvbqzqripcevaryquhfg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2YnF6cXJpcGNldmFyeXF1aGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTI4MzEsImV4cCI6MjA3NDcyODgzMX0.BVHINkyJtK4mwRLX1Nt7_gJbd3ht2qGfvqLvmehkyIM';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testInsert() {
  console.log('\n🔍 Testing departments table schema...\n');

  // Try v3.0.0 schema (budget as JSONB)
  const dept1 = {
    id: 'test-dept-1',
    name: 'Test Department',
    budget: { allocated: 100000, spent: 0, currency: 'EUR' }
  };

  console.log('Testing v3.0.0 schema (budget as JSONB)...');
  const { data: d1, error: e1 } = await supabase
    .from('departments')
    .insert(dept1)
    .select();

  if (e1) {
    console.log('❌ Failed:', e1.message);
  } else {
    console.log('✅ Success with JSONB budget');
    // Clean up
    await supabase.from('departments').delete().eq('id', 'test-dept-1');
  }

  // Try PRODUCTION_SETUP schema (budget as NUMBER)
  const dept2 = {
    id: 'test-dept-2',
    name: 'Test Department 2',
    budget: 100000,
    parent_id: null
  };

  console.log('\nTesting PRODUCTION_SETUP schema (budget as NUMBER)...');
  const { data: d2, error: e2 } = await supabase
    .from('departments')
    .insert(dept2)
    .select();

  if (e2) {
    console.log('❌ Failed:', e2.message);
  } else {
    console.log('✅ Success with NUMBER budget');
    console.log('Data inserted:', JSON.stringify(d2, null, 2));
    // Clean up
    await supabase.from('departments').delete().eq('id', 'test-dept-2');
  }

  console.log('\n✅ Schema test complete\n');
}

testInsert();
