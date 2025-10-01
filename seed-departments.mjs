#!/usr/bin/env node
/**
 * Seed Departments Data
 * Inserts the 7 core departments into the database
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tvbqzqripcevaryquhfg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2YnF6cXJpcGNldmFyeXF1aGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTI4MzEsImV4cCI6MjA3NDcyODgzMX0.BVHINkyJtK4mwRLX1Nt7_gJbd3ht2qGfvqLvmehkyIM';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const departments = [
  { name: 'Marketing' },
  { name: 'Sales' },
  { name: 'Product' },
  { name: 'Engineering' },
  { name: 'Customer Success' },
  { name: 'Operations' },
  { name: 'Finance' }
];

console.log('\n🏢 SEEDING DEPARTMENTS DATA');
console.log('='.repeat(60));

async function seedDepartments() {
  try {
    // Check if departments already exist
    const { data: existing, error: checkError } = await supabase
      .from('departments')
      .select('id');

    if (checkError) {
      console.log('❌ Error checking departments:', checkError.message);
      return;
    }

    if (existing && existing.length > 0) {
      console.log(`\n⚠️  Found ${existing.length} existing departments - skipping insert\n`);
    } else {
      console.log('\n📝 Inserting new departments...\n');

      // Insert new departments
      for (const dept of departments) {
        const { error: insertError } = await supabase
          .from('departments')
          .insert(dept);

        if (insertError) {
          console.log(`   ❌ ${dept.name}: ${insertError.message}`);
        } else {
          console.log(`   ✅ ${dept.name}`);
        }
      }
    }

    // Verify
    const { data: final, error: finalError } = await supabase
      .from('departments')
      .select('*');

    if (finalError) {
      console.log('\n❌ Error verifying departments:', finalError.message);
    } else {
      console.log('\n' + '='.repeat(60));
      console.log(`✅ SUCCESS: ${final.length} departments in database`);
      console.log('='.repeat(60));
      console.log('\nDepartments:');
      final.forEach(d => {
        console.log(`   📁 ${d.name} (ID: ${d.id})`);
      });
    }
  } catch (error) {
    console.log('\n💥 Fatal error:', error.message);
  }
}

seedDepartments();
