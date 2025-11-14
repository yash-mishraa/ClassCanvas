# ClassCanvas - Quick Start Guide

Get ClassCanvas up and running in under 5 minutes.

## Prerequisites

- Node.js 18+ ([Download](https://nodejs.org))
- pnpm ([Install](https://pnpm.io/installation))
- Git

## 1. Clone & Install (1 minute)

```bash
# Clone repository
git clone https://github.com/yourusername/classcanvas.git
cd classcanvas

# Install dependencies
pnpm install
```

## 2. Start Dev Server (1 minute)

```bash
# Start dev server (frontend + backend)
pnpm run dev
```

Opens at: **http://localhost:5173**

## 3. Test the App (3 minutes)

### Student Flow
1. Click **"Student"** on homepage
2. Click **"Continue as Student"** → **"Sign Up"**
3. Enter:
   - Email: `student@test.com`
   - Password: `password123`
4. Click **"Sign Up"** → Redirected to dashboard
5. Click **"Add Course"**
6. Fill in:
   - Name: "Data Structures"
   - Code: "CS201"
   - Total Lectures: 40
   - Attended: 30
   - Target: 75%
7. Click **"Add Course"**
8. View course card with progress bar
9. Click download icon to export CSV

### Faculty Flow
1. Click **"Faculty"** on homepage
2. Click **"Continue as Faculty"** → **"Sign Up"**
3. Enter:
   - Email: `faculty@test.com`
   - Password: `password123`
   - Department Code: `CSE001`
4. Click **"Sign Up"** → Redirected to dashboard
5. Fill in settings:
   - Day: 8:00 AM to 5:00 PM
   - Lunch: 12:00 PM to 1:00 PM
   - Duration: 60 minutes
6. Click **"Add Course"** (under Courses)
7. Fill in:
   - Name: "Programming 101"
   - Code: "CS101"
   - Instructor: "Dr. Smith"
   - Lectures/week: 3
   - Duration: 60
   - Toggle: Not a lab
8. Click **"Add Course"** button
9. Set Resources: 5 classrooms, 2 labs
10. Add Constraints: "No classes after 3 PM"
11. Click **"Generate Timetable"**
12. View generated timetable in preview
13. Click **"Preview"** tab to see weekly schedule

## Common Tasks

### Add a New Component

1. Create file: `client/components/MyComponent.tsx`
2. Use existing components as template
3. Import in page: `import { MyComponent } from "@/components/MyComponent";`

### Add API Endpoint

1. Create handler: `server/routes/my-route.ts`
   ```typescript
   import { RequestHandler } from "express";
   
   export const myHandler: RequestHandler = (req, res) => {
     res.json({ message: "Hello" });
   };
   ```

2. Register in `server/index.ts`:
   ```typescript
   import { myHandler } from "./routes/my-route";
   app.post("/api/my-endpoint", myHandler);
   ```

3. Call from frontend:
   ```typescript
   const response = await fetch("/api/my-endpoint", {
     method: "POST",
     body: JSON.stringify({ /* data */ })
   });
   ```

### Modify Dark Theme

Edit `client/global.css`:

```css
:root {
  --primary: 180 100% 50%;      /* Neon Cyan */
  --accent: 290 100% 50%;       /* Magenta */
  /* ... other colors */
}
```

Or modify `tailwind.config.ts` for Tailwind utilities.

### Add a New Page

1. Create `client/pages/MyPage.tsx`:
   ```typescript
   export default function MyPage() {
     return <div>My Page</div>;
   }
   ```

2. Add route in `client/App.tsx`:
   ```typescript
   <Route path="/my-page" element={<MyPage />} />
   ```

3. Link to it:
   ```typescript
   import { Link } from "react-router-dom";
   <Link to="/my-page">Go to My Page</Link>
   ```

## Build & Deploy

### Local Build

```bash
# Build frontend + backend
pnpm run build

# Output locations:
# Frontend: dist/spa/
# Backend: dist/server/
```

### Deploy to Vercel (Frontend)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Deploy to Render (Backend)

1. Push code to GitHub
2. Connect repo to Render
3. Configure environment: `DATABASE_URL`, `NODE_ENV=production`
4. Render auto-deploys on push

## Troubleshooting

### Port 5173 already in use
```bash
# Kill process on port
lsof -ti:5173 | xargs kill -9
pnpm run dev
```

### Dependencies not installed
```bash
# Clear and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### TypeScript errors
```bash
# Check types
pnpm run typecheck

# Fix issues in code and re-run
```

### Timetable generation fails
- Add at least 1 course
- Set reasonable time ranges (8 AM - 5 PM)
- Allocate enough resources (5+ classrooms for 10+ courses)
- Simplify constraints

## Testing

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test --watch

# Check test coverage
pnpm test --coverage
```

## Code Style

The project uses:
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling
- **Prettier**: Code formatting (auto on save)

```bash
# Format code
pnpm run format.fix

# Or let your IDE handle it (VSCode with Prettier extension)
```

## Key Files to Know

| File | Purpose |
|------|---------|
| `client/App.tsx` | Routes and app setup |
| `client/global.css` | Dark theme + styles |
| `server/index.ts` | Express app + endpoints |
| `shared/api.ts` | Shared types |
| `tailwind.config.ts` | Tailwind theme |
| `package.json` | Scripts and dependencies |

## Next Steps

1. **Read [README.md](./README.md)** - Full documentation
2. **Read [TECHNICAL_DOCS.md](./TECHNICAL_DOCS.md)** - Architecture details
3. **Read [DATABASE_SETUP.md](./DATABASE_SETUP.md)** - Add PostgreSQL
4. **Explore code** - Check comments and existing patterns
5. **Try modifying** - Add a course feature, update UI, etc.

## Getting Help

- Check [README.md](./README.md) for detailed docs
- Look at existing code for patterns
- Check error messages carefully
- Try building → test → debug cycle
- Create GitHub issues for bugs

## IDE Setup

### VSCode (Recommended)

Install extensions:
- **Prettier** - Code formatter
- **ESLint** - Linting
- **Tailwind CSS IntelliSense** - CSS hints
- **TypeScript Vue Plugin** - TypeScript support

Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## Performance Tips

- Use dev tools network tab to check bundle size
- Lazy load components with React.lazy()
- Cache API responses with React Query
- Monitor performance with Lighthouse

---

**You're ready to code!** 🚀

Need more details? See [README.md](./README.md)
