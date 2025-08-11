# 🚀 Deployment Guide

This guide outlines the deployment process for different environments in Exight 2.0.

## 🌍 Deployment Stages

### 1. Development (dev)
- **Branch**: `dev`
- **URL**: `http://dev.exight.in` (or your dev server)
- **Purpose**: Testing new features and bug fixes
- **Deployment**: Automatic on push to `dev` branch

### 2. Staging (staging)
- **Branch**: `staging` (or `dev` for now)
- **URL**: `http://staging.exight.in` (or your staging server)
- **Purpose**: Pre-production testing and QA
- **Deployment**: Manual or automatic on push to `staging` branch

### 3. Production (main)
- **Branch**: `main`
- **URL**: `http://exight.in` (or your production server)
- **Purpose**: Live production environment
- **Deployment**: Manual deployment only (protected branch)

## 🔄 Deployment Workflow

### Development Deployment
```bash
# 1. Ensure you're on dev branch
git checkout dev

# 2. Pull latest changes
git pull origin dev

# 3. Create feature branch (if needed)
git checkout -b feature/your-feature-name

# 4. Make changes and commit
git add .
git commit -m "feat: your feature description"

# 5. Push to dev branch
git push origin dev

# 6. GitHub Actions will automatically deploy to dev environment
```

### Staging Deployment
```bash
# 1. Ensure dev is stable
git checkout dev
git pull origin dev

# 2. Create staging branch (if it doesn't exist)
git checkout -b staging
git push origin staging

# 3. Or merge dev to staging
git checkout staging
git merge dev
git push origin staging

# 4. GitHub Actions will deploy to staging environment
```

### Production Deployment
```bash
# 1. Ensure staging is tested and stable
git checkout staging
git pull origin staging

# 2. Create release branch
git checkout -b release/v1.0.0

# 3. Test thoroughly on staging
# 4. When ready, merge to main (via PR)
git checkout main
git pull origin main
git merge release/v1.0.0

# 5. Tag the release
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# 6. Deploy to production
./deploy.sh
```

## 🛠️ Manual Deployment Steps

### Prerequisites
1. **Environment Variables**: Create `.env` file with deployment credentials
2. **SSH Access**: Ensure SSH key has access to target server
3. **Build**: Ensure the application builds successfully

### Step-by-Step Manual Deployment
```bash
# 1. Set environment variables
export DEPLOY_HOST="your-server-ip"
export DEPLOY_USER="your-username"
export DEPLOY_KEY_PATH="/path/to/your/key.pem"

# 2. Run deployment script
./deploy.sh

# 3. Verify deployment
curl -I http://your-server-ip/
```

## 🔐 Security Considerations

### Environment Variables
- **Never commit** `.env` files to version control
- Use `.env.example` as a template
- Rotate SSH keys regularly
- Use least-privilege access for deployment users

### Server Security
- Keep servers updated
- Use firewall rules to restrict access
- Monitor access logs
- Regular security audits

## 📊 Monitoring & Rollback

### Health Checks
- Monitor application health endpoints
- Set up uptime monitoring
- Configure error alerting

### Rollback Procedure
```bash
# 1. SSH to server
ssh user@server

# 2. Restore from backup
sudo cp -r /var/www/html.backup.timestamp/* /var/www/html/

# 3. Restart services if needed
sudo systemctl restart apache2
sudo systemctl restart exight-backend.service

# 4. Verify rollback
curl -I http://your-server-ip/
```

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check Node.js version
node --version

# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Deployment Failures
```bash
# Check SSH connectivity
ssh -i /path/to/key.pem user@server "echo 'Connection successful'"

# Verify file permissions
ls -la deploy.sh
chmod +x deploy.sh

# Check environment variables
echo "Host: $DEPLOY_HOST"
echo "User: $DEPLOY_USER"
echo "Key: $DEPLOY_KEY_PATH"
```

#### Server Issues
```bash
# Check disk space
df -h

# Check service status
sudo systemctl status apache2
sudo systemctl status exight-backend.service

# Check logs
sudo tail -f /var/log/apache2/error.log
sudo journalctl -u exight-backend.service -f
```

## 📋 Deployment Checklist

### Before Deployment
- [ ] All tests pass
- [ ] Linting passes
- [ ] Build succeeds
- [ ] Environment variables configured
- [ ] SSH access verified
- [ ] Backup strategy in place

### During Deployment
- [ ] Monitor build process
- [ ] Verify file uploads
- [ ] Check service restarts
- [ ] Validate application response

### After Deployment
- [ ] Verify all endpoints work
- [ ] Check error logs
- [ ] Monitor performance metrics
- [ ] Update deployment log
- [ ] Notify team of successful deployment

## 🔗 Related Documentation

- [GitHub Actions Workflows](.github/workflows/)
- [Build Configuration](vite.config.ts)
- [Package Configuration](package.json)
- [Security Guidelines](SECURITY.md)
- [Contributing Guidelines](CONTRIBUTING.md)
