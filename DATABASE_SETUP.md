# Database Setup Guide for Exight

This guide will help you set up the PostgreSQL database and backend server for your Exight expense tracking application.

## Prerequisites

1. **PostgreSQL** - Make sure PostgreSQL is installed and running
2. **pgAdmin4** - You've already downloaded and set this up
3. **Node.js** - Version 16 or higher

## Step 1: Database Configuration

### 1.1 Update Environment Variables

Create a `.env` file in the `server` directory:

```bash
cd server
cp env.example .env
```

Edit the `.env` file with your database credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=Exight
DB_USER=postgres
DB_PASSWORD=your_actual_password_here

# JWT Secret (generate a secure random string)
JWT_SECRET=your_secure_jwt_secret_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 1.2 Generate JWT Secret

You can generate a secure JWT secret using:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Step 2: Install Backend Dependencies

```bash
cd server
npm install
```

## Step 3: Initialize Database

### 3.1 Create Database Schema

Run the database initialization script:

```bash
npm run init-db
```

This will:
- Create the `users` table
- Create the `expenses` table  
- Create the `partial_payments` table
- Set up indexes and triggers
- Test the database connection

### 3.2 Verify Database Setup

In pgAdmin4, you should now see:
- `users` table with columns: id, email, password_hash, first_name, last_name, created_at, updated_at
- `expenses` table with columns: id, user_id, name, amount, currency, type, deduction_day, is_recurring, total_months, remaining_months, remaining_amount, created_at, updated_at
- `partial_payments` table with columns: id, expense_id, amount, payment_date, description, created_at

## Step 4: Start the Backend Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## Step 5: Test the API

### 5.1 Health Check

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Exight API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 5.2 Test Registration

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### 5.3 Test Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Step 6: Frontend Integration

### 6.1 Update Frontend Environment

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### 6.2 Start Frontend

```bash
# From the root directory
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Expenses
- `GET /api/expenses` - Get all expenses (protected)
- `GET /api/expenses/:id` - Get single expense (protected)
- `POST /api/expenses` - Create new expense (protected)
- `PUT /api/expenses/:id` - Update expense (protected)
- `DELETE /api/expenses/:id` - Delete expense (protected)

### Payments
- `POST /api/expenses/:id/payments` - Add partial payment (protected)
- `DELETE /api/expenses/:id/payments/:paymentId` - Delete payment (protected)

## Troubleshooting

### Database Connection Issues

1. **Check PostgreSQL is running:**
   ```bash
   brew services list | grep postgresql
   ```

2. **Verify database exists:**
   ```bash
   psql -U postgres -l
   ```

3. **Test connection:**
   ```bash
   psql -U postgres -d Exight -c "SELECT NOW();"
   ```

### Common Issues

1. **"password authentication failed"** - Check your DB_PASSWORD in .env
2. **"database does not exist"** - Create the database in pgAdmin4
3. **"port already in use"** - Change PORT in .env or kill the process using port 5000

### Reset Database

If you need to reset the database:

```sql
-- In pgAdmin4 SQL Editor
DROP TABLE IF EXISTS partial_payments CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

Then run `npm run init-db` again.

## Security Notes

1. **Never commit your .env file** - It's already in .gitignore
2. **Use strong passwords** - For both database and JWT secret
3. **HTTPS in production** - Always use HTTPS in production
4. **Rate limiting** - Consider adding rate limiting for production

## Next Steps

1. Test the login/registration flow in your frontend
2. Implement expense creation and management
3. Add error handling and loading states
4. Implement logout functionality
5. Add user profile management

Your database is now ready to handle user authentication and expense tracking for your Exight application! 