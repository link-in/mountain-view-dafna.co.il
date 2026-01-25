/**
 * Copy icons from downloaded PWABuilder package
 * Run: node copy-downloaded-icons.js
 */

const fs = require('fs');
const path = require('path');

const SOURCE_DIR = 'C:\\Users\\zurbr\\Downloads\\AppImages-extracted';
const DEST_DIR = path.join(__dirname, 'public', 'icons');

// Mapping: source file -> destination file
const iconMappings = [
  // Android icons
  ['android/android-launchericon-72-72.png', 'icon-72x72.png'],
  ['android/android-launchericon-96-96.png', 'icon-96x96.png'],
  ['android/android-launchericon-144-144.png', 'icon-144x144.png'],
  ['android/android-launchericon-192-192.png', 'icon-192x192.png'],
  ['android/android-launchericon-512-512.png', 'icon-512x512.png'],
  
  // iOS icons
  ['ios/128.png', 'icon-128x128.png'],
  ['ios/152.png', 'icon-152x152.png'],
  ['ios/180.png', 'apple-touch-icon.png'], // Apple touch icon
  
  // We need 384x384, but PWABuilder might not have it
  // We'll check for it or use 512 scaled down
];

// For 384, we can use the 512 if 384 doesn't exist
const optional384 = ['ios/384.png', 'icon-384x384.png'];

console.log('📋 Copying icons from PWABuilder package...\n');

let copiedCount = 0;
let missingCount = 0;

for (const [source, dest] of iconMappings) {
  const sourcePath = path.join(SOURCE_DIR, source);
  const destPath = path.join(DEST_DIR, dest);
  
  if (fs.existsSync(sourcePath)) {
    try {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`✅ Copied: ${dest}`);
      copiedCount++;
    } catch (err) {
      console.log(`❌ Failed to copy ${dest}: ${err.message}`);
    }
  } else {
    console.log(`⚠️  Missing: ${source}`);
    missingCount++;
  }
}

// Try to copy 384x384
const source384 = path.join(SOURCE_DIR, optional384[0]);
const dest384 = path.join(DEST_DIR, optional384[1]);

if (fs.existsSync(source384)) {
  fs.copyFileSync(source384, dest384);
  console.log(`✅ Copied: ${optional384[1]}`);
  copiedCount++;
} else {
  // Use existing 384 or note it's missing
  console.log(`ℹ️  384x384 not in package (using existing or generated one)`);
}

console.log(`\n🎉 Done! Copied ${copiedCount} icons.`);
if (missingCount > 0) {
  console.log(`⚠️  ${missingCount} icons were missing from the package.`);
}

console.log('\nNext steps:');
console.log('1. Check public/icons/ to compare old vs new icons');
console.log('2. If new icons look better, you can keep them');
console.log('3. Otherwise, the generated icons are already good!');
