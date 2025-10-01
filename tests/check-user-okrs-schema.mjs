import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tvbqzqripcevaryquhfg.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2YnF6cXJpcGNldmFyeXF1aGZnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTE1MjgzMSwiZXhwIjoyMDc0NzI4ODMxfQ.tzOzwRMe9lzKvEDZpy7-mzL4p4LqqVGCZvZF3j9lDxw';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkSchema() {
  const { data, error } = await supabase
    .from('user_okrs')
    .select('*')
    .limit(1);

  if (error && error.code !== 'PGRST116') {
    console.error('Error:', error);
    return;
  }

  if (!data || data.length === 0) {
    console.log('Table exists but is empty. Columns unknown.');
    console.log('Trying to insert without deadline...');

    const testOKR = {
      id: 'test-' + Date.now(),
      user_id: 'd375a17a-94ad-404f-8e2b-b4f9aa32f2e5',
      title: 'Test',
      quarter: 'Q1 2025',
      key_results: [],
      progress: 0,
      status: 'not_started'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('user_okrs')
      .insert([testOKR])
      .select();

    if (insertError) {
      console.error('Insert error:', insertError.message);
    } else {
      console.log('✅ Insert successful!');
      console.log('Columns:', Object.keys(insertData[0]));

      // Clean up
      await supabase.from('user_okrs').delete().eq('id', testOKR.id);
    }
  } else {
    console.log('Columns:', Object.keys(data[0]));
  }
}

checkSchema().catch(console.error);
