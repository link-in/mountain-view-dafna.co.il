/**
 * Generate hashed password for demo user
 * Run: node scripts/generate-demo-password.js
 */

const bcrypt = require('bcryptjs')

async function generateHash() {
  const password = 'demo2026'
  const saltRounds = 10
  
  console.log('🔐 Generating password hash for demo user...\n')
  console.log(`Password: ${password}`)
  
  const hash = await bcrypt.hash(password, saltRounds)
  
  console.log(`Hash: ${hash}\n`)
  console.log('✅ Copy this hash to supabase-migrations/006_create_demo_user.sql')
  console.log(`   Replace: $2b$10$YourHashedPasswordHere`)
  console.log(`   With: ${hash}`)
}

generateHash().catch(console.error)
