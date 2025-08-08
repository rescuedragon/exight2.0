#!/bin/bash

echo "🚀 Starting deployment..."

# Build the app
echo "📦 Building app..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

# Try to upload to server
echo "📤 Uploading to server..."
scp -i ~/Desktop/AWS/exight-key-pair.pem -r dist/* ubuntu@13.60.70.116:/var/www/html/

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your app is live at: http://13.60.70.116/"
else
    echo "❌ Upload failed! SSH key issue."
    echo "💡 Try using AWS Console to upload files manually."
    echo "📁 Files to upload are in the 'dist/' folder"
fi 