# Local Setup Guide

This guide walks you through setting up HOS Hospital Management System on your local development machine.

## Prerequisites

- **Node.js**: v18.17.0 or higher
- **npm** or **yarn**: Latest version
- **PostgreSQL**: v14 or higher
- **Git**: Latest version

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd hos-system
```

## Step 2: Install Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install
```

## Step 3: Set Up PostgreSQL Database

### Option A: Using Local PostgreSQL

1. Install PostgreSQL if not already installed:
   - **macOS**: `brew install postgresql`
   - **Ubuntu**: `sudo apt install postgresql postgresql-contrib`
   - **Windows**: Download from https://www.postgresql.org/download/windows/

2. Start PostgreSQL service:
   ```bash
   # macOS
   brew services start postgresql
   
   # Ubuntu
   sudo systemctl start postgresql
   ```

3. Create database:
   ```bash
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE hos_db;
   
   # Exit
   \q
   ```

### Option B: Using Docker

```bash
docker run --name hos-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=hos_db \
  -p 5432:5432 \
  -d postgres:14
```

## Step 4: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and update the following:

   ```env
   # Database
   DATABASE_URL="postgresql://postgres:password@localhost:5432/hos_db?schema=public"
   
   # Authentication
   NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
   NEXTAUTH_URL="http://localhost:3000"
   JWT_SECRET="your-jwt-secret-key"
   
   # Google OAuth (optional, for patient SSO)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # OpenAI (optional, for AI features)
   OPENAI_API_KEY="sk-your-openai-api-key"
   AI_ENABLED="true"
   ```

3. Generate secrets:
   ```bash
   # Generate NEXTAUTH_SECRET
   openssl rand -base64 32
   
   # Generate JWT_SECRET
   openssl rand -base64 32
   ```

## Step 5: Set Up Database Schema

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Verify schema
npx prisma studio
```

## Step 6: Seed the Database

```bash
# Run seed script
npm run db:seed
```

This will create:
- 1 Demo Tenant
- 8 Departments
- 4 Wards with beds
- 25+ Staff users (doctors, nurses, lab techs, etc.)
- 20 Patients
- Sample appointments, encounters, prescriptions
- Sample inventory, invoices, campaigns

## Step 7: Start Development Server

```bash
npm run dev
```

The application will be available at: http://localhost:3000

## Step 8: Access the Application

1. Open http://localhost:3000 in your browser
2. You'll be redirected to the login page
3. Use demo credentials:
   - Admin: `admin@hos.com` / `Admin@123`
   - Doctor: `doctor1@hos.com` / `Doctor@123`
   - Patient: `patient1@mail.com` / `Patient@123`

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run migrations (dev)
npm run db:push          # Push schema changes
npm run db:seed          # Seed database
npm run db:reset         # Reset database (keeps super admin)
npm run db:studio        # Open Prisma Studio

# Production migrations
npm run db:migrate:prod  # Run migrations (production)
```

## Troubleshooting

### Database Connection Failed

1. Verify PostgreSQL is running:
   ```bash
   pg_isready
   ```

2. Check connection string format in `.env`

3. Verify database exists:
   ```bash
   psql -U postgres -c "\l"
   ```

### Prisma Client Not Generated

```bash
npx prisma generate
```

### Port 3000 Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process or use different port
PORT=3001 npm run dev
```

### Node Version Issues

```bash
# Check Node version
node --version

# Use nvm to switch versions
nvm install 18
nvm use 18
```

## Next Steps

- [Configuration Guide](CONFIGURATION.md) - Customize settings
- [AI Integration Guide](AI_INTEGRATION.md) - Enable AI features
- [API Documentation](API_DOCUMENTATION.md) - API reference
