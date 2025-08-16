# Google OAuth Setup Guide

## Current Issues Identified

### 1. redirect_uri_mismatch Error
**Error**: "Access blocked: This app's request is invalid - Error 400: redirect_uri_mismatch"
**Cause**: OAuth client has incorrect redirect URIs configured instead of JavaScript origins

### 2. Deployment Sync Issue  
**Issue**: localhost:3006 shows Google OAuth working, but testing.exight.in shows old version
**Cause**: Google Identity Services script not deploying to production

### 3. Test User Restrictions
**Issue**: OAuth client restricted to test users only

## Required OAuth Configuration

### 1. Authorized Domains
Add these domains to your Google OAuth client:
- `exight.in`
- `testing.exight.in`
- `localhost` (for development)

### 2. Authorized JavaScript Origins 
Add these JavaScript origins (NOT redirect URIs):
- `https://exight.in`
- `https://testing.exight.in`
- `http://localhost:3006` (for development)
- `http://localhost:3000` (for development)

### 3. Remove Redirect URIs
Since we're using Google Identity Services (not OAuth 2.0 redirect flow), you should:
- Remove any existing redirect URIs from the OAuth client
- Use "Authorized JavaScript origins" instead

### 4. OAuth Consent Screen
You need to either:
- **Option A**: Publish your OAuth app (recommended for production)
- **Option B**: Add test users to your OAuth consent screen

### Steps to Fix:

#### Step 1: Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/
2. Select your project
3. Go to "APIs & Services" > "Credentials"

#### Step 2: Edit OAuth Client
1. Click on your OAuth client ID: `176712194964-34r23nnq9no31e92mgkjmo1qu87c63nu`
2. **CRITICAL**: Remove all "Authorized redirect URIs" (this causes the redirect_uri_mismatch error)
3. Add "Authorized JavaScript origins":
   - `https://exight.in`
   - `https://testing.exight.in`
   - `http://localhost:3006`
4. Add Authorized domains:
   - `exight.in`
   - `testing.exight.in`

#### Step 3: Configure OAuth Consent Screen
1. Go to "APIs & Services" > "OAuth consent screen"
2. Either:
   - Click "PUBLISH APP" to make it available to all users
   - OR add your email as a test user

#### Step 4: Required Scopes
Ensure these scopes are enabled:
- `email`
- `profile`
- `openid`

## Current Client Configuration
- Client ID: `176712194964-34r23nnq9no31e92mgkjmo1qu87c63nu`
- Type: Web application
- Status: In testing (needs to be published or test users added)

## Testing Instructions
After configuration:
1. Test on localhost:3006 first
2. Test on testing.exight.in
3. Deploy to production on exight.in

## Debugging
Check browser console for specific error messages when clicking "CONTINUE WITH GOOGLE"
