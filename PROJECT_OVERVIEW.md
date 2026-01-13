# Project Overview & File Guide

## 📂 Complete File Structure

```
microblog/
│
├── 📄 README.md                          # Main documentation
├── 📄 QUICKSTART.md                      # 5-minute setup guide
├── 📄 IMPLEMENTATION_SUMMARY.md           # This project summary
├── 📄 GIT_SETUP.md                       # Git configuration
├── 📄 .env.example                       # Environment template
├── 📄 .gitignore                         # Git ignore rules
├── 📄 package.json                       # Workspace config
├── 📄 tsconfig.json                      # TypeScript root config
│
├── 📁 backend/                           # Express.js API Server
│   ├── 📄 README.md                      # Backend documentation
│   ├── 📄 package.json                   # Dependencies
│   ├── 📄 tsconfig.json                  # TypeScript config
│   ├── 📄 jest.config.js                 # Jest configuration
│   │
│   ├── 📁 src/
│   │   ├── 📄 index.ts                   # Server entry point
│   │   │
│   │   ├── 📁 config/
│   │   │   ├── 📄 logger.ts              # Winston logger setup
│   │   │   └── 📄 db.ts                  # Prisma database config
│   │   │
│   │   ├── 📁 middleware/
│   │   │   ├── 📄 auth.ts                # JWT authentication
│   │   │   ├── 📄 logger.ts              # Request/response logging
│   │   │   └── 📄 errorHandler.ts        # Error handling
│   │   │
│   │   ├── 📁 routes/
│   │   │   ├── 📄 authRoutes.ts          # Auth endpoints
│   │   │   ├── 📄 userRoutes.ts          # User endpoints
│   │   │   ├── 📄 postRoutes.ts          # Post endpoints
│   │   │   ├── 📄 replyRoutes.ts         # Reply endpoints
│   │   │   └── 📄 likeRoutes.ts          # Like endpoints
│   │   │
│   │   ├── 📁 controllers/
│   │   │   ├── 📄 authController.ts      # Auth logic
│   │   │   ├── 📄 userController.ts      # User logic
│   │   │   ├── 📄 postController.ts      # Post logic
│   │   │   ├── 📄 replyController.ts     # Reply logic
│   │   │   └── 📄 likeController.ts      # Like logic
│   │   │
│   │   ├── 📁 services/
│   │   │   ├── 📄 authService.ts         # Auth business logic
│   │   │   ├── 📄 userService.ts         # User business logic
│   │   │   ├── 📄 postService.ts         # Post business logic
│   │   │   ├── 📄 replyService.ts        # Reply business logic
│   │   │   └── 📄 likeService.ts         # Like business logic
│   │   │
│   │   └── 📁 utils/
│   │       └── (Utility functions)
│   │
│   ├── 📁 prisma/
│   │   └── 📄 schema.prisma              # Database schema
│   │
│   └── 📁 tests/
│       ├── 📁 unit/
│       │   ├── 📄 authService.test.ts    # Auth service tests
│       │   ├── 📄 postService.test.ts    # Post service tests
│       │   └── 📄 likeService.test.ts    # Like service tests
│       │
│       └── 📁 integration/
│           └── (Integration tests)
│
├── 📁 frontend/                          # React TypeScript App
│   ├── 📄 README.md                      # Frontend documentation
│   ├── 📄 package.json                   # Dependencies
│   ├── 📄 tsconfig.json                  # TypeScript config
│   ├── 📄 vite.config.ts                 # Vite configuration
│   ├── 📄 jest.config.js                 # Jest configuration
│   ├── 📄 index.html                     # HTML entry point
│   │
│   ├── 📁 src/
│   │   ├── 📄 main.tsx                   # React entry point
│   │   ├── 📄 App.tsx                    # Root component
│   │   ├── 📄 App.css                    # Global styles
│   │   │
│   │   ├── 📁 components/
│   │   │   ├── 📄 Header.tsx             # Navigation header
│   │   │   ├── 📄 Header.module.css      # Header styles
│   │   │   ├── 📄 Layout.tsx             # Main layout
│   │   │   ├── 📄 Layout.module.css      # Layout styles
│   │   │   ├── 📄 PostCard.tsx           # Post display
│   │   │   ├── 📄 PostCard.module.css    # PostCard styles
│   │   │   ├── 📄 Sidebar.tsx            # Sidebar layout
│   │   │   └── 📄 Sidebar.module.css     # Sidebar styles
│   │   │
│   │   ├── 📁 pages/
│   │   │   ├── 📄 Feed.tsx               # Feed page
│   │   │   ├── 📄 Feed.module.css        # Feed styles
│   │   │   ├── 📄 Login.tsx              # Login page
│   │   │   ├── 📄 Login.module.css       # Login styles
│   │   │   ├── 📄 Register.tsx           # Register page
│   │   │   ├── 📄 Profile.tsx            # Profile page
│   │   │   └── 📄 Profile.module.css     # Profile styles
│   │   │
│   │   ├── 📁 services/
│   │   │   ├── 📄 apiClient.ts           # Axios configuration
│   │   │   ├── 📄 authService.ts         # Auth API calls
│   │   │   ├── 📄 postService.ts         # Post API calls
│   │   │   ├── 📄 replyService.ts        # Reply API calls
│   │   │   └── 📄 likeService.ts         # Like API calls
│   │   │
│   │   ├── 📁 hooks/
│   │   │   └── 📄 useAuth.tsx            # Auth context hook
│   │   │
│   │   ├── 📁 types/
│   │   │   └── 📄 index.ts               # TypeScript types
│   │   │
│   │   └── 📁 utils/
│   │       └── 📄 formatters.ts          # Date/text formatters
│   │
│   └── 📁 tests/
│       ├── 📄 Header.test.tsx            # Header component tests
│       ├── 📄 PostCard.test.tsx          # PostCard tests
│       └── 📄 setupTests.ts              # Test setup
│
├── 📁 shared/                            # Shared Types Package
│   ├── 📄 package.json                   # Package config
│   ├── 📄 tsconfig.json                  # TypeScript config
│   │
│   └── 📁 src/
│       ├── 📄 index.ts                   # Export all types
│       │
│       └── 📁 types/
│           └── 📄 index.ts               # All type definitions
│
├── 📁 docs/                              # Documentation
│   └── 📄 ARCHITECTURE.md                # Design & decisions
│
└── 📁 logs/                              # Application logs (created at runtime)
    ├── 📄 error.log                      # Error logs
    └── 📄 combined.log                   # All logs
```

