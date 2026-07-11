#!/usr/bin/env node

/**
 * Script to run the comprehensive database seeding
 * Usage: node runSeed.js
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🌱 Starting comprehensive database seeding...\n');

const seedProcess = spawn('node', ['comprehensiveSeed.js'], {
  cwd: __dirname,
  stdio: 'inherit'
});

seedProcess.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📝 You can now test the admin dashboard with:');
    console.log('   Admin Login: admin@disaster.gov / Admin@12345');
    console.log('   User Login: rahul.m@email.com / User@123');
    console.log('   Volunteer Login: ramesh.k@email.com / Volunteer@123');
    console.log('   Shelter Login: john.m@shelter.gov / Shelter@123');
    console.log('   Beneficiary Login: lakshmi.b@email.com / Beneficiary@123');
    console.log('\n🚀 Start the server with: npm start');
    console.log('🌐 Then visit: http://localhost:3000/admin');
  } else {
    console.error('\n❌ Database seeding failed with exit code:', code);
    process.exit(code);
  }
});

seedProcess.on('error', (error) => {
  console.error('❌ Failed to start seeding process:', error);
  process.exit(1);
});
