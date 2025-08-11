# 🚀 Deployment Instructions for Exight 2.0

## 📋 Prerequisites

- Node.js 18+ installed
- Access to production server (EC2: 13.60.70.116)
- PostgreSQL database access (RDS: database-1.cfiiymea6yya.eu-north-1.rds.amazonaws.com:5432)

## 🏗️ Build Process

### 1. Local Build
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Verify build output
ls -la dist/
```

### 2. Build Verification
Ensure the `dist/` folder contains:
- `index.html`
- `assets/` folder with JS and CSS files
- All static assets

## 📤 Deployment Options

### Option 1: AWS Console (Recommended)

1. **Access EC2 Instance**:
   - Go to AWS Console → EC2 → Instances
   - Find instance with IP: `13.60.70.116`
   - Click "Connect" → "EC2 Instance Connect"

2. **Navigate to Web Directory**:
   ```bash
   cd /var/www/html
   ls -la
   ```

3. **Backup Current Version**:
   ```bash
   sudo cp -r . ../html_backup_$(date +%Y%m%d_%H%M%S)
   ```

4. **Upload New Files**:
   - Use the web interface to upload files
   - Or use `scp` from your local machine

### Option 2: SCP Upload (Alternative)

```bash
# From your local project directory
scp -r dist/* user@13.60.70.116:/var/www/html/
```

### Option 3: Git Deployment

```bash
# On the server
cd /var/www/html
git pull origin main
npm install
npm run build
```

## 🔧 Server Configuration

### Apache Configuration
Ensure `/etc/apache2/sites-available/000-default.conf` includes:
```apache
<Directory /var/www/html>
    Options Indexes FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>
```

### Environment Variables
Create/update `.env` file on server:
```bash
# Database
DB_HOST=database-1.cfiiymea6yya.eu-north-1.rds.amazonaws.com
DB_PORT=5432
DB_NAME=exight
DB_USER=postgres
DB_PASSWORD=Sisi18101996!
NODE_TLS_REJECT_UNAUTHORIZED=0

# API
API_BASE_URL=http://13.60.70.116/api
```

## 🧪 Post-Deployment Testing

### 1. Basic Functionality
- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] Responsive design on mobile/desktop

### 2. Core Features
- [ ] Add Expense functionality
- [ ] Add Loan functionality
- [ ] Dashboard displays correctly
- [ ] Charts render properly

### 3. API Integration
- [ ] Backend API responds
- [ ] Database connections work
- [ ] Feedback API functional

### 4. Performance
- [ ] Page load times acceptable
- [ ] No console errors
- [ ] Lighthouse score > 80

## 🚨 Troubleshooting

### Common Issues

1. **White Screen**:
   - Check browser console for errors
   - Verify API base URL configuration
   - Check server logs

2. **API Errors**:
   - Verify database connection
   - Check environment variables
   - Test API endpoints directly

3. **Build Issues**:
   - Clear `dist/` folder
   - Run `npm run build` again
   - Check for TypeScript errors

### Logs to Check
```bash
# Apache logs
sudo tail -f /var/log/apache2/error.log
sudo tail -f /var/log/apache2/access.log

# Application logs
tail -f /var/log/exight/app.log
```

## 🔄 Rollback Procedure

If deployment fails:
```bash
# Restore backup
sudo rm -rf /var/www/html/*
sudo cp -r ../html_backup_YYYYMMDD_HHMMSS/* /var/www/html/

# Restart Apache
sudo systemctl restart apache2
```

## 📊 Monitoring

### Health Checks
- Monitor server response times
- Check error rates
- Monitor database performance

### Performance Metrics
- Core Web Vitals
- API response times
- Database query performance

## 🔐 Security Notes

- Ensure `.env` file is not publicly accessible
- Use HTTPS in production
- Regularly update dependencies
- Monitor for security vulnerabilities

---

**Last Updated**: $(date)
**Version**: 2.0.0
**Deployed By**: [Your Name] 