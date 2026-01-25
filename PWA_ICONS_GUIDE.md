# 📱 PWA Icons Setup Guide

## Required Icons

You need to create and place the following icons in the `/public/icons/` folder:

### Android/Chrome Icons (PNG format)
- `icon-72x72.png` - 72×72 pixels
- `icon-96x96.png` - 96×96 pixels
- `icon-128x128.png` - 128×128 pixels
- `icon-144x144.png` - 144×144 pixels
- `icon-152x152.png` - 152×152 pixels
- `icon-192x192.png` - 192×192 pixels (required for Android)
- `icon-384x384.png` - 384×384 pixels
- `icon-512x512.png` - 512×512 pixels (required for Android)

### iOS/Apple Icons
- `apple-touch-icon.png` - 180×180 pixels

## Folder Structure

Create this structure:
```
public/
  ├── icons/
  │   ├── icon-72x72.png
  │   ├── icon-96x96.png
  │   ├── icon-128x128.png
  │   ├── icon-144x144.png
  │   ├── icon-152x152.png
  │   ├── icon-192x192.png
  │   ├── icon-384x384.png
  │   ├── icon-512x512.png
  │   └── apple-touch-icon.png
  ├── manifest.json
  └── robots.txt
```

## How to Generate Icons

### Option 1: Using Online Tools (Easiest)
1. Go to https://realfavicongenerator.net/ or https://www.pwabuilder.com/imageGenerator
2. Upload your logo (ideally 512×512 PNG with transparent background)
3. Download the generated icons
4. Place them in `/public/icons/`

### Option 2: Using Image Editing Software
1. Start with a high-quality logo (at least 512×512 pixels)
2. Export/resize to each required size
3. Save as PNG with transparency (if desired)
4. Ensure the logo looks good at small sizes (test 72×72 especially)

### Option 3: Using Command Line (ImageMagick)
```bash
# Install ImageMagick first, then run:
convert logo.png -resize 72x72 public/icons/icon-72x72.png
convert logo.png -resize 96x96 public/icons/icon-96x96.png
convert logo.png -resize 128x128 public/icons/icon-128x128.png
convert logo.png -resize 144x144 public/icons/icon-144x144.png
convert logo.png -resize 152x152 public/icons/icon-152x152.png
convert logo.png -resize 192x192 public/icons/icon-192x192.png
convert logo.png -resize 384x384 public/icons/icon-384x384.png
convert logo.png -resize 512x512 public/icons/icon-512x512.png
convert logo.png -resize 180x180 public/icons/apple-touch-icon.png
```

## Design Tips

1. **Keep it simple** - Icons should be recognizable at small sizes
2. **Use solid colors** - Avoid gradients for better clarity at small sizes
3. **Add padding** - Leave ~10% padding around the main icon
4. **Test on devices** - Check how it looks on actual phones
5. **Consider dark mode** - If your icon has transparency, test on dark backgrounds

## Using Your Logo

If you want to use the HOSTLY logo from `/public/photos/hostly-logo.png`:
1. Open it in an image editor
2. Resize to 512×512 with padding
3. Export to all required sizes
4. Place in `/public/icons/`

## Testing Your PWA

### On Chrome/Android:
1. Open your site in Chrome
2. Click the three dots menu
3. Select "Install app" or "Add to Home Screen"
4. The app should open in standalone mode (no browser UI)

### On Safari/iOS:
1. Open your site in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. Give it a name and add
5. The app should open without Safari's address bar

## Next Steps

After adding icons:
1. Clear browser cache
2. Test on both iOS and Android
3. Verify the manifest loads: `https://yourdomain.com/manifest.json`
4. Check with Lighthouse PWA audit in Chrome DevTools
5. Update the sitemap.ts with your actual domain

## Environment Variables

Don't forget to set in your `.env.local`:
```
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```
