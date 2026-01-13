# Chirp 🐦 - A Twitter-Like Microblogging Platform

> **CS846 Week 2 Project** - Built with the power of vibe coding and modern web technologies!

A full-stack microblogging platform where users can share their thoughts, interact with posts, and build a community. Chirp features user profiles with custom avatars, real-time post interactions, threaded replies, and a sleek, responsive design.

## 🎓 About This Project

This project was **vibe coded** as part of Week 2 coursework for **CS846**. It showcases a complete microblogging application built from scratch with modern development practices, including:
- Full TypeScript implementation across frontend and backend
- RESTful API design with proper authentication
- Real-time user interactions and avatar management
- Responsive UI with resizable panels
- Comprehensive reply system with inline composition

## 📋 Project Structure

```
microblog/
├── backend/                    # Express.js API server
│   ├── src/
│   │   ├── config/            # Configuration (logger, database)
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # Express middleware (auth, upload)
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   ├── utils/            # Utilities (file upload)
│   │   └── index.ts          # Server entry point
│   ├── prisma/               # Database schema and migrations
│   ├── tests/                # Unit and integration tests
│   ├── uploads/              # Avatar uploads directory
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # React TypeScript app
│   ├── src/
│   │   ├── components/       # React components (Avatar, PostCard, etc.)
│   │   ├── pages/           # Page components (Feed, Profile, Login)
│   │   ├── services/        # API services
│   │   ├── hooks/           # Custom React hooks (useAuth)
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Utilities (formatters, avatarGenerator)
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── tests/               # Component tests
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── shared/                    # Shared types between frontend/backend
│   ├── src/
│   │   └── types/
│   └── package.json
│
├── docs/                      # Documentation
├── package.json               # Workspace configuration
└── .gitignore
```

## 🚀 Features

### User Management
- **Register & Login**: Secure authentication with JWT tokens
- **Profile Customization**: Edit display name, bio, and profile picture
- **Avatar System**: Upload custom avatars or use auto-generated cartoon avatars (via DiceBear API)
- **User Profiles**: View any user's profile with their posts and avatar

### Posts & Feed
- **Create Posts**: Share thoughts with up to 280 characters
- **Dynamic Feed**: Chronological feed with resizable panels for optimal viewing
- **Like Posts**: Show appreciation with likes (toggle on/off)
- **Reply System**: Respond to posts with inline reply composition
- **View Replies**: See all existing replies when responding to a post
- **Real-time Updates**: Reply counts update immediately after posting

### UI/UX
- **Resizable Layout**: Drag to adjust feed and compose area widths
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Avatar Display**: Cartoon avatars shown on all posts and replies
- **Inline Reply Mode**: Right panel transforms into reply composer
- **Time Formatting**: Human-readable timestamps (e.g., "2m ago", "5h ago")

### Technical Features
- **Authentication Required**: Login enforcement for protected routes
- **Error Handling**: Clear error messages for auth failures
- **File Upload**: Avatar upload with validation (images only, 5MB max)
- **Database Indexes**: Optimized queries for performance
- **Pagination**: Efficient feed loading
- **Structured Logging**: Winston-based logging with performance metrics

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **Logging**: Winston
- **Testing**: Jest
- **Validation**: express-validator

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: CSS Modules
- **Testing**: Jest + React Testing Library
- **UI Components**: Custom Avatar component with DiceBear integration

### DevOps & Tools
- **Package Manager**: npm (monorepo with workspaces)
- **Version Control**: Git
- **Environment**: .env configuration
- **File Upload**: Multer for avatar handling

## 📥 Installation

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 12+
- Git

### Setup Steps

1. **Clone and navigate to project**
```bash
cd /Users/disen/Desktop/microblog
```

2. **Create environment file**
```bash
cp .env.example .env
```

Edit `.env` with your database connection:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/microblog
JWT_SECRET=your_super_secret_key_here
PORT=3001
```

3. **Install dependencies**
```bash
npm install
```

4. **Set up database**
```bash
cd backend
npx prisma migrate dev
npx prisma generate
cd ..
```

5. **Build shared types**
```bash
cd shared
npm run build
cd ..
```

6. **Start development servers**
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

This will start:
- Backend: http://localhost:3001
- Frontend: http://localhost:5173 (Vite default)

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Users
- `GET /api/users` - List all users
- `GET /api/users/:username` - Get user profile
- `PATCH /api/users/profile` - Update user profile (requires auth)
- `POST /api/users/upload-avatar` - Upload profile avatar (requires auth)

### Posts (all require auth)
- `POST /api/posts` - Create post
- `GET /api/posts/feed` - Get feed with pagination
- `GET /api/posts/:postId` - Get single post
- `GET /api/posts/user/:userId` - Get user's posts
- `PATCH /api/posts/:postId` - Update post
- `DELETE /api/posts/:postId` - Delete post

### Replies (all require auth)
- `POST /api/replies` - Create reply
- `GET /api/replies/post/:postId` - Get post replies
- `GET /api/replies/:replyId` - Get single reply
- `PATCH /api/replies/:replyId` - Update reply
- `DELETE /api/replies/:replyId` - Delete reply

### Likes (all require auth)
- `POST /api/likes/posts/:postId` - Like post
- `DELETE /api/likes/posts/:postId` - Unlike post
- `POST /api/likes/replies/:replyId` - Like reply
- `DELETE /api/likes/replies/:replyId` - Unlike reply

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test                 # Run all tests
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

### Frontend Tests
```bash
cd frontend
npm test                 # Run all tests
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

