#!/usr/bin/env node
/**
 * Apply RLS Policies Fix via REST API
 * Uses Supabase Management API to execute SQL
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SUPABASE_URL = 'https://tvbqzqripcevaryquhfg.supabase.co';
const SERVICE_ROLE_KEY = process.argv[2];

if (!SERVICE_ROLE_KEY) {
  console.error('\n❌ Service role key required');
  console.log('Usage: node apply-rls-fix-v2.mjs <SERVICE_ROLE_KEY>\n');
  process.exit(1);
}

async function executeSQLStatements(statements) {
  console.log('\n🔧 Executing SQL migration...\n');

  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i].trim();
    if (!stmt || stmt.startsWith('--')) continue;

    process.stdout.write(`  [${i + 1}/${statements.length}] Executing... `);

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
        },
        body: JSON.stringify({ query: stmt })
      });

      if (response.ok) {
        console.log('✓');
        successCount++;
      } else {
        const error = await response.text();
        console.log('✗');
        errorCount++;
        errors.push({ statement: stmt.substring(0, 50), error });
      }
    } catch (err) {
      console.log('✗');
      errorCount++;
      errors.push({ statement: stmt.substring(0, 50), error: err.message });
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return { successCount, errorCount, errors };
}

async function main() {
  console.log('\n🚀 RLS POLICIES FIX - Direct SQL Execution\n');

  // Read SQL file
  const sqlPath = join(__dirname, 'migrations', 'FIX_RLS_POLICIES.sql');
  let sql = readFileSync(sqlPath, 'utf-8');

  console.log(`✓ Loaded SQL file (${sql.length} bytes)\n`);

  // Split into statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

  // Execute via REST API
  const result = await executeSQLStatements(statements);

  console.log('\n📊 EXECUTION SUMMARY\n');
  console.log(`  ✓ Success: ${result.successCount}`);
  console.log(`  ✗ Errors:  ${result.errorCount}`);

  if (result.errors.length > 0) {
    console.log('\n⚠️  ERRORS:\n');
    result.errors.forEach((err, i) => {
      console.log(`  ${i + 1}. ${err.statement}...`);
      console.log(`     ${err.error}\n`);
    });
  }

  if (result.errorCount === 0) {
    console.log('\n✅ MIGRATION COMPLETE - All policies fixed!\n');
  } else {
    console.log('\n⚠️  Some statements failed. Try manual execution.\n');
    process.exit(1);
  }
}

main().catch(error => {
  console.error(`\n💥 Fatal error: ${error.message}`);
  process.exit(1);
});