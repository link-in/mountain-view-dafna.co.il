const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, 'public', 'icons');
const files = fs.readdirSync(iconsDir);

console.log('🧹 Cleaning up backup icon files...\n');

let deletedCount = 0;

files.forEach(file => {
  if (file.includes('-new.png')) {
    const filePath = path.join(iconsDir, file);
    fs.unlinkSync(filePath);
    console.log(`🗑️  Deleted: ${file}`);
    deletedCount++;
  }
});

console.log(`\n✨ Done! Deleted ${deletedCount} backup files.`);
console.log('\nFinal icons in public/icons/:');

const finalFiles = fs.readdirSync(iconsDir);
finalFiles.forEach(file => {
  console.log(`  ✅ ${file}`);
});
