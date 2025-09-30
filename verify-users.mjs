#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tvbqzqripcevaryquhfg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2YnF6cXJpcGNldmFyeXF1aGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTI4MzEsImV4cCI6MjA3NDcyODgzMX0.BVHINkyJtK4mwRLX1Nt7_gJbd3ht2qGfvqLvmehkyIM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Intentar login con cada usuario
const testUsers = [
  { email: 'ceo@nevent.es', password: 'Test1234!' },
  { email: 'director@nevent.es', password: 'Test1234!' },
  { email: 'csm@nevent.es', password: 'Test1234!' },
  { email: 'user@nevent.es', password: 'Test1234!' }
];

console.log('\n🧪 TESTING USER LOGIN\n');

for (const user of testUsers) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: user.password
    });

    if (error) {
      console.log(`❌ ${user.email}: ${error.message}`);
    } else {
      console.log(`✅ ${user.email}: Login OK`);

      // Get profile
      const { data: profile } = await supabase
        .from('users')
        .select('role, full_name')
        .eq('id', data.user.id)
        .single();

      console.log(`   Role: ${profile?.role || 'NOT FOUND'}`);

      // Logout
      await supabase.auth.signOut();
    }
  } catch (err) {
    console.log(`❌ ${user.email}: ${err.message}`);
  }
}

console.log('\n✅ VERIFICATION COMPLETE\n');
process.exit(0);