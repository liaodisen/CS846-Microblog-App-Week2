# Architecture & Design Decisions

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│                    (http://localhost:3000)                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Pages (Feed, Profile, Login, Register)                      │
│        ↓                                                       │
│  Components (Header, PostCard, Layout)                       │
│        ↓                                                       │
│  Services (authService, postService, etc.)                  │
│        ↓ Axios HTTP Client                                   │
├─────────────────────────────────────────────────────────────┤
│                        REST API Layer                         │
│                   (http://localhost:3001)                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Routes ↔ Controllers ↔ Services ↔ Database                │
│                                                               │
│  Express.js Middleware:                                      │
│  - Authentication (JWT)                                      │
│  - Logging (Winston)                                         │
│  - Error Handling                                            │
│  - CORS & Security (Helmet)                                  │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                    PostgreSQL Database                        │
│    (Users, Posts, Replies, Likes with Indexes)             │
└─────────────────────────────────────────────────────────────┘
```

## Design Patterns

### 1. Service Layer Pattern
- **Why**: Separates business logic from HTTP concerns
- **Implementation**: Services in `backend/src/services/`
- **Benefits**: Testable, reusable, clean separation of concerns

### 2. Controller-Service-Repository Pattern
- **Controllers**: Handle HTTP requests/responses
- **Services**: Contain business logic
- **Prisma**: Acts as repository/ORM layer
- **Benefits**: Clear responsibility distribution

### 3. Custom Hooks (Frontend)
- **useAuth**: Global auth state management
- **Benefits**: Centralized auth logic, easily testable

### 4. API Client Factory
- **axios**: Configured with interceptors
- **Services**: Wrap axios calls with domain logic
- **Benefits**: Centralized error handling, token management

## Data Flow

### Creating a Post

```
User Input
    ↓
Feed.tsx (component)
    ↓
postService.createPost() (axios call)
    ↓
POST /api/posts (Backend)
    ↓
postController.createPost() (handler)
    ↓
postService.createPost() (business logic)
    ↓
prisma.post.create() (database)
    ↓
Response with Post object
    ↓
Update local state (Frontend)
    ↓
Re-render PostCard component
```

### Authentication Flow

```
User Input
    ↓
Register/Login Form
    ↓
authService.register/login()
    ↓
POST /api/auth/register/login
    ↓
authController.register/login()
    ↓
authService (bcrypt + JWT)
    ↓
Return { user, token }
    ↓
useAuth stores in localStorage
    ↓
axios interceptor adds token to headers
    ↓
Redirect to Feed
```

## Database Design Decisions

### 1. User Table
- Uses CUID for IDs (better distributed, privacy-friendly)
- Unique email and username
- Password hashed with bcrypt
- Optional bio field

### 2. Posts Table
- Foreign key to User
- Max 280 characters (Twitter-like constraint)
- Timestamps for chronological ordering
- Cascade delete with user

### 3. Replies Table
- Separate table for one-level replies
- Foreign keys to both Post and User
- Cascade delete
- Indexed for fast retrieval

### 4. Likes Table
- Tracks both post and reply likes
- Unique constraint prevents duplicates
- Indexed for fast checks
- Cascade delete for cleanup

### Indexes Strategy
```sql
-- User indexes
CREATE INDEX idx_user_created_at ON user(created_at);

-- Post indexes
CREATE INDEX idx_post_user_id ON post(user_id);
CREATE INDEX idx_post_created_at ON post(created_at);

-- Reply indexes
CREATE INDEX idx_reply_post_id ON reply(post_id);
CREATE INDEX idx_reply_user_id ON reply(user_id);
CREATE INDEX idx_reply_created_at ON reply(created_at);

-- Like indexes
CREATE INDEX idx_like_user_id ON like(user_id);
CREATE INDEX idx_like_post_id ON like(post_id);
CREATE INDEX idx_like_reply_id ON like(reply_id);
```

## API Design

### REST Principles
- Resource-based URLs (`/api/posts`, `/api/users`)
- Standard HTTP methods (GET, POST, PATCH, DELETE)
- Meaningful status codes (200, 201, 400, 401, 404, 500)
- Consistent response format

### Pagination Strategy
```
GET /api/posts/feed?page=1&limit=20
Response: {
  data: [...],
  total: 150,
  page: 1,
  limit: 20,
  totalPages: 8
}
```

### Authentication Strategy
- JWT tokens in Authorization header
- Tokens expire after 7 days (configurable)
- Stored in localStorage (Frontend)
- Validated on protected routes (Backend)

## Performance Considerations

### Query Optimization
1. **N+1 Prevention**: Prisma includes relations in single query
2. **Pagination**: Limits query results
3. **Field Selection**: Only fetch needed fields
4. **Indexing**: Strategic indexes on frequent queries

### Frontend Performance
1. **Code Splitting**: React Router lazy loads pages
2. **Local Storage**: Cache user data
3. **Axios Interceptors**: Centralized error handling
4. **CSS Modules**: No global style conflicts

### Backend Performance
1. **Winston Logging**: Async logging doesn't block requests
2. **Middleware Order**: Auth before data-heavy operations
3. **Database Connection Pool**: Prisma manages connections
4. **Compression**: Express can gzip responses

## Security Measures

### Password Security
- bcryptjs with 10 salt rounds
- Passwords never logged or returned in responses
- Passwords excluded from user objects with `{ password: _ }`

### Authentication
- JWT tokens with secret key
- Configurable expiration (default 7 days)
- Token validation on protected routes

### Data Protection
- CORS enabled for specific origins
- Helmet.js for HTTP headers
- Input validation on all endpoints
- SQL injection prevention via Prisma

### Logging
- Never log passwords or sensitive data
- Structure logs for debugging
- Error tracking with stack traces

## Constraints & Trade-offs

### No Private Messaging
**Decision**: Global feed only
- **Pros**: Simpler data model, encourages public interaction
- **Cons**: No private conversations

### One-Level Replies
**Decision**: Replies to posts only, no nested threads
- **Pros**: Simpler UI/UX, cleaner database
- **Cons**: Less complex discussion threads

### No Follower Graph
**Decision**: All users see same feed
- **Pros**: Everyone has equal visibility, simpler queries
- **Cons**: No personalization, potential spam

### No Retweets
**Decision**: No reposts/sharing mechanism
- **Pros**: Simpler data model
- **Cons**: Can't amplify good content

## Testing Strategy

### Unit Tests
- Test individual services in isolation
- Mock database calls
- Cover business logic

### Integration Tests
- Test API endpoints end-to-end
- Use test database
- Verify request/response format

### Component Tests
- Test React components with React Testing Library
- Mock API calls
- Verify UI interactions

## Future Enhancements

1. **Notifications**: Real-time notifications via WebSockets
2. **Search**: Full-text search on posts and users
3. **Following**: Personalized feed based on follows
4. **Media**: Image/video attachments
5. **Trending**: Trending topics/hashtags
6. **Direct Messages**: Private messaging
7. **Bookmarks**: Save favorite posts
8. **Analytics**: User engagement metrics

## Development Workflow

1. **Local Development**: `npm run dev` for both frontend and backend
2. **Database**: Use SQLite for testing, PostgreSQL for production
3. **Testing**: Run tests before commits
4. **Logging**: Check logs for issues: `logs/error.log`, `logs/combined.log`
5. **Deployment**: Use environment variables for configuration

---

For questions or suggestions, refer to individual README files or project documentation.
