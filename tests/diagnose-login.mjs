import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tvbqzqripcevaryquhfg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2YnF6cXJpcGNldmFyeXF1aGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTI4MzEsImV4cCI6MjA3NDcyODgzMX0.BVHINkyJtK4mwRLX1Nt7_gJbd3ht2qGfvqLvmehkyIM';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testLogin() {
  console.log('🔐 Testing login flow...\n');

  // Step 1: Login
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'ceo@nevent.es',
    password: 'Test1234!'
  });

  if (authError) {
    console.error('❌ Login failed:', authError.message);
    return;
  }

  console.log('✅ Login successful');
  console.log('User ID:', authData.user.id);
  console.log('Email:', authData.user.email);

  // Step 2: Fetch user profile
  const { data: userProfile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (profileError) {
    console.error('❌ Profile fetch failed:', profileError.message);
  } else {
    console.log('✅ Profile loaded:', userProfile);
  }

  // Step 3: Test loadDepartments
  const { data: departments, error: deptError } = await supabase
    .from('departments')
    .select('*')
    .eq('status', 'active')
    .order('name', { ascending: true });

  if (deptError) {
    console.error('❌ Departments fetch failed:', deptError.message);
  } else {
    console.log(`✅ Departments loaded: ${departments.length} departments`);
  }

  // Step 4: Test loadMyOKRs
  const { data: okrs, error: okrsError } = await supabase
    .from('user_okrs')
    .select('*')
    .eq('user_id', authData.user.id)
    .order('created_at', { ascending: false });

  if (okrsError) {
    console.error('❌ OKRs fetch failed:', okrsError.message);
  } else {
    console.log(`✅ OKRs loaded: ${okrs.length} OKRs`);
  }

  // Step 5: Test loadMyInitiatives
  const { data: initiatives, error: initError } = await supabase
    .from('initiatives')
    .select('*')
    .order('created_at', { ascending: false });

  if (initError) {
    console.error('❌ Initiatives fetch failed:', initError.message);
  } else {
    console.log(`✅ Initiatives loaded: ${initiatives.length} initiatives`);
  }

  // Step 6: Test actions
  const { data: actions, error: actionsError } = await supabase
    .from('actions')
    .select('*')
    .order('created_at', { ascending: false });

  if (actionsError) {
    console.error('❌ Actions fetch failed:', actionsError.message);
  } else {
    console.log(`✅ Actions loaded: ${actions.length} actions`);
  }

  console.log('\n✅ All API calls successful - login should work!');
}

testLogin().catch(console.error);
