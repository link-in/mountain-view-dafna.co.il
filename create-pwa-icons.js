/**
 * Generate all PWA icons from the HOSTLY logo
 * Run: node create-pwa-icons.js
 */

const fs = require('fs');
const path = require('path');

// We'll use sharp for image processing
// Install it first: npm install sharp

async function createIcons() {
  console.log('🚀 PWA Icon Generator for HOSTLY');
  console.log('='.repeat(50));

  // Check if sharp is installed
  let sharp;
  try {
    sharp = require('sharp');
  } catch (err) {
    console.log('❌ sharp is not installed.');
    console.log('\n📦 Please install it first:');
    console.log('   npm install sharp');
    console.log('\nThen run this script again:');
    console.log('   node create-pwa-icons.js');
    process.exit(1);
  }

  const SOURCE_LOGO = path.join(__dirname, 'public', 'photos', 'hostly-logo.png');
  const OUTPUT_DIR = path.join(__dirname, 'public', 'icons');

  // Icon sizes needed for PWA
  const ICON_SIZES = [
    { size: 72, name: 'icon-72x72.png' },
    { size: 96, name: 'icon-96x96.png' },
    { size: 128, name: 'icon-128x128.png' },
    { size: 144, name: 'icon-144x144.png' },
    { size: 152, name: 'icon-152x152.png' },
    { size: 192, name: 'icon-192x192.png' },  // Required for Android
    { size: 384, name: 'icon-384x384.png' },
    { size: 512, name: 'icon-512x512.png' },  // Required for Android
    { size: 180, name: 'apple-touch-icon.png' },  // Required for iOS
  ];

  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`✅ Created directory: ${OUTPUT_DIR}`);
  }

  // Check if source logo exists
  if (!fs.existsSync(SOURCE_LOGO)) {
    console.log(`❌ Error: Source logo not found at ${SOURCE_LOGO}`);
    return false;
  }

  console.log(`📸 Loading logo: ${SOURCE_LOGO}`);

  try {
    // Get original image metadata
    const metadata = await sharp(SOURCE_LOGO).metadata();
    console.log(`   Original size: ${metadata.width}×${metadata.height}`);

    let successCount = 0;

    // Generate each icon size
    for (const { size, name } of ICON_SIZES) {
      try {
        const outputPath = path.join(OUTPUT_DIR, name);
        
        await sharp(SOURCE_LOGO)
          .resize(size, size, {
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 0 }
          })
          .png()
          .toFile(outputPath);

        console.log(`✅ Created: ${name} (${size}×${size})`);
        successCount++;
      } catch (err) {
        console.log(`❌ Failed to create ${name}: ${err.message}`);
      }
    }

    console.log(`\n🎉 Done! Created ${successCount}/${ICON_SIZES.length} icons successfully!`);
    console.log(`📁 Icons saved in: ${OUTPUT_DIR}`);

    if (successCount === ICON_SIZES.length) {
      console.log('\n✨ All icons created successfully!');
      console.log('\nNext steps:');
      console.log('1. Check the icons in public/icons/');
      console.log('2. Test your PWA on mobile devices');
      console.log('3. Run Lighthouse audit in Chrome DevTools');
      return true;
    } else {
      console.log('\n⚠️  Some icons failed to generate.');
      return false;
    }

  } catch (err) {
    console.log(`❌ Error processing logo: ${err.message}`);
    return false;
  }
}

// Run the script
createIcons().catch(err => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});
