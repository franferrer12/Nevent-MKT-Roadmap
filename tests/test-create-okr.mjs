import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tvbqzqripcevaryquhfg.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2YnF6cXJpcGNldmFyeXF1aGZnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTE1MjgzMSwiZXhwIjoyMDc0NzI4ODMxfQ.tzOzwRMe9lzKvEDZpy7-mzL4p4LqqVGCZvZF3j9lDxw';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testCreateOKR() {
  console.log('🧪 Testing OKR creation...\n');

  // Get a test user
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, email, role')
    .limit(1);

  if (usersError) {
    console.error('❌ Error fetching users:', usersError);
    return;
  }

  if (!users || users.length === 0) {
    console.error('❌ No users found');
    return;
  }

  const testUser = users[0];
  console.log('✅ Test user:', testUser);

  // Try to create a test OKR
  const testOKR = {
    id: 'test-okr-' + Date.now(),
    user_id: testUser.id,
    title: 'Test OKR - Increase revenue',
    quarter: 'Q1 2025',
    key_results: [
      {
        id: 'kr1',
        description: 'Launch new product',
        target: 100,
        current: 0,
        progress: 0,
        unit: '%'
      }
    ],
    progress: 0,
    status: 'not_started',
    deadline: '2025-03-31',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  console.log('\n📝 Creating OKR:', testOKR);

  const { data, error } = await supabase
    .from('user_okrs')
    .insert([testOKR])
    .select();

  if (error) {
    console.error('\n❌ ERROR creating OKR:');
    console.error('Code:', error.code);
    console.error('Message:', error.message);
    console.error('Details:', error.details);
    console.error('Hint:', error.hint);
    return;
  }

  console.log('\n✅ OKR created successfully!');
  console.log('Data:', data);

  // Clean up - delete test OKR
  const { error: deleteError } = await supabase
    .from('user_okrs')
    .delete()
    .eq('id', testOKR.id);

  if (deleteError) {
    console.warn('⚠️  Could not delete test OKR:', deleteError.message);
  } else {
    console.log('🗑️  Test OKR deleted');
  }
}

testCreateOKR().catch(console.error);