## 📋 File Descriptions

### Root Level
| File | Purpose |
|------|---------|
| `README.md` | Main documentation with all features and setup |
| `QUICKSTART.md` | 5-minute quick setup guide |
| `IMPLEMENTATION_SUMMARY.md` | Overview of what was built |
| `GIT_SETUP.md` | Git configuration and workflow |
| `.env.example` | Environment variables template |
| `package.json` | Monorepo workspace configuration |
| `tsconfig.json` | Root TypeScript configuration |

### Backend Files
| File | Purpose |
|------|---------|
| `src/index.ts` | Express server setup and start |
| `src/config/logger.ts` | Winston logger configuration |
| `src/config/db.ts` | Prisma database setup |
| `src/middleware/auth.ts` | JWT authentication middleware |
| `src/middleware/logger.ts` | Request/response logging |
| `src/middleware/errorHandler.ts` | Global error handling |
| `src/controllers/*.ts` | HTTP request handlers (5 files) |
| `src/services/*.ts` | Business logic (5 files) |
| `src/routes/*.ts` | API endpoint definitions (5 files) |
| `prisma/schema.prisma` | Database schema definition |
| `tests/unit/*.test.ts` | Service unit tests (3 files) |

### Frontend Files
| File | Purpose |
|------|---------|
| `src/main.tsx` | React app entry point |
| `src/App.tsx` | Root component with routing |
| `src/hooks/useAuth.tsx` | Authentication context and hook |
| `src/pages/*.tsx` | Page components (4 files) |
| `src/components/*.tsx` | Reusable components (4 files) |
| `src/services/*.ts` | API integration (5 files) |
| `tests/*.test.tsx` | Component tests (2 files) |

### Shared Package
| File | Purpose |
|------|---------|
| `src/types/index.ts` | Shared TypeScript types (constants too) |

