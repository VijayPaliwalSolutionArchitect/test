# Configuration Guide

This guide explains all configuration options available in HOS Hospital Management System.

## Environment Variables

### Database Configuration

```env
# PostgreSQL Connection String
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

| Variable | Description | Example |
|----------|-------------|----------|
| USER | Database username | postgres |
| PASSWORD | Database password | your-password |
| HOST | Database host | localhost |
| PORT | Database port | 5432 |
| DATABASE | Database name | hos_db |

### Authentication Configuration

```env
# NextAuth.js
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# JWT
JWT_SECRET="your-jwt-secret"
JWT_EXPIRATION="604800"  # 7 days in seconds
```

**Generating Secrets:**

```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Google OAuth (Patient SSO)

```env
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

**Setup Steps:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable "Google+ API"
4. Go to Credentials > Create Credentials > OAuth Client ID
5. Set authorized redirect URI: `https://your-domain.com/api/auth/callback/google`
6. Copy Client ID and Secret

### OpenAI Configuration (AI Features)

```env
OPENAI_API_KEY="sk-your-api-key"
OPENAI_MODEL="gpt-4-turbo-preview"

# Feature Flags
AI_ENABLED="true"
AI_CLINICAL_COPILOT_ENABLED="true"
AI_PATIENT_ASSISTANT_ENABLED="true"
```

**Available Models:**
- `gpt-4-turbo-preview` (recommended)
- `gpt-4`
- `gpt-3.5-turbo`

### Stripe Configuration (Payments)

```env
STRIPE_SECRET_KEY="sk_live_your-secret-key"
STRIPE_PUBLISHABLE_KEY="pk_live_your-publishable-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"
```

### Email Configuration (SMTP)

```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="HOS <noreply@hos.com>"
```

**Gmail App Password:**

1. Enable 2FA on your Google account
2. Go to Security > App passwords
3. Generate new app password
4. Use this password (not your regular password)

### Redis Configuration (Optional)

```env
REDIS_URL="redis://localhost:6379"
```

Used for:
- Session storage
- Caching
- Event queues

### Application Settings

```env
# Application URL
APP_URL="http://localhost:3000"

# Multi-tenancy
DEFAULT_TENANT_ID=""  # Leave empty for auto-detect
MULTI_TENANT_ENABLED="true"

# Debug
DEBUG_MODE="true"  # Set to "false" in production
LOG_LEVEL="debug"  # debug | info | warn | error
```

### Security Settings

```env
# Rate Limiting
RATE_LIMIT_RPM="100"  # Requests per minute

# Session
SESSION_TIMEOUT="60"  # Minutes

# Password Policy
PASSWORD_MIN_LENGTH="8"
PASSWORD_REQUIRE_UPPERCASE="true"
PASSWORD_REQUIRE_NUMBER="true"
PASSWORD_REQUIRE_SPECIAL="true"
```

## Prisma Configuration

### Schema File Location

```
prisma/schema.prisma
```

### Key Model Configurations

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Next.js Configuration

### next.config.js

```javascript
const nextConfig = {
  reactStrictMode: true,
  
  // Server Actions
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Environment variables for client
  env: {
    NEXT_PUBLIC_APP_NAME: 'HOS',
  },
};
```

## Tailwind Configuration

### Color Customization

Edit `tailwind.config.ts` to customize role-based colors:

```typescript
colors: {
  admin: {
    DEFAULT: '#3B82F6',
    light: '#60A5FA',
    dark: '#2563EB',
  },
  doctor: {
    DEFAULT: '#2563EB',
    // ...
  },
  // Other role colors...
}
```

## Feature Flags

### Enabling/Disabling Features

```typescript
// src/lib/config.ts
export const FEATURES = {
  AI_COPILOT: process.env.AI_CLINICAL_COPILOT_ENABLED === 'true',
  AI_ASSISTANT: process.env.AI_PATIENT_ASSISTANT_ENABLED === 'true',
  MULTI_TENANT: process.env.MULTI_TENANT_ENABLED === 'true',
  GOOGLE_SSO: !!process.env.GOOGLE_CLIENT_ID,
  STRIPE_PAYMENTS: !!process.env.STRIPE_SECRET_KEY,
};
```

## Tenant Configuration

### Default Tenant Settings

```typescript
// Stored in database (Tenant.settings JSON)
{
  "timezone": "Asia/Kolkata",
  "currency": "INR",
  "dateFormat": "DD/MM/YYYY",
  "appointmentDuration": 15,
  "workingHours": {
    "start": "09:00",
    "end": "18:00"
  },
  "features": {
    "teleconsult": true,
    "aiFeatures": true,
    "multiLanguage": false
  }
}
```

### Theming

```typescript
// Stored in database (Tenant.theme JSON)
{
  "primaryColor": "#3B82F6",
  "logo": "/logo.png",
  "favicon": "/favicon.ico",
  "brandName": "HOS Hospital"
}
```

## Role-Based Access Configuration

### Permissions Matrix

See `src/lib/auth/jwt.ts` for the complete permissions matrix:

```typescript
export const ROLE_PERMISSIONS = {
  SUPER_ADMIN: ['*'],
  ADMIN: ['dashboard:view', 'patients:*', ...],
  DOCTOR: ['dashboard:view', 'patients:view', ...],
  // ...
};
```

## Logging Configuration

### Development

```env
LOG_LEVEL="debug"
```

Logs include:
- Database queries
- API requests
- Authentication events

### Production

```env
LOG_LEVEL="error"
```

Only error logs for better performance.

## Best Practices

1. **Never commit .env files** - Use .env.example as template
2. **Rotate secrets regularly** - Update JWT_SECRET, NEXTAUTH_SECRET periodically
3. **Use strong passwords** - Especially for database and admin accounts
4. **Enable HTTPS** - Always in production
5. **Regular backups** - Database and configuration files
6. **Monitor logs** - Set up alerting for errors
