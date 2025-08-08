# Upload Instructions for Modal Fix

## Current Status
- ✅ Modal positioning fixed in local code
- ❌ Changes not deployed to server yet
- ❌ SSH connection failing

## Option 1: AWS Console (Recommended)

1. Go to AWS Console → EC2 → Instances
2. Find instance with IP: 13.60.70.116
3. Click "Connect" → "EC2 Instance Connect"
4. In the web terminal, run:

```bash
cd /var/www/html
ls -la
```

5. You can then edit files directly or upload via the web interface

## Option 2: Manual File Upload

If you can access the server, upload these files:
- `dist/index.html`
- `dist/assets/index-DNInLMtB.js`
- `dist/assets/index-BSqTl0l2.css`

## Files to Upload
The fixed files are in the `dist/` folder. Upload all contents to `/var/www/html/` on your server.

## Test After Upload
Visit http://13.60.70.116/ and test:
1. Click "Add Expense" - modal should appear centered
2. Click "Add Loan" - modal should appear centered
3. Both modals should be properly positioned on screen 