## 🔄 Data Flow

### Creating a Post

```
User fills form in Feed.tsx
         ↓
Feed component calls postService.createPost()
         ↓
Axios sends POST /api/posts
         ↓
postController.createPost() handles request
         ↓
postService.createPost() validates and creates
         ↓
prisma.post.create() saves to database
         ↓
Response with Post object sent back
         ↓
Feed component updates local state
         ↓
PostCard component re-renders with new post
```

## 🔐 Authentication Flow

```
User enters credentials in LoginPage
         ↓
LoginPage calls authService.login()
         ↓
Axios sends POST /api/auth/login
         ↓
authController.login() handles request
         ↓
authService compares password with bcrypt
         ↓
JWT token generated and returned
         ↓
useAuth stores token in localStorage
         ↓
axios interceptor adds token to all requests
         ↓
User redirected to Feed
```

## 📡 API Architecture

```
REST API
  ├── /api/auth (public)
  │   ├── POST /register
  │   ├── POST /login
  │   └── GET /me (protected)
  │
  ├── /api/users (public)
  │   ├── GET / (list all)
  │   ├── GET /:username (profile)
  │   └── PATCH /profile (protected)
  │
  ├── /api/posts (protected)
  │   ├── POST / (create)
  │   ├── GET /feed (list)
  │   ├── GET /user/:userId
  │   ├── GET /:postId
  │   ├── PATCH /:postId
  │   └── DELETE /:postId
  │
  ├── /api/replies (protected)
  │   ├── POST / (create)
  │   ├── GET /post/:postId
  │   ├── GET /:replyId
  │   ├── PATCH /:replyId
  │   └── DELETE /:replyId
  │
  └── /api/likes (protected)
      ├── POST /posts/:postId
      ├── DELETE /posts/:postId
      ├── POST /replies/:replyId
      └── DELETE /replies/:replyId
```

## 🗄️ Database Schema

```
┌─────────────────────────────────────────┐
│              USERS                       │
├─────────────────────────────────────────┤
│ id (PK) | email | username | displayName│
│ password | bio | createdAt | updatedAt  │
└─────────────────────────────────────────┘
         ↓ (one-to-many)
        ┌─────────────────────────────────┐
        │          POSTS                   │
        ├─────────────────────────────────┤
        │ id (PK) | content | userId (FK) │
        │ createdAt | updatedAt           │
        └─────────────────────────────────┘
         ↓ (one-to-many)
        ┌──────────────────────────────────────────┐
        │            REPLIES                        │
        ├──────────────────────────────────────────┤
        │ id (PK) | content | postId (FK)          │
        │ userId (FK) | createdAt | updatedAt      │
        └──────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│              LIKES                              │
├────────────────────────────────────────────────┤
│ id (PK) | userId (FK) | postId (FK) | replyId │
│ (FK) | createdAt                              │
└────────────────────────────────────────────────┘
```

## 📊 Dependencies

### Backend (Key packages)
- `express` - Web framework
- `typescript` - Type safety
- `@prisma/client` - Database ORM
- `jsonwebtoken` - JWT auth
- `bcryptjs` - Password hashing
- `winston` - Logging
- `jest` - Testing

### Frontend (Key packages)
- `react` - UI framework
- `react-router-dom` - Routing
- `axios` - HTTP client
- `typescript` - Type safety
- `vite` - Build tool
- `jest` - Testing
- `@testing-library/react` - Component testing

## 🚀 Quick Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start both servers |
| `npm test` | Run all tests |
| `npm run build` | Build for production |
| `npm run lint` | Check code quality |
| `npm run install-all` | Install all dependencies |

## 📖 Documentation Map

1. **Start Here**: `QUICKSTART.md` - Get running in 5 minutes
2. **Learn Features**: `README.md` - Complete feature list
3. **Understand Architecture**: `docs/ARCHITECTURE.md` - Design decisions
4. **Backend Details**: `backend/README.md` - API documentation
5. **Frontend Details**: `frontend/README.md` - Component guide
6. **Setup Git**: `GIT_SETUP.md` - Version control setup

---

**Everything you need is here. Start with QUICKSTART.md!** 🚀