### Test Coverage
- **Backend**: Unit tests for services, integration tests for API endpoints
- **Frontend**: Component tests for React components
- **Target**: 70%+ code coverage

## 📊 Database Schema

### Users
```sql
- id: String (Primary Key)
- email: String (Unique)
- username: String (Unique)
- displayName: String
- password: String (hashed)
- bio: String (Optional)
- avatar: String (Optional, default: "default")
- createdAt: DateTime
- updatedAt: DateTime
```

### Posts
```sql
- id: String (Primary Key)
- content: String (max 280)
- userId: String (Foreign Key)
- createdAt: DateTime
- updatedAt: DateTime
```

### Replies
```sql
- id: String (Primary Key)
- content: String (max 280)
- postId: String (Foreign Key)
- userId: String (Foreign Key)
- createdAt: DateTime
- updatedAt: DateTime
```

### Likes
```sql
- id: String (Primary Key)
- userId: String (Foreign Key)
- postId: String (Foreign Key, Optional)
- replyId: String (Foreign Key, Optional)
- createdAt: DateTime
- Unique constraint: [userId, postId, replyId]
```

## 🔐 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Environment Variables**: Sensitive data in .env
- **CORS**: Configured for frontend origin
- **Helmet**: HTTP headers security
- **Input Validation**: express-validator for all inputs
- **Graceful Shutdown**: Proper database disconnection

## 📈 Performance Optimizations

1. **Database Indexes**: 
   - User creation timestamps
   - Post creation timestamps and user IDs
   - Reply creation timestamps and IDs
   - Like user, post, and reply IDs

2. **Query Optimization**:
   - Efficient pagination with limit/offset
   - Aggregated counts in single queries
   - Selective field selection

3. **Frontend Optimization**:
   - React Router code splitting
   - Lazy loading components
   - Axios request/response interceptors
   - Local storage for auth tokens

## 🚢 Deployment

### Docker (Optional)
Create `Dockerfile` in backend and frontend directories for containerization.

### Environment Variables
Ensure these are set in production:
- `NODE_ENV=production`
- `DATABASE_URL` (production database)
- `JWT_SECRET` (strong random string)
- `JWT_EXPIRATION` (e.g., "7d")

### Database Migrations
Run migrations before deployment:
```bash
npx prisma migrate deploy
```

## 📝 Project Constraints & Design Decisions

### What Chirp Has:
✅ **User Avatars**: Custom uploads or auto-generated cartoon avatars  
✅ **Inline Replies**: Reply composition with existing replies visible  
✅ **Resizable UI**: User-adjustable layout panels  
✅ **Real-time Interactions**: Like/unlike posts with instant feedback  
✅ **Authentication**: Secure JWT-based authentication  
✅ **Profile Customization**: Edit bio and display name  

### Intentional Limitations:
❌ **No Private Messaging**: Focus on public interactions  
❌ **No Retweets**: Keeps the data model simple  
❌ **No Follower Graph**: All users see the same global feed  
❌ **One-Level Replies**: No nested comment threads  
❌ **280 Character Limit**: Encourages concise communication  
❌ **Global Feed**: Chronological feed for all authenticated users  

These constraints were chosen to focus on core features while maintaining code quality and manageable complexity for a week 2 project.

## 📖 Development Workflow

### Adding a Feature

1. **Create database model** (if needed in `backend/prisma/schema.prisma`)
2. **Create service** for business logic
3. **Create controller** for request handling
4. **Create route** and add to router
5. **Write tests** for service and API
6. **Create frontend service** for API calls (if UI needed)
7. **Create React components** and pages
8. **Write component tests**

### Code Quality
- Use TypeScript strictly (`strict: true`)
- Follow ESLint configuration
- Add JSDoc comments for public APIs
- Write tests for all services
- Run `npm test` before committing

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check DATABASE_URL in .env
# Ensure PostgreSQL is running
# Reset database: npx prisma migrate reset
```

### Port Already in Use
```bash
# Change ports in .env and vite.config.ts
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules
npm run install-all
```

## 📞 Support & Contact

Built with ❤️ for CS846 Week 2. For issues or questions, refer to individual package READMEs or check the documentation in the `docs/` folder.

## 📄 License

MIT License - See LICENSE file for details

---

**Happy Chirping! 🐦✨**

*Built with vibe coding energy and lots of TypeScript ⚡*
