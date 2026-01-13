# Git Configuration

To initialize version control:

```bash
cd /Users/disen/Desktop/microblog

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Full-stack microblogging application

- Complete backend API with Express.js, TypeScript, and PostgreSQL
- React frontend with TypeScript and Vite
- User authentication with JWT
- CRUD operations for posts and replies
- Like functionality for posts and replies
- Comprehensive testing with Jest
- Structured logging with Winston
- Full documentation and setup guides"

# View commit history
git log
```

## .gitignore

The project includes a comprehensive `.gitignore` file that excludes:
- `node_modules/` - Dependency packages
- `.env` - Environment secrets
- `logs/` - Application logs
- `dist/` - Build outputs
- `.DS_Store` - macOS files
- IDE configuration files

## Remote Repository

To push to GitHub:

```bash
# Add remote repository
git remote add origin https://github.com/yourusername/microblog.git

# Set branch name (if needed)
git branch -M main

# Push to remote
git push -u origin main
```

## Workflow

### Local Development
1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and test
3. Commit: `git commit -m "Add your feature"`
4. Push: `git push origin feature/your-feature`
5. Create pull request

### Commit Best Practices
- Use descriptive commit messages
- Keep commits small and focused
- Run tests before committing
- Reference issues in commit messages

## Branch Strategy

Recommended branches:
- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches
- `hotfix/*` - Production hotfixes

Example:
```bash
git checkout develop
git checkout -b feature/search-posts
# ... make changes ...
git add .
git commit -m "Add search functionality for posts"
git push origin feature/search-posts
# Create pull request to develop
```

---

Start tracking your code with Git today!
