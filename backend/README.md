# Microblog Backend API

Express.js REST API server for the Microblog application.

## Quick Start

```bash
npm install
npm run prisma:migrate
npm run dev
```

Server runs on http://localhost:3001

## Project Structure

- `src/config/` - Configuration (logger, database)
- `src/middleware/` - Express middleware (auth, logging, error handling)
- `src/routes/` - API route definitions
- `src/controllers/` - Request handlers
- `src/services/` - Business logic layer
- `src/utils/` - Utilities
- `prisma/` - Database schema and migrations
- `tests/` - Unit and integration tests

## Key Features

### Logging
All requests and errors are logged using Winston:
- Request/response logging with duration
- Error logging with stack traces
- File rotation for production
- Console output in development

Logs are stored in:
- `logs/error.log` - Errors only
- `logs/combined.log` - All logs

### Authentication
- JWT-based authentication
- Middleware: `authMiddleware` in `/api` routes
- Token stored in Authorization header: `Bearer <token>`

### Database
PostgreSQL with Prisma ORM.

**Database Operations:**
```bash
npx prisma migrate dev     # Create/run migrations
npx prisma studio        # Open database UI
npx prisma generate      # Generate Prisma client
```

## API Response Format

Success:
```json
{
  "success": true,
  "data": { /* response data */ }
}
```

Error:
```json
{
  "success": false,
  "error": "Error message"
}
```

## Environment Variables

```env
NODE_ENV=development
PORT=3001
LOG_LEVEL=debug
DATABASE_URL=postgresql://user:password@localhost:5432/microblog
JWT_SECRET=your_secret_key
JWT_EXPIRATION=7d
```

## Testing

```bash
npm test                # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

Test files use Jest and are located in `tests/unit` and `tests/integration`.

## Performance Tips

1. **Database**: Queries use indexes on timestamps and user IDs
2. **Pagination**: Feed endpoints support pagination (page, limit)
3. **Caching**: Consider adding Redis for session/data caching
4. **Monitoring**: Winston logs can be sent to external services

## Extending the API

### Adding a New Endpoint

1. Create service in `src/services/`
2. Create controller in `src/controllers/`
3. Add route in `src/routes/`
4. Write tests in `tests/`
5. Update main router in `src/index.ts`

### Example:
```typescript
// service
export const myService = {
  myMethod: async () => { /* logic */ }
};

// controller
export const myController = {
  myEndpoint: async (req, res) => { /* handler */ }
};

// route
router.post('/my-route', (req, res) => myController.myEndpoint(req, res));
```

## Error Handling

All errors are caught and logged. Standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Configure PostgreSQL for production
- [ ] Set up log aggregation
- [ ] Enable HTTPS
- [ ] Configure CORS for frontend URL
- [ ] Run database migrations
- [ ] Set up monitoring/alerts
- [ ] Configure backup strategy

---

See [main README](/README.md) for full project documentation.
