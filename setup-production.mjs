#!/usr/bin/env node
/**
 * Production Setup Assistant
 * Guides through Supabase setup and deployment
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const SUPABASE_URL = 'https://tvbqzqripcevaryquhfg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2YnF6cXJpcGNldmFyeXF1aGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTI4MzEsImV4cCI6MjA3NDcyODgzMX0.BVHINkyJtK4mwRLX1Nt7_gJbd3ht2qGfvqLvmehkyIM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    error: '\x1b[31m',
    warning: '\x1b[33m',
    bold: '\x1b[1m',
    reset: '\x1b[0m'
  };
  console.log(`${colors[type]}${message}${colors.reset}`);
}

function section(title) {
  log('\n' + '='.repeat(60), 'bold');
  log(title, 'bold');
  log('='.repeat(60), 'bold');
}

async function checkTableExists(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    return !error;
  } catch {
    return false;
  }
}

async function checkDatabase() {
  section('📊 CHECKING DATABASE STATUS');

  const tables = [
    'departments',
    'company_okrs',
    'user_okrs',
    'initiatives',
    'actions',
    'users',
    'customers'
  ];

  const status = {};

  for (const table of tables) {
    const exists = await checkTableExists(table);
    status[table] = exists;

    if (exists) {
      log(`  ✓ ${table} - EXISTS`, 'success');
    } else {
      log(`  ✗ ${table} - MISSING`, 'error');
    }
  }

  return status;
}

async function checkUsers() {
  section('👤 CHECKING TEST USERS');

  const testEmails = [
    'ceo@nevent.es',
    'director@nevent.es',
    'csm@nevent.es',
    'user@nevent.es'
  ];

  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('email, role, full_name')
      .in('email', testEmails);

    if (error) {
      log('  ✗ Cannot check users (table may not exist)', 'error');
      return { exists: false, count: 0 };
    }

    log(`  Found ${users?.length || 0}/4 test users:`, 'info');

    if (users) {
      users.forEach(user => {
        log(`    ✓ ${user.email} (${user.role})`, 'success');
      });
    }

    const missing = testEmails.filter(email =>
      !users?.some(u => u.email === email)
    );

    if (missing.length > 0) {
      log('\n  Missing users:', 'warning');
      missing.forEach(email => {
        log(`    ⚠ ${email}`, 'warning');
      });
    }

    return { exists: true, count: users?.length || 0, missing };
  } catch (error) {
    log(`  ✗ Error checking users: ${error.message}`, 'error');
    return { exists: false, count: 0 };
  }
}

async function getDepartmentCount() {
  try {
    const { data, error } = await supabase
      .from('departments')
      .select('id, name');

    if (error) return 0;
    return data?.length || 0;
  } catch {
    return 0;
  }
}

async function generateInstructions(dbStatus, userStatus) {
  section('📋 REQUIRED ACTIONS');

  const missingTables = Object.entries(dbStatus)
    .filter(([_, exists]) => !exists)
    .map(([table]) => table);

  if (missingTables.length === 0 && userStatus.count === 4) {
    log('\n  🎉 EVERYTHING IS READY!', 'success');
    log('  Your database is properly configured.', 'success');
    log('\n  Next step: Deploy to GitHub Pages', 'info');
    return true;
  }

  log('\n  You need to complete these steps:\n', 'warning');

  if (missingTables.length > 0) {
    log('  ❌ CRITICAL: Missing database tables', 'error');
    log('\n  Action Required:', 'bold');
    log('  1. Open Supabase Dashboard:', 'info');
    log('     https://supabase.com/dashboard/project/tvbqzqripcevaryquhfg\n', 'info');
    log('  2. Go to: SQL Editor → New Query', 'info');
    log('  3. Copy & Paste content from:', 'info');
    log('     migrations/PRODUCTION_SETUP.sql', 'warning');
    log('  4. Click RUN ▶️', 'info');
    log('  5. Wait for completion (should take 5-10 seconds)', 'info');
  }

  if (userStatus.exists && userStatus.count < 4) {
    log('\n  ⚠️  Missing test users', 'warning');
    log('\n  Action Required:', 'bold');
    log('  1. Open Supabase Dashboard:', 'info');
    log('     https://supabase.com/dashboard/project/tvbqzqripcevaryquhfg\n', 'info');
    log('  2. Go to: Authentication → Users → Add User', 'info');
    log('  3. Create these users:', 'info');

    if (userStatus.missing) {
      userStatus.missing.forEach(email => {
        log(`     • ${email} / Test1234! [✓ Auto Confirm]`, 'warning');
      });
    }
  }

  if (!userStatus.exists) {
    log('\n  ⚠️  Cannot verify users (run SQL first)', 'warning');
  }

  log('\n  After completing these steps:', 'info');
  log('  Run this script again to verify: node setup-production.mjs\n', 'info');

  return false;
}

async function showDeploymentInstructions() {
  section('🚀 DEPLOYMENT TO GITHUB PAGES');

  log('\n  Your application is ready for deployment!', 'success');
  log('\n  Execute these commands:\n', 'info');

  log('  git add .', 'warning');
  log('  git commit -m "chore: production database setup complete"', 'warning');
  log('  git tag -a v3.0.0 -m "Release v3.0.0 - Production Ready"', 'warning');
  log('  git push origin main --tags', 'warning');

  log('\n  Then verify GitHub Pages:', 'info');
  log('  1. Go to: Settings → Pages', 'info');
  log('  2. Source: Deploy from branch main / (root)', 'info');
  log('  3. Wait 2-3 minutes for build', 'info');
  log('  4. Access: https://franferrer12.github.io/Nevent-MKT-Roadmap/', 'success');

  log('\n  Live URL will be:', 'bold');
  log('  https://franferrer12.github.io/Nevent-MKT-Roadmap/', 'success');
}

async function showSummary(dbStatus, userStatus, deptCount) {
  section('📊 DATABASE SUMMARY');

  const totalTables = Object.keys(dbStatus).length;
  const existingTables = Object.values(dbStatus).filter(Boolean).length;
  const completionRate = Math.round((existingTables / totalTables) * 100);

  log(`\n  Tables:        ${existingTables}/${totalTables} (${completionRate}%)`, 'info');
  log(`  Test Users:    ${userStatus.count}/4`, userStatus.count === 4 ? 'success' : 'warning');
  log(`  Departments:   ${deptCount}`, deptCount >= 7 ? 'success' : 'warning');

  const isReady = completionRate === 100 && userStatus.count === 4 && deptCount >= 7;

  log(`\n  Status:        ${isReady ? '✅ PRODUCTION READY' : '⚠️  SETUP REQUIRED'}`,
    isReady ? 'success' : 'warning');
}

async function main() {
  log('\n🚀 NEVENT STRATEGIC EXECUTION PLATFORM', 'bold');
  log('Production Setup Assistant v1.0\n', 'info');

  // Check database
  const dbStatus = await checkDatabase();

  // Check users
  const userStatus = await checkUsers();

  // Get department count
  const deptCount = await getDepartmentCount();

  // Show summary
  await showSummary(dbStatus, userStatus, deptCount);

  // Generate instructions
  const isReady = await generateInstructions(dbStatus, userStatus);

  // Show deployment instructions if ready
  if (isReady) {
    await showDeploymentInstructions();
  }

  section('✨ NEXT STEPS');

  if (isReady) {
    log('\n  1. Deploy to GitHub Pages (commands above)', 'success');
    log('  2. Test in production with test users', 'success');
    log('  3. Monitor Supabase usage (Free Tier)', 'success');
    log('  4. Optional: Implement Sprint 2 UX (26h)', 'info');
  } else {
    log('\n  1. Complete database setup (see instructions above)', 'warning');
    log('  2. Run this script again to verify', 'warning');
    log('  3. Deploy to GitHub Pages', 'info');
  }

  log('\n  Documentation:', 'info');
  log('  • Checklist: PRE_PRODUCTION_CHECKLIST.md', 'info');
  log('  • Progress:  http://127.0.0.1:8080/progress-dashboard.html', 'info');
  log('  • Changelog: CHANGELOG.md\n', 'info');
}

main().catch(error => {
  log(`\n💥 Error: ${error.message}`, 'error');
  process.exit(1);
});