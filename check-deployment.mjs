#!/usr/bin/env node
/**
 * Check GitHub Pages deployment status
 */

const PRODUCTION_URL = 'https://franferrer12.github.io/Nevent-MKT-Roadmap/';

console.log('\n🔍 CHECKING DEPLOYMENT STATUS\n');
console.log(`Target: ${PRODUCTION_URL}`);
console.log('Waiting for GitHub Pages build...\n');

let attempts = 0;
const maxAttempts = 12; // 2 minutes (12 * 10 seconds)

const checkDeployment = async () => {
  attempts++;

  try {
    const response = await fetch(PRODUCTION_URL, { method: 'HEAD' });

    if (response.ok) {
      console.log('✅ DEPLOYMENT SUCCESSFUL!\n');
      console.log('Your site is live at:');
      console.log(`   ${PRODUCTION_URL}\n`);

      console.log('🧪 READY FOR TESTING:');
      console.log('   1. Open the URL above');
      console.log('   2. Login: ceo@nevent.es / Test1234!');
      console.log('   3. Test all features\n');

      console.log('📊 Progress Dashboard:');
      console.log(`   ${PRODUCTION_URL}progress-dashboard.html\n`);

      process.exit(0);
    } else {
      throw new Error(`Status: ${response.status}`);
    }
  } catch (error) {
    if (attempts >= maxAttempts) {
      console.log('⏱️  Timeout reached (2 minutes)');
      console.log('\nManual check required:');
      console.log(`   ${PRODUCTION_URL}\n`);
      console.log('If not ready, wait a bit longer and try again.');
      process.exit(1);
    }

    console.log(`⏳ Attempt ${attempts}/${maxAttempts}: Not ready yet...`);
    setTimeout(checkDeployment, 10000); // Check every 10 seconds
  }
};

// Start checking
checkDeployment();