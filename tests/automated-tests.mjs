#!/usr/bin/env node
/**
 * Automated Test Suite for Nevent Strategic Execution Platform
 * Tests: Core functionality, Database integrity, Role-based access, Analytics
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const SUPABASE_URL = 'https://tvbqzqripcevaryquhfg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2YnF6cXJpcGNldmFyeXF1aGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTI4MzEsImV4cCI6MjA3NDcyODgzMX0.BVHINkyJtK4mwRLX1Nt7_gJbd3ht2qGfvqLvmehkyIM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Test results
const results = {
  passed: 0,
  failed: 0,
  skipped: 0,
  total: 0,
  tests: []
};

// Helper functions
function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    error: '\x1b[31m',
    warning: '\x1b[33m',
    reset: '\x1b[0m'
  };
  console.log(`${colors[type]}${message}${colors.reset}`);
}

function assert(condition, testName, errorMessage = '') {
  results.total++;
  if (condition) {
    results.passed++;
    log(`✓ ${testName}`, 'success');
    results.tests.push({ name: testName, status: 'passed' });
    return true;
  } else {
    results.failed++;
    log(`✗ ${testName}`, 'error');
    if (errorMessage) log(`  ${errorMessage}`, 'error');
    results.tests.push({ name: testName, status: 'failed', error: errorMessage });
    return false;
  }
}

// ============================================
// TEST SUITE 1: DATABASE INTEGRITY
// ============================================
async function testDatabaseIntegrity() {
  log('\n📊 TEST SUITE 1: Database Integrity', 'info');
  log('=' .repeat(60), 'info');

  try {
    // Test 1.1: Check all required tables exist
    const requiredTables = [
      'users',
      'departments',
      'company_okrs',
      'user_okrs',
      'initiatives',
      'customers',
      'actions'
    ];

    for (const table of requiredTables) {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      assert(
        !error,
        `Table "${table}" exists and is accessible`,
        error?.message
      );
    }

    // Test 1.2: Check departments data
    const { data: departments, error: deptError } = await supabase
      .from('departments')
      .select('*');

    assert(
      !deptError && departments && departments.length >= 7,
      `Departments table has at least 7 entries (found ${departments?.length || 0})`,
      deptError?.message
    );

    // Test 1.3: Check users table structure
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, role, full_name')
      .limit(1);

    assert(
      !usersError,
      'Users table has correct schema (id, email, role, full_name)',
      usersError?.message
    );

    // Test 1.4: Check company_okrs structure
    const { data: companyOkrs, error: okrsError } = await supabase
      .from('company_okrs')
      .select('id, objective, fiscal_year, key_results')
      .limit(1);

    assert(
      !okrsError,
      'Company OKRs table has correct schema',
      okrsError?.message
    );

  } catch (error) {
    log(`Database integrity tests failed: ${error.message}`, 'error');
  }
}

// ============================================
// TEST SUITE 2: AUTHENTICATION & ROLES
// ============================================
async function testAuthenticationAndRoles() {
  log('\n🔐 TEST SUITE 2: Authentication & Roles', 'info');
  log('=' .repeat(60), 'info');

  try {
    // Test 2.1: Check test users exist
    const testEmails = [
      'user@nevent.es',
      'director@nevent.es',
      'ceo@nevent.es',
      'csm@nevent.es'
    ];

    const { data: users, error } = await supabase
      .from('users')
      .select('email, role')
      .in('email', testEmails);

    assert(
      !error && users && users.length >= 4,
      `All 4 test users exist in database (found ${users?.length || 0})`,
      error?.message
    );

    // Test 2.2: Verify role assignments
    const roleMap = {
      'user@nevent.es': 'user',
      'director@nevent.es': 'director',
      'ceo@nevent.es': 'ceo',
      'csm@nevent.es': 'csm'
    };

    if (users) {
      users.forEach(user => {
        assert(
          user.role === roleMap[user.email],
          `User ${user.email} has correct role: ${user.role}`,
          `Expected ${roleMap[user.email]}, got ${user.role}`
        );
      });
    }

    // Test 2.3: Check role enum constraint
    const validRoles = ['user', 'director', 'ceo', 'csm'];
    if (users) {
      users.forEach(user => {
        assert(
          validRoles.includes(user.role),
          `User ${user.email} has valid role enum`,
          `Invalid role: ${user.role}`
        );
      });
    }

  } catch (error) {
    log(`Authentication tests failed: ${error.message}`, 'error');
  }
}

// ============================================
// TEST SUITE 3: CUSTOMER SUCCESS FEATURES
// ============================================
async function testCustomerSuccessFeatures() {
  log('\n🤝 TEST SUITE 3: Customer Success Features', 'info');
  log('=' .repeat(60), 'info');

  try {
    // Test 3.1: Customers table exists with correct schema
    const { data: customers, error: custError } = await supabase
      .from('customers')
      .select('id, name, mrr, status, health_score, csm_user_id')
      .limit(1);

    assert(
      !custError,
      'Customers table has correct schema (name, mrr, status, health_score)',
      custError?.message
    );

    // Test 3.2: Health score is within valid range (0-100)
    const { data: allCustomers } = await supabase
      .from('customers')
      .select('health_score');

    if (allCustomers && allCustomers.length > 0) {
      const validScores = allCustomers.every(c =>
        c.health_score >= 0 && c.health_score <= 100
      );
      assert(
        validScores,
        'All customer health scores are between 0-100',
        'Invalid health score found'
      );
    } else {
      log('  ⊘ No customers in database, skipping health score validation', 'warning');
      results.skipped++;
    }

    // Test 3.3: Status enum is valid
    const validStatuses = ['active', 'prospect', 'churned'];
    const { data: statusCustomers } = await supabase
      .from('customers')
      .select('status');

    if (statusCustomers && statusCustomers.length > 0) {
      const validStatusEnum = statusCustomers.every(c =>
        validStatuses.includes(c.status)
      );
      assert(
        validStatusEnum,
        'All customer statuses are valid (active/prospect/churned)',
        'Invalid status found'
      );
    } else {
      log('  ⊘ No customers in database, skipping status validation', 'warning');
      results.skipped++;
    }

  } catch (error) {
    log(`Customer Success tests failed: ${error.message}`, 'error');
  }
}

// ============================================
// TEST SUITE 4: OKR SYSTEM
// ============================================
async function testOKRSystem() {
  log('\n🎯 TEST SUITE 4: OKR System', 'info');
  log('=' .repeat(60), 'info');

  try {
    // Test 4.1: Company OKRs structure
    const { data: companyOkrs, error: coError } = await supabase
      .from('company_okrs')
      .select('*')
      .limit(1);

    assert(
      !coError,
      'Company OKRs table is accessible',
      coError?.message
    );

    if (companyOkrs && companyOkrs.length > 0) {
      const okr = companyOkrs[0];
      assert(
        okr.key_results && Array.isArray(okr.key_results),
        'Company OKR has key_results array',
        'key_results is not an array'
      );

      if (okr.key_results.length > 0) {
        const kr = okr.key_results[0];
        assert(
          kr.id && kr.description && typeof kr.current === 'number' && typeof kr.target === 'number',
          'Key results have correct structure (id, description, current, target)',
          'Invalid key result structure'
        );
      }
    }

    // Test 4.2: User OKRs structure
    const { data: userOkrs, error: uoError } = await supabase
      .from('user_okrs')
      .select('*')
      .limit(1);

    assert(
      !uoError,
      'User OKRs table is accessible',
      uoError?.message
    );

    // Test 4.3: Initiatives structure
    const { data: initiatives, error: initError } = await supabase
      .from('initiatives')
      .select('*')
      .limit(1);

    assert(
      !initError,
      'Initiatives table is accessible',
      initError?.message
    );

    if (initiatives && initiatives.length > 0) {
      const init = initiatives[0];
      assert(
        typeof init.budget_allocated === 'number' && typeof init.budget_spent === 'number',
        'Initiatives have budget tracking (allocated, spent)',
        'Invalid budget structure'
      );
    }

  } catch (error) {
    log(`OKR System tests failed: ${error.message}`, 'error');
  }
}

// ============================================
// TEST SUITE 5: DATA VALIDATION
// ============================================
async function testDataValidation() {
  log('\n✅ TEST SUITE 5: Data Validation', 'info');
  log('=' .repeat(60), 'info');

  try {
    // Test 5.1: No orphaned initiatives (all link to valid OKRs)
    const { data: initiatives } = await supabase
      .from('initiatives')
      .select('okr_id');

    if (initiatives && initiatives.length > 0) {
      const okrIds = initiatives.map(i => i.okr_id).filter(Boolean);

      if (okrIds.length > 0) {
        const { data: okrs } = await supabase
          .from('user_okrs')
          .select('id')
          .in('id', okrIds);

        assert(
          okrs && okrs.length === okrIds.length,
          'All initiatives link to valid OKRs (no orphans)',
          `Found ${okrIds.length} initiatives but only ${okrs?.length || 0} valid OKRs`
        );
      }
    } else {
      log('  ⊘ No initiatives in database, skipping orphan check', 'warning');
      results.skipped++;
    }

    // Test 5.2: No negative MRR values
    const { data: customers } = await supabase
      .from('customers')
      .select('mrr');

    if (customers && customers.length > 0) {
      const allPositive = customers.every(c => c.mrr >= 0);
      assert(
        allPositive,
        'All customer MRR values are non-negative',
        'Found negative MRR value'
      );
    } else {
      log('  ⊘ No customers in database, skipping MRR validation', 'warning');
      results.skipped++;
    }

    // Test 5.3: Fiscal years are valid
    const { data: companyOkrs } = await supabase
      .from('company_okrs')
      .select('fiscal_year');

    if (companyOkrs && companyOkrs.length > 0) {
      const validYears = companyOkrs.every(okr =>
        okr.fiscal_year >= 2024 && okr.fiscal_year <= 2030
      );
      assert(
        validYears,
        'All fiscal years are in valid range (2024-2030)',
        'Invalid fiscal year found'
      );
    } else {
      log('  ⊘ No company OKRs in database, skipping fiscal year validation', 'warning');
      results.skipped++;
    }

  } catch (error) {
    log(`Data validation tests failed: ${error.message}`, 'error');
  }
}

// ============================================
// TEST SUITE 6: ANALYTICS & TRACKING
// ============================================
async function testAnalytics() {
  log('\n📊 TEST SUITE 6: Analytics & Tracking', 'info');
  log('=' .repeat(60), 'info');

  // Note: Analytics is localStorage-based, so we can only validate structure
  log('  ⓘ Analytics is client-side (localStorage), checking code structure...', 'info');

  // Read index.html to validate analytics implementation
  try {
    const fs = await import('fs');
    const indexHtml = fs.readFileSync('D:\\HERRAMIENTA TRABAJO\\Nevent-MKT-Roadmap\\index.html', 'utf8');

    assert(
      indexHtml.includes('const analytics = {'),
      'Analytics object is defined in index.html'
    );

    assert(
      indexHtml.includes('track(eventName, properties'),
      'Analytics track() method exists'
    );

    assert(
      indexHtml.includes('getEvents(filters'),
      'Analytics getEvents() method exists'
    );

    assert(
      indexHtml.includes('clearEvents()'),
      'Analytics clearEvents() method exists'
    );

    assert(
      indexHtml.includes('persistEvent(event)'),
      'Analytics persistEvent() method exists'
    );

    // Check for tracking calls
    const trackingEvents = [
      'user_login',
      'view_changed',
      'customer_created',
      'customer_updated',
      'view_as_switch',
      'view_as_exit'
    ];

    trackingEvents.forEach(event => {
      assert(
        indexHtml.includes(`'${event}'`) || indexHtml.includes(`"${event}"`),
        `Analytics tracks "${event}" event`
      );
    });

  } catch (error) {
    log(`Analytics tests failed: ${error.message}`, 'error');
  }
}

// ============================================
// MAIN TEST RUNNER
// ============================================
async function runAllTests() {
  log('\n🚀 NEVENT STRATEGIC EXECUTION PLATFORM - AUTOMATED TEST SUITE', 'info');
  log('=' .repeat(60), 'info');
  log(`Started at: ${new Date().toISOString()}\n`, 'info');

  await testDatabaseIntegrity();
  await testAuthenticationAndRoles();
  await testCustomerSuccessFeatures();
  await testOKRSystem();
  await testDataValidation();
  await testAnalytics();

  // Print summary
  log('\n' + '=' .repeat(60), 'info');
  log('📊 TEST SUMMARY', 'info');
  log('=' .repeat(60), 'info');
  log(`Total Tests:   ${results.total}`, 'info');
  log(`✓ Passed:      ${results.passed}`, 'success');
  log(`✗ Failed:      ${results.failed}`, results.failed > 0 ? 'error' : 'info');
  log(`⊘ Skipped:     ${results.skipped}`, 'warning');

  const passRate = ((results.passed / results.total) * 100).toFixed(1);
  log(`\nPass Rate:     ${passRate}%`, passRate >= 90 ? 'success' : 'warning');

  if (results.failed === 0) {
    log('\n🎉 ALL TESTS PASSED! Ready for production.', 'success');
  } else {
    log('\n⚠️  Some tests failed. Review issues before deploying.', 'warning');
  }

  log(`\nCompleted at: ${new Date().toISOString()}`, 'info');

  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch(error => {
  log(`\n💥 Fatal error: ${error.message}`, 'error');
  process.exit(1);
});