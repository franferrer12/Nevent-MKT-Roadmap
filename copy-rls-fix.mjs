#!/usr/bin/env node
/**
 * Copy RLS Fix SQL to Clipboard
 * Opens browser and copies SQL automatically
 */

import { readFileSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const sql = readFileSync('./migrations/FIX_RLS_POLICIES.sql', 'utf-8');

console.log('\n🚀 RLS FIX - Quick Copy\n');
console.log(`✓ SQL loaded (${sql.length} bytes)\n`);

// Try to copy to clipboard (Windows)
try {
  const tempFile = '.temp_sql.txt';
  require('fs').writeFileSync(tempFile, sql);

  await execAsync(`type ${tempFile} | clip`);
  require('fs').unlinkSync(tempFile);

  console.log('✅ SQL copied to clipboard!\n');
  console.log('Next steps:');
  console.log('1. Opening Supabase in browser...');
  console.log('2. Go to: SQL Editor → New Query');
  console.log('3. Paste with Ctrl+V');
  console.log('4. Click RUN ▶️\n');

  // Open Supabase
  exec('start https://supabase.com/dashboard/project/tvbqzqripcevaryquhfg/sql/new');

} catch (err) {
  console.log('⚠️  Cannot auto-copy. Manual steps:\n');
  console.log('1. Open: migrations/FIX_RLS_POLICIES.sql');
  console.log('2. Copy all (Ctrl+A, Ctrl+C)');
  console.log('3. Go to: https://supabase.com/dashboard/project/tvbqzqripcevaryquhfg/sql/new');
  console.log('4. Paste and RUN\n');
}

console.log('File location:');
console.log('  D:\\HERRAMIENTA TRABAJO\\Nevent-MKT-Roadmap\\migrations\\FIX_RLS_POLICIES.sql\n');