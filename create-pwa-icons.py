#!/usr/bin/env python3
"""
Generate all PWA icons from the HOSTLY logo
"""

from PIL import Image
import os

# Source logo
SOURCE_LOGO = 'public/photos/hostly-logo.png'
OUTPUT_DIR = 'public/icons'

# Icon sizes needed for PWA
ICON_SIZES = [
    (72, 'icon-72x72.png'),
    (96, 'icon-96x96.png'),
    (128, 'icon-128x128.png'),
    (144, 'icon-144x144.png'),
    (152, 'icon-152x152.png'),
    (192, 'icon-192x192.png'),  # Required for Android
    (384, 'icon-384x384.png'),
    (512, 'icon-512x512.png'),  # Required for Android
    (180, 'apple-touch-icon.png'),  # Required for iOS
]

def create_icons():
    """Generate all PWA icons from source logo"""
    
    # Create output directory if it doesn't exist
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        print(f"✅ Created directory: {OUTPUT_DIR}")
    
    # Check if source logo exists
    if not os.path.exists(SOURCE_LOGO):
        print(f"❌ Error: Source logo not found at {SOURCE_LOGO}")
        return False
    
    # Load the source image
    try:
        img = Image.open(SOURCE_LOGO)
        print(f"📸 Loaded logo: {SOURCE_LOGO}")
        print(f"   Original size: {img.size}")
        
        # Convert to RGBA if needed (for transparency support)
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        
        # Generate each icon size
        success_count = 0
        for size, filename in ICON_SIZES:
            try:
                # Resize image with high-quality resampling
                resized = img.resize((size, size), Image.Resampling.LANCZOS)
                
                # Save the icon
                output_path = os.path.join(OUTPUT_DIR, filename)
                resized.save(output_path, 'PNG', optimize=True)
                
                print(f"✅ Created: {filename} ({size}×{size})")
                success_count += 1
                
            except Exception as e:
                print(f"❌ Failed to create {filename}: {str(e)}")
        
        print(f"\n🎉 Done! Created {success_count}/{len(ICON_SIZES)} icons successfully!")
        print(f"📁 Icons saved in: {OUTPUT_DIR}")
        
        return success_count == len(ICON_SIZES)
        
    except Exception as e:
        print(f"❌ Error loading logo: {str(e)}")
        return False

if __name__ == '__main__':
    print("🚀 PWA Icon Generator for HOSTLY")
    print("=" * 50)
    
    if create_icons():
        print("\n✨ All icons created successfully!")
        print("\nNext steps:")
        print("1. Check the icons in public/icons/")
        print("2. Test your PWA on mobile devices")
        print("3. Run Lighthouse audit in Chrome DevTools")
    else:
        print("\n⚠️  Some icons failed to generate. Please check the errors above.")
