/**
 * Validation Tests for Nevent Roadmap
 *
 * Simple validation tests to ensure the application
 * maintains its core functionality after agent changes
 */

import fs from 'fs/promises';
import path from 'path';

const projectRoot = process.cwd();
const indexPath = path.join(projectRoot, 'index.html');

class ValidationTests {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  async loadIndexFile() {
    try {
      this.indexContent = await fs.readFile(indexPath, 'utf-8');
      return true;
    } catch (error) {
      console.error('❌ Failed to load index.html:', error.message);
      return false;
    }
  }

  test(name, fn) {
    this.tests.push({ name, fn });
  }

  async runTests() {
    console.log('\n🧪 Running Validation Tests');
    console.log('='.repeat(60));

    for (const { name, fn } of this.tests) {
      try {
        const result = await fn();
        if (result) {
          console.log(`✅ ${name}`);
          this.passed++;
        } else {
          console.log(`❌ ${name}`);
          this.failed++;
        }
      } catch (error) {
        console.log(`❌ ${name} - Error: ${error.message}`);
        this.failed++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`📊 Results: ${this.passed} passed, ${this.failed} failed`);
    console.log('='.repeat(60));

    return this.failed === 0;
  }
}

// Initialize test suite
const suite = new ValidationTests();

// Load index.html
await suite.loadIndexFile();

// Define tests
suite.test('HTML structure is valid', () => {
  return suite.indexContent.includes('<!DOCTYPE html>') &&
         suite.indexContent.includes('</html>');
});

suite.test('Has proper charset declaration', () => {
  return suite.indexContent.includes('charset="UTF-8"');
});

suite.test('Supabase library is imported', () => {
  return suite.indexContent.includes('@supabase/supabase-js');
});

suite.test('Supabase client is initialized', () => {
  return suite.indexContent.includes('createClient') &&
         suite.indexContent.includes('SUPABASE_URL') &&
         suite.indexContent.includes('SUPABASE_KEY');
});

suite.test('Supabase URL is configured', () => {
  return suite.indexContent.includes('https://tvbqzqripcevaryquhfg.supabase.co');
});

suite.test('Authentication flow exists', () => {
  return suite.indexContent.includes('handleLogin') &&
         suite.indexContent.includes('signInWithPassword');
});

suite.test('Logout functionality exists', () => {
  return suite.indexContent.includes('handleLogout') &&
         suite.indexContent.includes('signOut');
});

suite.test('Session checking exists', () => {
  return suite.indexContent.includes('checkSession') &&
         suite.indexContent.includes('getSession');
});

suite.test('Realtime sync is configured', () => {
  return suite.indexContent.includes('.channel(') &&
         suite.indexContent.includes('postgres_changes');
});

suite.test('Roadmap data structure exists', () => {
  return suite.indexContent.includes('roadmapData') &&
         suite.indexContent.includes('quarters');
});

suite.test('CRUD operations exist', () => {
  return suite.indexContent.includes('saveToSupabase') &&
         suite.indexContent.includes('deleteFromSupabase') &&
         suite.indexContent.includes('loadData');
});

suite.test('UI rendering functions exist', () => {
  return suite.indexContent.includes('renderTimeline') &&
         suite.indexContent.includes('updateStats');
});

suite.test('Modal system exists', () => {
  return suite.indexContent.includes('openAddActionModal') &&
         suite.indexContent.includes('closeModal') &&
         suite.indexContent.includes('actionModal');
});

suite.test('Action form exists', () => {
  return suite.indexContent.includes('actionForm') &&
         suite.indexContent.includes('saveAction');
});

suite.test('Login page structure exists', () => {
  return suite.indexContent.includes('loginPage') &&
         suite.indexContent.includes('loginForm');
});

suite.test('Main app structure exists', () => {
  return suite.indexContent.includes('mainApp') &&
         suite.indexContent.includes('timeline');
});

suite.test('Dashboard functionality exists', () => {
  return suite.indexContent.includes('toggleDashboardView') &&
         suite.indexContent.includes('renderMyDashboard');
});

suite.test('OKRs functionality exists', () => {
  return suite.indexContent.includes('loadMyOKRs') &&
         suite.indexContent.includes('user_okrs');
});

suite.test('Initiatives functionality exists', () => {
  return suite.indexContent.includes('loadMyInitiatives') &&
         suite.indexContent.includes('initiatives');
});

suite.test('Departments functionality exists', () => {
  return suite.indexContent.includes('loadDepartments') &&
         suite.indexContent.includes('departments');
});

suite.test('CSS styling exists', () => {
  return suite.indexContent.includes('<style>') &&
         suite.indexContent.includes('</style>') &&
         suite.indexContent.includes(':root');
});

suite.test('Dark theme variables exist', () => {
  return suite.indexContent.includes('--bg:') &&
         suite.indexContent.includes('--accent1:') &&
         suite.indexContent.includes('--accent2:');
});

suite.test('Responsive design exists', () => {
  return suite.indexContent.includes('@media') &&
         suite.indexContent.includes('max-width');
});

suite.test('JavaScript is present', () => {
  return suite.indexContent.includes('<script>') &&
         suite.indexContent.includes('</script>');
});

suite.test('No obvious syntax errors in HTML', () => {
  const openTags = (suite.indexContent.match(/<(?!\/)[^>]+>/g) || []).length;
  const closeTags = (suite.indexContent.match(/<\/[^>]+>/g) || []).length;
  // Allow some variance for self-closing tags
  return Math.abs(openTags - closeTags) < 50;
});

suite.test('File size is reasonable (< 100KB)', () => {
  return suite.indexContent.length < 100000;
});

// Run all tests
const success = await suite.runTests();

process.exit(success ? 0 : 1);