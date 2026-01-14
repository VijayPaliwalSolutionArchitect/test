# HOS - Hospital Management System

## Overview

HOS (Hospital Operating System) is an enterprise-grade, multi-tenant Hospital Management System that integrates HMS (Hospital Management System), EMR (Electronic Medical Records), and PHR (Patient Health Records) into a unified platform.

### Key Features

- **8 Role-Based Dashboards**: Admin, Doctor, Patient, Nurse, Lab, Pharmacy, HR, Marketing
- **Event-Driven Architecture**: Real-time workflows and notifications
- **AI Integration**: Clinical Copilot for doctors, Health Assistant for patients
- **Multi-Tenant Support**: Single codebase, multiple hospitals
- **Modern UI/UX**: Built with Next.js 14, React 18, Tailwind CSS, shadcn/ui

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT + Google OAuth (for patients)
- **AI**: OpenAI GPT-4 integration
- **UI Components**: shadcn/ui, Radix UI, Lucide Icons

## Project Structure

```
hos-system/
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed.ts            # Data seeding script
│   └── reset.ts           # Data reset script
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── (auth)/         # Auth pages (login, register)
│   │   ├── (dashboard)/    # Dashboard pages
│   │   └── api/            # API routes
│   ├── components/
│   │   ├── ui/             # shadcn/ui components
│   │   ├── layout/         # Layout components
│   │   ├── dashboard/      # Dashboard widgets
│   │   └── forms/          # Form components
│   ├── lib/
│   │   ├── db/             # Database utilities
│   │   ├── auth/           # Authentication utilities
│   │   ├── ai/             # AI integration
│   │   ├── events/         # Event system
│   │   ├── utils/          # Utility functions
│   │   └── validators/     # Zod schemas
│   ├── types/              # TypeScript types
│   └── styles/             # Global styles
├── docs/                   # Documentation
├── scripts/                # Utility scripts
└── public/                 # Static assets
```

## Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd hos-system

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
npx prisma migrate dev

# Seed the database
npm run db:seed

# Start development server
npm run dev
```

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@hos.com | Admin@123 |
| Admin | admin@hos.com | Admin@123 |
| Doctor | doctor1@hos.com | Doctor@123 |
| Nurse | nurse1@hos.com | Nurse@123 |
| Lab Tech | lab1@hos.com | Lab@123 |
| Pharmacist | pharma1@hos.com | Pharma@123 |
| HR | hr@hos.com | HR@123 |
| Marketing | marketing@hos.com | Marketing@123 |
| Patient | patient1@mail.com | Patient@123 |

## Documentation

- [Local Setup Guide](docs/LOCAL_SETUP.md)
- [VPS Deployment Guide](docs/VPS_DEPLOYMENT.md)
- [Configuration Guide](docs/CONFIGURATION.md)
- [AI Integration Guide](docs/AI_INTEGRATION.md)
- [API Documentation](docs/API_DOCUMENTATION.md)

## License

Proprietary - All rights reserved.
