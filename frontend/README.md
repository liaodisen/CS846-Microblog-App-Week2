# Microblog Frontend

React + TypeScript web application for the Microblog platform.

## Quick Start

```bash
npm install
npm run dev
```

App runs on http://localhost:3000

## Project Structure

- `src/components/` - Reusable React components
- `src/pages/` - Page components (Feed, Profile, Login, Register)
- `src/services/` - API service layer (axios)
- `src/hooks/` - Custom React hooks (useAuth)
- `src/types/` - TypeScript type definitions
- `src/utils/` - Utility functions (formatters)
- `tests/` - Component tests

## Key Features

### Authentication Hook (`useAuth`)
Provides global auth state and methods:
```typescript
const { user, token, isLoading, register, login, logout, checkAuth } = useAuth();
```

### API Services
Organized by domain:
- `authService` - Login, register, get current user
- `userService` - Get profiles, update profile
- `postService` - CRUD posts, get feed
- `replyService` - CRUD replies
- `likeService` - Like/unlike posts and replies

### Components
- `Header` - Navigation and user menu
- `Layout` - Main layout with header
- `PostCard` - Post display with like/reply actions
- `Sidebar` - Sidebar layout component

### Pages
- `Feed` - Main feed with post composition
- `Login` - Login form
- `Register` - Registration form
- `Profile` - User profile with posts and edit bio

## Environment Variables

```env
VITE_API_URL=http://localhost:3001/api
```

## Development

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
npm run test      # Run tests
npm run lint      # Run linter
```

## Styling

CSS Modules are used for component styling:
```
Component.tsx -> Component.module.css
```

Design system:
- Primary color: #1da1f2 (Twitter blue)
- Text: #0f1419, #536471
- Borders: #e1e8ed
- Backgrounds: #fff, #f7f9fa

## Testing

```bash
npm test                 # Run all tests
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

Test files use Jest and React Testing Library:
- Located in `tests/` directory
- Named with `.test.tsx` or `.test.ts` suffix

## API Integration

Axios client configured in `src/services/apiClient.ts`:
- Base URL from environment
- Automatic JWT token injection in headers
- Auto-redirect to login on 401 responses
- Error handling

### Making API Calls:
```typescript
import { postService } from '@/services/postService';

const response = await postService.createPost({ content: 'Hello!' });
```

## Performance Optimizations

1. **Code Splitting**: React Router handles page-level splitting
2. **Lazy Loading**: Images and components load on demand
3. **Local Storage**: Auth tokens stored locally
4. **Memoization**: Use React.memo for expensive components
5. **CSS Modules**: Scoped styling prevents conflicts

## Extending the App

### Adding a New Page
1. Create component in `src/pages/NewPage.tsx`
2. Add route in `App.tsx`:
```typescript
<Route path="/new" element={<NewPage />} />
```

### Adding a New Component
1. Create component in `src/components/NewComponent.tsx`
2. Create styles in `src/components/NewComponent.module.css`
3. Export from component file

### Adding API Integration
1. Create service in `src/services/newService.ts`
2. Use in components via React hooks
3. Handle loading and error states

## Authentication Flow

1. User logs in/registers
2. Backend returns JWT token and user data
3. `useAuth` hook stores token in localStorage
4. Token automatically added to all API requests
5. On 401, user is redirected to login

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Production Build

```bash
npm run build
```

Creates optimized production build in `dist/` directory.

Deploy to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting

## Troubleshooting

### CORS Errors
- Ensure backend is running on correct port
- Check `VITE_API_URL` in `.env`
- Verify backend CORS configuration

### 404 on Routes
- Use `<BrowserRouter>` in App.tsx
- Ensure web server redirects to index.html for client-side routing

### Module Not Found
- Check import paths (use `@/` alias)
- Ensure all dependencies installed

---

See [main README](/README.md) for full project documentation.
