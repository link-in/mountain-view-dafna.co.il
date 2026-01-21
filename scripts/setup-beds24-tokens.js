/**
 * Setup Beds24 Tokens
 * Run this script once to convert an invite code to refresh token
 * 
 * Usage:
 *   node scripts/setup-beds24-tokens.js YOUR_INVITE_CODE_HERE
 */

const BEDS24_API_BASE = 'https://api.beds24.com/v2'

async function setupTokens(inviteCode) {
  if (!inviteCode) {
    console.error('❌ Error: No invite code provided')
    console.log('\nUsage:')
    console.log('  node scripts/setup-beds24-tokens.js YOUR_INVITE_CODE_HERE')
    console.log('\nHow to get an invite code:')
    console.log('  1. Go to https://www.beds24.com')
    console.log('  2. Settings → Account → API Keys')
    console.log('  3. Create new API key with required scopes')
    console.log('  4. Copy the invite code (valid for 24 hours)')
    process.exit(1)
  }

  try {
    console.log('🔄 Setting up Beds24 tokens...\n')
    
    const response = await fetch(`${BEDS24_API_BASE}/authentication/setup`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        code: inviteCode,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API request failed: ${response.status} ${response.statusText}\n${errorText}`)
    }

    const data = await response.json()

    console.log('✅ Setup successful!\n')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('Add these to your .env.local file:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    console.log(`BEDS24_TOKEN=${data.token}`)
    console.log(`BEDS24_REFRESH_TOKEN=${data.refreshToken}`)
    console.log('')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`Token expires in: ${data.expiresIn} seconds (${(data.expiresIn / 3600).toFixed(1)} hours)`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    console.log('📝 Note:')
    console.log('  - The access token (BEDS24_TOKEN) will be auto-refreshed')
    console.log('  - The refresh token (BEDS24_REFRESH_TOKEN) is permanent (unless unused for 30 days)')
    console.log('  - Keep the refresh token secret!')
    console.log('\n🔄 Next steps:')
    console.log('  1. Copy the tokens to your .env.local file')
    console.log('  2. Restart your development server (npm run dev)')
    console.log('  3. Add BEDS24_REFRESH_TOKEN to Vercel environment variables\n')

  } catch (error) {
    console.error('❌ Setup failed:', error.message)
    console.log('\n💡 Troubleshooting:')
    console.log('  - Make sure the invite code is correct')
    console.log('  - Invite codes expire after 24 hours')
    console.log('  - Create a new invite code in Beds24 if needed')
    process.exit(1)
  }
}

// Get invite code from command line argument
const inviteCode = process.argv[2]
setupTokens(inviteCode)
