# Local Development Setup

## Prerequisites
- Node.js >= 18
- npm >= 9
- MongoDB (local or Atlas)
- [Optional] Docker

## Backend Setup
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and set values:
   - `MONGO_URI`
   - `JWT_SECRET`
   - etc.
4. `npm run dev`

## Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## Environment Variables
See `.env.example` in backend and frontend for all available configs.