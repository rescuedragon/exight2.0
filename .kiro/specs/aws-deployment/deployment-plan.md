# Exight AWS Deployment Plan

## Overview

This is your complete roadmap to deploy Exight expense tracker to AWS. We'll go from your current localhost app to a fully deployed web application with user authentication and database storage.

## Phase 1: AWS Account & Infrastructure Setup (Day 1-2)

### Step 1.1: AWS Account Creation

- [ ] Sign up for AWS Free Tier account
- [ ] Verify email and phone number
- [ ] Set up billing alerts (important for cost control)
- [ ] Enable MFA (Multi-Factor Authentication) for security

### Step 1.2: Create EC2 Instance (Your Server)

- [ ] Launch t2.micro EC2 instance (Ubuntu 22.04 LTS)
- [ ] Create and download key pair (.pem file) - KEEP THIS SAFE!
- [ ] Configure security group (ports 22, 80, 443, 3000, 5000)
- [ ] Allocate Elastic IP address (static IP)
- [ ] Connect to server via SSH

### Step 1.3: Set Up RDS Database

- [ ] Create PostgreSQL RDS instance (db.t3.micro)
- [ ] Configure database security group
- [ ] Create database user and password
- [ ] Test connection from EC2 to RDS

## Phase 2: Server Environment Setup (Day 2-3)

### Step 2.1: Install Required Software

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL client
sudo apt install postgresql-client -y

# Install Nginx
sudo apt install nginx -y

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Git
sudo apt install git -y
```

### Step 2.2: Configure Nginx

- [ ] Set up Nginx as reverse proxy
- [ ] Configure SSL certificate (Let's Encrypt)
- [ ] Set up domain routing

## Phase 3: Backend API Development (Day 3-5)

### Step 3.1: Database Schema Creation

```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Expenses table
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    type VARCHAR(50) NOT NULL,
    deduction_day INTEGER NOT NULL,
    is_recurring BOOLEAN NOT NULL,
    total_months INTEGER,
    remaining_months INTEGER,
    remaining_amount DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Partial payments table
CREATE TABLE partial_payments (
    id SERIAL PRIMARY KEY,
    expense_id INTEGER REFERENCES expenses(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    date TIMESTAMP NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Loans table
CREATE TABLE loans (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    person_name VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    date_given TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    total_received DECIMAL(10,2) DEFAULT 0,
    remaining_amount DECIMAL(10,2) NOT NULL,
    write_off_date TIMESTAMP,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Loan payments table
CREATE TABLE loan_payments (
    id SERIAL PRIMARY KEY,
    loan_id INTEGER REFERENCES loans(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    date TIMESTAMP NOT NULL,
    type VARCHAR(20) DEFAULT 'payment',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Step 3.2: Backend API Structure

```
backend/
├── server.js              # Main server file
├── config/
│   ├── database.js        # Database connection
│   └── auth.js           # JWT configuration
├── middleware/
│   ├── auth.js           # Authentication middleware
│   └── validation.js     # Input validation
├── routes/
│   ├── auth.js           # Login/Register routes
│   ├── expenses.js       # Expense CRUD routes
│   ├── loans.js          # Loan CRUD routes
│   └── dashboard.js      # Dashboard data routes
├── models/
│   ├── User.js           # User model
│   ├── Expense.js        # Expense model
│   └── Loan.js           # Loan model
└── package.json
```

### Step 3.3: API Endpoints to Create

```
Authentication:
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
POST /api/auth/logout      # User logout

Expenses:
GET    /api/expenses       # Get all user expenses
POST   /api/expenses       # Create new expense
PUT    /api/expenses/:id   # Update expense
DELETE /api/expenses/:id   # Delete expense
POST   /api/expenses/:id/payments  # Add partial payment

Loans:
GET    /api/loans          # Get all user loans
POST   /api/loans          # Create new loan
PUT    /api/loans/:id      # Update loan
DELETE /api/loans/:id      # Delete loan
POST   /api/loans/:id/payments     # Add loan payment

Dashboard:
GET    /api/dashboard      # Get dashboard summary data

User:
GET    /api/user/profile   # Get user profile
PUT    /api/user/profile   # Update user profile
```

## Phase 4: Frontend Integration (Day 5-6)

### Step 4.1: Add API Integration

- [ ] Create API service layer (`src/services/api.js`)
- [ ] Replace localStorage with API calls
- [ ] Add authentication context
- [ ] Update all components to use API

### Step 4.2: Add Authentication UI

- [ ] Create proper login/register forms
- [ ] Add loading states and error handling
- [ ] Implement token management
- [ ] Add logout functionality

## Phase 5: Deployment & Configuration (Day 6-7)

### Step 5.1: Deploy Backend

```bash
# Clone your repository
git clone <your-repo-url>
cd exight/backend

# Install dependencies
npm install

# Set environment variables
sudo nano /etc/environment
# Add:
# DATABASE_URL=postgresql://username:password@rds-endpoint:5432/dbname
# JWT_SECRET=your-super-secret-key
# NODE_ENV=production

# Start with PM2
pm2 start server.js --name "exight-backend"
pm2 startup
pm2 save
```

### Step 5.2: Deploy Frontend

```bash
# Build React app
cd ../frontend
npm install
npm run build

# Copy build files to Nginx
sudo cp -r build/* /var/www/html/
```

### Step 5.3: Configure Domain (Optional)

- [ ] Purchase domain from Route 53 or external provider
- [ ] Configure DNS records
- [ ] Set up SSL certificate
- [ ] Update Nginx configuration

## Phase 6: Testing & Monitoring (Day 7)

### Step 6.1: Testing

- [ ] Test all API endpoints
- [ ] Test user registration/login flow
- [ ] Test expense and loan CRUD operations
- [ ] Test on different devices/browsers

### Step 6.2: Monitoring Setup

- [ ] Set up CloudWatch for basic monitoring
- [ ] Configure log rotation
- [ ] Set up automated backups
- [ ] Create health check endpoints

## Cost Estimation (Free Tier)

### What's Free for 12 Months:

- **EC2 t2.micro**: 750 hours/month (24/7 for 1 instance)
- **RDS db.t3.micro**: 750 hours/month + 20GB storage
- **Elastic IP**: Free when attached to running instance
- **Data Transfer**: 15GB outbound per month
- **Route 53**: $0.50/month for hosted zone (only if using custom domain)

### Potential Costs After Free Tier:

- EC2 t2.micro: ~$8.50/month
- RDS db.t3.micro: ~$13/month
- Total: ~$22/month (very reasonable for a production app)

## Timeline Summary:

- **Days 1-2**: AWS setup and server configuration
- **Days 3-5**: Backend API development
- **Days 5-6**: Frontend integration
- **Days 6-7**: Deployment and testing

## What You'll Need From Me:

1. **AWS Account Setup**: I'll guide you through each step
2. **Code Development**: I'll write all the backend API code
3. **Frontend Updates**: I'll modify your React app to use APIs
4. **Deployment Scripts**: I'll provide all the commands and configurations
5. **Troubleshooting**: I'll help debug any issues

## Next Steps:

1. **Confirm this plan looks good to you**
2. **Start with AWS account creation**
3. **I'll guide you through each phase step-by-step**

Ready to start? Let me know and we'll begin with Phase 1!
