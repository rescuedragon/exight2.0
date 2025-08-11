#!/bin/bash

# Security: Exit on any error and undefined variables
set -euo pipefail

# Load environment variables if .env file exists
if [ -f ".env" ]; then
    echo "📁 Loading environment variables from .env file..."
    export $(cat .env | grep -v '^#' | xargs)
fi

# Check required environment variables
if [ -z "${DEPLOY_HOST:-}" ] || [ -z "${DEPLOY_USER:-}" ] || [ -z "${DEPLOY_KEY_PATH:-}" ]; then
    echo "❌ Missing required environment variables!"
    echo "Please set the following variables:"
    echo "  DEPLOY_HOST - Server hostname/IP"
    echo "  DEPLOY_USER - SSH username"
    echo "  DEPLOY_KEY_PATH - Path to SSH private key"
    echo ""
    echo "You can create a .env file with:"
    echo "  DEPLOY_HOST=your-server-ip"
    echo "  DEPLOY_USER=your-username"
    echo "  DEPLOY_KEY_PATH=/path/to/your/key.pem"
    exit 1
fi

echo "🚀 Starting deployment to ${DEPLOY_HOST}..."

# Validate SSH key exists and has correct permissions
if [ ! -f "$DEPLOY_KEY_PATH" ]; then
    echo "❌ SSH key not found at: $DEPLOY_KEY_PATH"
    exit 1
fi

# Set proper permissions on SSH key
chmod 600 "$DEPLOY_KEY_PATH"

# Build the app
echo "📦 Building app..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

# Verify build artifacts and integrity
echo "🔍 Verifying build artifacts..."
if [ ! -d "dist" ]; then
    echo "❌ dist directory not found"
    exit 1
fi

if [ ! -f "dist/index.html" ]; then
    echo "❌ index.html not found in dist"
    exit 1
fi

# Check file sizes and integrity
echo "📊 Build artifact analysis:"
total_size=0
file_count=0

for file in dist/**/*; do
    if [ -f "$file" ]; then
        file_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo "0")
        total_size=$((total_size + file_size))
        file_count=$((file_count + 1))
        echo "  📁 $file: $((file_size / 1024)) KB"
    fi
done

echo "📦 Total build size: $((total_size / 1024)) KB ($file_count files)"

# Check if build is too large (e.g., > 10MB)
if [ $total_size -gt 10485760 ]; then
    echo "⚠️  Warning: Build size is large ($((total_size / 1024)) KB)"
    echo "   Consider optimizing bundle size"
fi

# Generate checksums for integrity verification
echo "🔐 Generating checksums..."
if command -v sha256sum >/dev/null 2>&1; then
    find dist -type f -exec sha256sum {} \; > dist/checksums.sha256
    echo "✅ Checksums generated: dist/checksums.sha256"
elif command -v shasum >/dev/null 2>&1; then
    find dist -type f -exec shasum -a 256 {} \; > dist/checksums.sha256
    echo "✅ Checksums generated: dist/checksums.sha256"
else
    echo "⚠️  Warning: No checksum tool available"
fi

# Try to upload to server
echo "📤 Uploading to server..."
scp -i "$DEPLOY_KEY_PATH" -o StrictHostKeyChecking=no -r dist/* "${DEPLOY_USER}@${DEPLOY_HOST}:/var/www/html/"

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your app is live at: http://${DEPLOY_HOST}/"
else
    echo "❌ Upload failed! SSH key issue."
    echo "💡 Check your SSH key and server configuration."
    echo "📁 Files to upload are in the 'dist/' folder"
    exit 1
fi 