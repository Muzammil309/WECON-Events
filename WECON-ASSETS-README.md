# WECON MASAWAT 2025 - Asset Management Guide

This guide explains how to download, integrate, and manage all visual assets for the WECON MASAWAT 2025 website to make it completely self-contained.

## 🎯 Overview

The WECON MASAWAT 2025 website is based on the AIvent template but needs all external assets downloaded locally to:
- ✅ Work completely offline
- ✅ Remove dependency on external servers
- ✅ Ensure fast loading times
- ✅ Enable custom hosting solutions

## 📁 Project Structure

```
Event management website/
├── wecon-masawat-2025.html          # Main website file
├── assets/
│   └── aivent/                      # Downloaded AIvent assets
│       ├── images/
│       │   ├── team/                # Speaker profile images
│       │   ├── logo-light/          # Partner logos
│       │   ├── background/          # Background images
│       │   └── misc/                # Miscellaneous graphics
│       └── video/                   # Video files
├── scripts/
│   ├── setup-wecon-assets.js       # Main setup script
│   ├── download-aivent-assets.js   # Asset downloader
│   ├── update-html-assets.js       # HTML updater
│   └── upload-to-supabase.js       # Supabase uploader
└── package.json                    # Dependencies and scripts
```

## 🚀 Quick Start

### Option 1: Automatic Setup (Recommended)

Run the complete setup process with one command:

```bash
npm run assets:setup
```

This will:
1. Download all AIvent assets locally
2. Update HTML file to use local assets
3. Verify everything works properly
4. Create a backup of the original file

### Option 2: Manual Step-by-Step

If you prefer to run each step manually:

```bash
# 1. Download assets
npm run assets:download

# 2. Update HTML file
npm run assets:update-html

# 3. Test the setup
npm run assets:test
```

### Option 3: Supabase CDN Integration

To upload assets to Supabase for CDN hosting:

```bash
# Set your Supabase service key
export SUPABASE_SERVICE_KEY="your-service-key-here"

# Run setup with Supabase upload
npm run assets:setup:supabase
```

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run assets:setup` | Complete asset setup process |
| `npm run assets:setup:supabase` | Setup + upload to Supabase |
| `npm run assets:download` | Download AIvent assets only |
| `npm run assets:update-html` | Update HTML with local paths |
| `npm run assets:upload` | Upload to Supabase only |
| `npm run assets:test` | Test website functionality |
| `npm run serve:static` | Serve website locally |

## 🔧 Manual Installation

If you need to install dependencies manually:

```bash
npm install @supabase/supabase-js http-server
```

## 📊 Asset Inventory

The following assets will be downloaded:

### Images (WebP format)
- **Speaker Photos**: 3 profile images
- **Logos**: Main logo and white variant
- **Partner Logos**: 5 sponsor/partner logos
- **Graphics**: 3D rotating element and backgrounds

### Videos (MP4 format)
- **Hero Background**: Main video background

### Total Size
- Approximately 15-25 MB of assets
- All optimized for web delivery

## 🌐 Supabase Integration

### Setup Supabase Storage

1. Get your Supabase service key from the dashboard
2. Set environment variable:
   ```bash
   export SUPABASE_SERVICE_KEY="your-service-key-here"
   ```
3. Run the upload script:
   ```bash
   npm run assets:upload
   ```

### Supabase Configuration

The script will:
- Create an `aivent-assets` bucket
- Set public access permissions
- Upload all assets with proper MIME types
- Generate public URLs for CDN access

## 🧪 Testing

### Local Testing

```bash
# Test asset setup
npm run assets:test

# Serve website locally
npm run serve:static
```

Open `http://localhost:8080` to view the website.

### Verification Checklist

- [ ] Hero video background loads
- [ ] Speaker profile images display
- [ ] 3D rotating graphic works
- [ ] Partner logos in carousel
- [ ] No external AIvent URLs remain
- [ ] Website works offline

## 🔍 Troubleshooting

### Common Issues

**Assets not downloading:**
- Check internet connection
- Verify AIvent website is accessible
- Try running download script individually

**HTML not updating:**
- Ensure backup was created
- Check file permissions
- Verify asset paths are correct

**Supabase upload failing:**
- Verify service key is set correctly
- Check Supabase project permissions
- Ensure bucket creation succeeded

### Debug Commands

```bash
# Check if assets exist
ls -la assets/aivent/

# Verify HTML content
grep -n "aivent" wecon-masawat-2025.html

# Test individual scripts
node scripts/download-aivent-assets.js
node scripts/update-html-assets.js
```

## 📁 File Locations

After successful setup:

- **Original HTML**: `wecon-masawat-2025-backup.html`
- **Updated HTML**: `wecon-masawat-2025.html`
- **Local Assets**: `assets/aivent/`
- **Asset Mapping**: `asset-mapping.json`

## 🎉 Success Indicators

When setup is complete, you should see:
- ✅ All assets downloaded successfully
- ✅ HTML file updated with local paths
- ✅ Backup file created
- ✅ Website loads without external dependencies
- ✅ All images and videos display properly

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all dependencies are installed
3. Ensure you have proper file permissions
4. Try running scripts individually for debugging

---

**WECON MASAWAT 2025** - Web Conference & Technology Summit
*Powered by TechHub Pakistan*
