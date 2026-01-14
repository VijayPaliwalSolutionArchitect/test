# HOS - Hospital Management System

## Project Overview
Enterprise-grade Hospital Management System built with Next.js, PostgreSQL, and Prisma ORM. The system features 8 role-based dashboards covering all hospital operations including patient management, appointments, clinical workflows, billing, inventory, HR, and marketing.

## Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based with bcrypt password hashing
- **State Management**: Zustand, React Query

## Core Features

### Implemented ✅
1. **Project Structure** - Complete Next.js App Router setup with all pages and API routes
2. **Database Schema** - Comprehensive Prisma schema with 30+ models covering all hospital entities
3. **Database Seeding** - Demo data with 8 departments, 4 wards, 65 beds, 28 staff, 20 patients
4. **Authentication System**
   - JWT-based login/register
   - Password hashing with bcrypt
   - Role-based access control (RBAC)
   - Session management with HTTP-only cookies
   - Role-based redirects to appropriate dashboards
5. **Admin Dashboard** - KPIs, quick actions, appointments, activities, department stats, inventory alerts
6. **Doctor Dashboard** - Patient schedule, pending tasks, lab results, AI Copilot
7. **Patient Dashboard** - Health overview, vitals, prescriptions, appointments, AI Health Assistant
8. **All UI Components** - Buttons, Cards, Inputs, Badges, Progress bars, etc.

### Mocked 🔶
- Google SSO (OAuth credentials placeholder)
- OpenAI AI features (API key placeholder)

### Pending 📋
- Nurse Dashboard implementation
- Lab Dashboard implementation  
- Pharmacy Dashboard implementation
- HR Dashboard implementation
- Marketing Dashboard implementation
- Full CRUD operations for all modules
- AI Chat integration with OpenAI
- Real-time notifications
- Document uploads and management
- Report generation (PDF)
- Payment integration

## Test Credentials (All Roles)
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

## API Endpoints
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - Patient registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Sign out

## File Structure
```
/app/hos-system/
├── docs/                 # Documentation
├── prisma/               # Database schema & seeding
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── (auth)/       # Auth pages (login, register)
│   │   ├── (dashboard)/  # Dashboard pages by role
│   │   └── api/          # API routes
│   ├── components/       # React components
│   │   ├── ui/           # Base UI components
│   │   ├── layout/       # Sidebar, Header, Layout
│   │   └── dashboard/    # Dashboard-specific components
│   ├── lib/              # Core libraries
│   │   ├── auth/         # JWT, password utils
│   │   ├── db/           # Prisma client
│   │   ├── utils/        # Utility functions
│   │   └── validators/   # Zod schemas
│   ├── types/            # TypeScript definitions
│   └── styles/           # Global CSS
└── .env                  # Environment variables
```

## Database Configuration
```
DATABASE_URL="postgresql://hos_admin:hos_secure_2024@localhost:5432/hos_db?schema=public"
```

## Next Steps (Priority Order)
1. **P0**: Implement remaining dashboard pages (Nurse, Lab, Pharmacy, HR, Marketing)
2. **P1**: Add CRUD operations for patients, appointments, encounters
3. **P1**: Implement AI chat with OpenAI integration
4. **P2**: Add document upload functionality
5. **P2**: Implement billing module with payment integration
6. **P3**: Add real-time notifications
7. **P3**: Generate PDF reports
8. **P4**: Production deployment guides

## Last Updated
December 2025 - Initial implementation with authentication and dashboard scaffolding complete.
