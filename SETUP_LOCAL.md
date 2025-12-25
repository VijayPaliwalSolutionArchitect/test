# Local Development Setup

## Prerequisites

- Node.js 18+ 
- Yarn package manager
- MongoDB (local or Atlas)
- Git

---

## Quick Start Commands

```bash
# 1. Install dependencies
yarn install

# 2. Generate Prisma client
npx prisma generate

# 3. Push database schema (requires MongoDB running)
npx prisma db push

# 4. Run development server
yarn dev

# 5. Open browser
# http://localhost:3000
```

---

## All Available Commands

| Command | Description |
|---------|-------------|
| `yarn dev` | Start development server (port 3000) |
| `yarn build` | Create production build |
| `yarn start` | Start production server |
| `yarn lint` | Run ESLint |
| `npx prisma generate` | Generate Prisma client |
| `npx prisma db push` | Push schema to database |
| `npx prisma studio` | Open Prisma database GUI |
| `npx prisma db seed` | Seed database (if configured) |

---

## MongoDB Setup Options

### Option 1: Local MongoDB

```bash
# Install MongoDB (Ubuntu)
sudo apt install mongodb
sudo systemctl start mongodb

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:7
```

Update `.env`:
```
DATABASE_URL="mongodb://localhost:27017/superstore"
```

### Option 2: MongoDB Atlas (Cloud)

1. Create account at https://cloud.mongodb.com
2. Create free cluster
3. Get connection string
4. Update `.env`:
```
DATABASE_URL="mongodb+srv://user:pass@cluster.mongodb.net/superstore"
```

---

## Troubleshooting

### Prisma Issues
```bash
# Reset Prisma
rm -rf node_modules/.prisma
npx prisma generate
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Clear Next.js Cache
```bash
rm -rf .next
yarn dev
```
