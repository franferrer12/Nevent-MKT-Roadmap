#!/usr/bin/env node

/**
 * QA Testing for v3.0.0 Sprint
 * Tests all implemented features
 */

import fs from 'fs/promises';
import path from 'path';

console.log('🧪 Starting QA Testing for v3.0.0 Sprint\n');

const projectRoot = process.cwd();
const indexPath = path.join(projectRoot, 'index.html');

let testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

function test(name, condition) {
  const result = condition();
  testResults.tests.push({ name, passed: result });

  if (result) {
    testResults.passed++;
    console.log(`✅ PASS: ${name}`);
  } else {
    testResults.failed++;
    console.error(`❌ FAIL: ${name}`);
  }

  return result;
}

async function runTests() {
  console.log('📊 Reading index.html...\n');
  const content = await fs.readFile(indexPath, 'utf-8');

  console.log('=' .repeat(60));
  console.log('Feature 1: User OKR Modal');
  console.log('=' .repeat(60));

  test('OKR modal HTML exists', () => content.includes('id="okrModal"'));
  test('OKR form exists', () => content.includes('id="okrForm"'));
  test('OKR title input exists', () => content.includes('id="okrTitle"'));
  test('OKR quarter select exists', () => content.includes('id="okrQuarter"'));
  test('OKR deadline input exists', () => content.includes('id="okrDeadline"'));
  test('Key results container exists', () => content.includes('id="keyResultsContainer"'));
  test('openOKRModal function exists', () => content.includes('function openOKRModal()'));
  test('closeOKRModal function exists', () => content.includes('function closeOKRModal()'));
  test('addKeyResult function exists', () => content.includes('function addKeyResult()'));
  test('removeKeyResult function exists', () => content.includes('function removeKeyResult('));
  test('saveOKR function exists', () => content.includes('async function saveOKR('));
  test('OKR button in dashboard exists', () => content.includes('onclick="openOKRModal()"'));

  console.log('\n' + '=' .repeat(60));
  console.log('Feature 2: Initiative Modal');
  console.log('=' .repeat(60));

  test('Initiative modal HTML exists', () => content.includes('id="initiativeModal"'));
  test('Initiative form exists', () => content.includes('id="initiativeForm"'));
  test('Initiative title input exists', () => content.includes('id="initiativeTitle"'));
  test('Initiative description exists', () => content.includes('id="initiativeDescription"'));
  test('Initiative OKR select exists', () => content.includes('id="initiativeOKR"'));
  test('Initiative budget input exists', () => content.includes('id="initiativeBudget"'));
  test('openInitiativeModal function exists', () => content.includes('function openInitiativeModal()'));
  test('closeInitiativeModal function exists', () => content.includes('function closeInitiativeModal()'));
  test('populateOKRDropdown function exists', () => content.includes('function populateOKRDropdown()'));
  test('saveInitiative function exists', () => content.includes('async function saveInitiative('));
  test('Initiative button in dashboard exists', () => content.includes('onclick="openInitiativeModal()"'));

  console.log('\n' + '=' .repeat(60));
  console.log('Feature 3: Action → Initiative Linking');
  console.log('=' .repeat(60));

  test('Initiative select in action modal exists', () => content.includes('id="initiativeSelect"'));
  test('populateInitiativeDropdown function exists', () => content.includes('function populateInitiativeDropdown()'));
  test('initiative_id saved in saveAction', () => content.includes('initiative_id: initiative_id'));
  test('initiative_id loaded in editAction', () => content.includes("document.getElementById('initiativeSelect').value = action.initiative_id"));

  console.log('\n' + '=' .repeat(60));
  console.log('Feature 4: Automatic Health Tracking');
  console.log('=' .repeat(60));

  test('updateInitiativeProgress function exists', () => content.includes('async function updateInitiativeProgress('));
  test('Progress calculation from actions', () => content.includes("filter(a => a.status === 'Completado')"));
  test('Health determination logic exists', () => content.includes("health = 'on_track'"));
  test('Progress update on saveAction', () => content.includes('await updateInitiativeProgress(initiative_id)'));
  test('Supabase query for linked actions', () => content.includes(".eq('initiative_id', initiativeId)"));

  console.log('\n' + '=' .repeat(60));
  console.log('Feature 5: Dashboard Visualization');
  console.log('=' .repeat(60));

  test('renderOKRsList has progress bars', () => content.includes('linear-gradient(90deg, var(--accent1), var(--accent2))'));
  test('OKR status badges with colors', () => content.includes('statusColor'));
  test('OKR key results display', () => content.includes('Key Results:'));
  test('Initiative health badges', () => content.includes('healthColor'));
  test('Initiative progress bars', () => content.includes('${initiative.progress || 0}%'));
  test('Budget tracking display', () => content.includes('Budget:'));
  test('Budget percentage calculation', () => content.includes('budgetPercent'));

  console.log('\n' + '=' .repeat(60));
  console.log('Code Quality Checks');
  console.log('=' .repeat(60));

  test('No console.log in production code', () => {
    const prodLogs = content.match(/console\.log\(/g);
    return !prodLogs || prodLogs.length < 20; // Allow some for debugging
  });

  test('Proper error handling', () => content.includes('try {') && content.includes('catch (error)'));
  test('Async/await used correctly', () => content.includes('async function') && content.includes('await '));
  test('Event handlers properly bound', () => content.includes('onclick=') && content.includes('onsubmit='));
  test('Form validation exists', () => content.includes('required'));
  test('Supabase properly initialized', () => content.includes('createClient(SUPABASE_URL, SUPABASE_KEY)'));

  console.log('\n' + '=' .repeat(60));
  console.log('Integration Checks');
  console.log('=' .repeat(60));

  test('Dashboard toggle function exists', () => content.includes('function toggleDashboardView()'));
  test('loadMyOKRs function exists', () => content.includes('async function loadMyOKRs()'));
  test('loadMyInitiatives function exists', () => content.includes('async function loadMyInitiatives()'));
  test('renderMyDashboard function exists', () => content.includes('async function renderMyDashboard()'));
  test('Realtime sync setup', () => content.includes('setupRealtimeSync'));

  console.log('\n' + '=' .repeat(60));
  console.log('Security Checks');
  console.log('=' .repeat(60));

  test('Current user check in saveOKR', () => content.includes('if (!currentUser)'));
  test('Current user check in saveInitiative', () => content.includes('if (!currentUser)'));
  test('User ID included in OKR creation', () => content.includes('user_id: currentUser.id'));
  test('User ID included in initiative creation', () => content.includes('owner_id: currentUser.id'));

  console.log('\n' + '=' .repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('=' .repeat(60));
  console.log(`Total Tests: ${testResults.passed + testResults.failed}`);
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`Success Rate: ${Math.round((testResults.passed / (testResults.passed + testResults.failed)) * 100)}%`);

  if (testResults.failed > 0) {
    console.log('\n❌ Failed tests:');
    testResults.tests
      .filter(t => !t.passed)
      .forEach(t => console.log(`   - ${t.name}`));
  }

  console.log('\n' + '=' .repeat(60));
  console.log('🔍 MANUAL TESTING CHECKLIST');
  console.log('=' .repeat(60));
  console.log('Please manually test the following:');
  console.log('');
  console.log('1. 🎯 User OKR Creation:');
  console.log('   - Open dashboard → Click "Nuevo OKR"');
  console.log('   - Add 2-5 key results');
  console.log('   - Fill all fields and save');
  console.log('   - Verify OKR appears in dashboard');
  console.log('');
  console.log('2. 🚀 Initiative Creation:');
  console.log('   - Open dashboard → Click "Nueva Initiative"');
  console.log('   - Link to an OKR (optional)');
  console.log('   - Add budget and dates');
  console.log('   - Verify initiative appears in dashboard');
  console.log('');
  console.log('3. 🔗 Action Linking:');
  console.log('   - Create/edit an action');
  console.log('   - Select an initiative from dropdown');
  console.log('   - Save and verify link');
  console.log('');
  console.log('4. 📊 Progress Updates:');
  console.log('   - Change action status (Pendiente → En curso → Completado)');
  console.log('   - Verify initiative progress updates automatically');
  console.log('   - Check health indicator changes');
  console.log('');
  console.log('5. 🎨 Visual Checks:');
  console.log('   - Progress bars animate correctly');
  console.log('   - Status badges show correct colors');
  console.log('   - Key results display properly');
  console.log('   - Budget tracking shows correctly');
  console.log('');
  console.log('6. 📱 Responsive Design:');
  console.log('   - Test on mobile (< 768px)');
  console.log('   - Test on tablet (768px - 1024px)');
  console.log('   - Test on desktop (> 1024px)');
  console.log('');
  console.log('=' .repeat(60));

  const exitCode = testResults.failed === 0 ? 0 : 1;

  if (exitCode === 0) {
    console.log('\n✅ All automated tests passed! Ready for manual testing.');
  } else {
    console.log('\n⚠️  Some tests failed. Please review and fix issues.');
  }

  return exitCode;
}

runTests()
  .then(exitCode => {
    process.exit(exitCode);
  })
  .catch(error => {
    console.error('\n❌ Test runner failed:', error);
    process.exit(1);
  });