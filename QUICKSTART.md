# Quick Start Guide

## 5-Minute Setup

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 12+
- Git

### Step 1: Create Database
```bash
# Create PostgreSQL database
createdb microblog

# Or via psql:
psql -U postgres -c "CREATE DATABASE microblog;"
```

### Step 2: Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your database URL
# DATABASE_URL=postgresql://user:password@localhost:5432/microblog
# JWT_SECRET=your_secret_key_here
```

### Step 3: Install & Setup
```bash
# Install all dependencies
npm run install-all

# Setup database schema
cd backend
npx prisma migrate dev --name init
npx prisma generate
cd ..
```

### Step 4: Start Development
```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend
npm run dev:frontend

# Or both together:
npm run dev
```

### Step 5: Access the App
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Health**: http://localhost:3001/health

## Testing the API

### 1. Register User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "testuser",
    "displayName": "Test User",
    "password": "password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

Save the returned token for authenticated requests.

### 3. Create Post
```bash
curl -X POST http://localhost:3001/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "content": "Hello World! This is my first post."
  }'
```

### 4. Get Feed
```bash
curl -X GET "http://localhost:3001/api/posts/feed?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Running Tests

### Backend
```bash
cd backend
npm test                    # Run all tests
npm run test:coverage      # See coverage report
npm run test:watch        # Watch mode for development
```

### Frontend
```bash
cd frontend
npm test                    # Run all tests
npm run test:coverage      # See coverage report
npm run test:watch        # Watch mode for development
```

## Database Management

### View Database (Visual)
```bash
cd backend
npx prisma studio
```
Opens http://localhost:5555 with interactive database UI.

### Create Migrations
```bash
cd backend
npx prisma migrate dev --name description_of_change
```

### Reset Database (Dev Only)
```bash
cd backend
npx prisma migrate reset
```

## Project Layout

```
microblog/
├── backend/          <- Express.js API (port 3001)
├── frontend/         <- React app (port 3000)
├── shared/          <- Shared TypeScript types
├── docs/            <- Documentation
└── README.md        <- Main documentation
```

## Common Issues

### PostgreSQL Not Running
```bash
# macOS with Homebrew
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Or use Docker
docker run --name microblog-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=microblog \
  -p 5432:5432 \
  -d postgres:15
```

### Port Already in Use
- Backend default: 3001
- Frontend default: 3000

Edit in:
- Backend: `backend/src/index.ts`
- Frontend: `frontend/vite.config.ts`

### Database Connection Error
1. Check PostgreSQL is running
2. Verify `DATABASE_URL` in `.env`
3. Ensure database exists
4. Check user permissions

```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules
npm run install-all
```

## Development Commands

```bash
# Install all packages
npm run install-all

# Start all services
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Lint code
npm run lint

# View logs (backend)
tail -f logs/combined.log
tail -f logs/error.log
```

## Project Structure in Monorepo

### Backend (`backend/`)
- Express.js TypeScript server
- Prisma ORM with PostgreSQL
- JWT authentication
- Winston logging
- Jest testing

### Frontend (`frontend/`)
- React 18 with TypeScript
- Vite build tool
- React Router for navigation
- Axios for API calls
- CSS Modules for styling
- Jest + React Testing Library

### Shared (`shared/`)
- Shared TypeScript types
- Validates API contracts
- Reduces duplication

## Next Steps

1. **Explore the code**: Check out the architecture in `docs/ARCHITECTURE.md`
2. **View API docs**: See all endpoints in main `README.md`
3. **Run tests**: `npm test` to verify everything works
4. **Build features**: Start with `docs/ARCHITECTURE.md` for patterns
5. **Deploy**: See main README for deployment options

## Performance Tips

### Database Queries
- Queries are indexed for common operations
- Use pagination on feed (default 20 items)
- Relations are eagerly loaded to avoid N+1

### Frontend Performance
- React components lazy-load pages
- Authentication stored in localStorage
- API errors handled gracefully

### Logging
- All requests logged with duration
- Errors logged with stack traces
- Check `logs/` directory for debugging

## IDE Setup (VS Code)

### Recommended Extensions
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Thunder Client (API testing)
- PostgreSQL
- REST Client

### Workspace Settings
```json
{
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Useful Links

- **Main README**: See full documentation and features
- **Architecture**: Check `docs/ARCHITECTURE.md` for design decisions
- **Backend Readme**: `backend/README.md` for API details
- **Frontend Readme**: `frontend/README.md` for UI details

---

**You're all set! Start with `npm run dev` to begin development.** 🚀
