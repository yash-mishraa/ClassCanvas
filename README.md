# ClassCanvas - Intelligent Attendance & Timetable Management

A modern, full-stack web application for managing student attendance and generating optimized class timetables with AI-powered constraint solving.

## 🎯 Project Overview

ClassCanvas provides two distinct user flows:

### Student Flow
- **Course Management**: Add, edit, and delete courses with optional course codes
- **Attendance Tracking**: Monitor attendance percentage for each course
- **Target Setting**: Set attendance targets (50%, 60%, 75%, 85%, or custom)
- **Progress Visualization**: See current attendance %, classes needed/missable
- **Data Export**: Download attendance data as CSV for personal records

### Faculty Flow
- **Timetable Generation**: AI-powered constraint-solving timetable generator
- **Course Configuration**: Define courses, instructors, lecture frequency, and duration
- **Resource Management**: Allocate classrooms and labs
- **Constraint Input**: Natural language constraint parsing (labs consecutively, no afternoon classes, etc.)
- **Export Options**: Download timetables as PDF or Excel
- **Version Control**: Save and manage multiple timetable versions

## 🚀 Tech Stack

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS (dark theme)
- **Backend**: Express.js + Node.js + TypeScript
- **Styling**: Tailwind CSS 3 with custom dark theme, Framer Motion for animations
- **UI Components**: Radix UI + Lucide Icons
- **Testing**: Vitest
- **Deployment**: Vercel (frontend) + Render (backend)
- **Version Control**: Git + GitHub Actions CI/CD

## 📋 Local Development Setup

### Prerequisites
- Node.js 18+ 
- pnpm 10.14.0+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/classcanvas.git
cd classcanvas

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

The development server runs on `http://localhost:5173` with the backend API available at `/api/*`.

### Environment Variables

Create a `.env` file in the root directory (if needed):

```bash
VITE_API_URL=http://localhost:5173
```

## 📁 Project Structure

```
classcanvas/
├── client/                    # React frontend
│   ├── components/
│   │   ├── ui/               # Radix UI components
│   │   ├── student/          # Student-specific components
│   │   └── faculty/          # Faculty-specific components
│   ├── pages/                # Route pages
│   │   ├── Index.tsx         # Homepage (Student/Faculty selection)
│   │   ├── StudentLogin.tsx  # Student auth
│   │   ├── FacultyLogin.tsx  # Faculty auth
│   │   ├── StudentDashboard.tsx
│   │   └── FacultyDashboard.tsx
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utilities
│   ├── App.tsx               # Main app with routes
│   └── global.css            # Dark theme + Tailwind config
│
├── server/                    # Express backend
│   ├── routes/
│   │   ├── auth.ts           # Authentication endpoints
│   │   ├── faculty.ts        # Faculty timetable endpoints
│   │   └── demo.ts           # Example endpoint
│   ├── utils/
│   │   ├── timetable-generator.ts      # Core algorithm
│   │   └── timetable-generator.spec.ts # Tests
│   └── index.ts              # Express app setup
│
├── shared/
��   └── api.ts                # Shared types between client & server
│
├── .github/workflows/
│   └── ci.yml                # GitHub Actions CI/CD
│
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
├── vite.config.server.ts
├── vercel.json               # Vercel deployment config
└── render.yaml               # Render deployment config
```

## 🧪 Testing

### Run Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with coverage
pnpm test --coverage
```

### Test Coverage

Core logic is tested including:
- Timetable generation algorithm
- Constraint parsing (natural language → constraints)
- Attendance percentage calculations
- Class scheduling within valid time slots
- Resource allocation and conflict avoidance

## 🔐 Authentication

### Student Account
- Email/password authentication
- Session stored in localStorage
- Role: `student`

### Faculty Account
- Email/password authentication with department code
- Session stored in localStorage
- Role: `faculty`

**Note**: For demo purposes, authentication uses in-memory storage. In production, integrate with a real database and use bcrypt for password hashing.

## 📊 Student Features

### Add a Course
1. Click "Add Course" button
2. Enter course name, optional code
3. Set total lectures conducted and lectures attended
4. Choose target attendance percentage (preset or custom)
5. Save

### Track Attendance
- Real-time percentage display
- Color-coded progress bars (red/amber/green)
- Quick calculation of classes needed or missable
- Overall attendance across all courses

### Export Data
- Click the download icon to export as CSV
- Includes course name, code, lectures, attendance %, target %, and status

## 📅 Faculty Features

### Generate Timetable

1. **Set Timetable Settings**
   - Day start/end times
   - Lunch break hours
   - Default lecture duration (30/40/45/50/60 min)

2. **Add Courses**
   - Course name, code, instructor
   - Lectures per week
   - Toggle lab/lecture
   - Override duration if needed

3. **Define Resources**
   - Number of classrooms
   - Number of labs

4. **Add Constraints** (Natural Language)
   - "No classes after 3 PM"
   - "Labs must be consecutive"
   - "Respect lunch break"
   - "Morning classes preferred"
   - "Professor X unavailable Thursday"

5. **Generate**
   - Click "Generate Timetable"
   - Review the schedule
   - Export as PDF or Excel

### Constraint Types Supported

| Type | Example | Implementation |
|------|---------|---|
| Time-based | "No classes after 3 PM" | Excludes slots after specified time |
| Lab consecutive | "Labs must be consecutive" | Schedules lab hours together |
| Lunch respect | "Lunch 12-1 PM" | No classes during lunch |
| Morning preference | "Morning preferred" | Prioritizes earlier time slots |
| Instructor unavailable | "Dr. X unavailable Thursday" | Skips that day for the instructor |

## 🧮 Timetable Generation Algorithm

### Overview
The algorithm uses a **greedy scheduling approach with constraint satisfaction**:

1. **Parse Constraints**: Convert natural language to structured constraints
2. **Generate Slots**: Create available time slots respecting day hours and lunch
3. **Allocate Resources**: Track classroom and lab usage
4. **Schedule Courses**: Iteratively place lectures in valid slots
5. **Validate**: Ensure no conflicts, resource limits respected, constraints met

### Complexity
- **Time Complexity**: O(courses × lectures × days × available_slots)
- **Space Complexity**: O(total_scheduled_lectures)

### Limitations & Future Improvements
- Current implementation uses greedy approach (may not find optimal solution in all cases)
- Future: Implement constraint programming library (like OR-Tools) for better optimization
- Batch operations could improve performance for large institutions
- Instructor preferences not yet implemented

## 📝 API Endpoints

### Authentication
- `POST /api/auth/student/signup` - Student registration
- `POST /api/auth/student/login` - Student login
- `POST /api/auth/faculty/signup` - Faculty registration (requires department code)
- `POST /api/auth/faculty/login` - Faculty login

### Faculty Operations
- `POST /api/faculty/generate-timetable` - Generate timetable
- `POST /api/faculty/export-pdf` - Export timetable as PDF
- `POST /api/faculty/export-excel` - Export timetable as Excel

### Example Request
```bash
curl -X POST http://localhost:5173/api/faculty/generate-timetable \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "settings": {
      "dayStartTime": "08:00",
      "dayEndTime": "17:00",
      "lunchStartTime": "12:00",
      "lunchEndTime": "13:00",
      "defaultLectureDuration": 60
    },
    "courses": [
      {
        "id": "cs101",
        "name": "Intro to CS",
        "code": "CS101",
        "instructorName": "Dr. Smith",
        "lecturesPerWeek": 3,
        "isLab": false
      }
    ],
    "resources": [
      { "type": "classroom", "count": 5 },
      { "type": "lab", "count": 2 }
    ],
    "constraints": "No classes after 3 PM on Fridays"
  }'
```

## 🚢 Deployment

### Deploy to Vercel (Frontend)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Or connect your GitHub repo to Vercel for automatic deployments.

**Vercel Configuration**: See `vercel.json`

### Deploy to Render (Backend)

1. Connect your GitHub repository to Render
2. Create a new "Web Service"
3. Configure with `render.yaml`
4. Set environment variables:
   - `NODE_ENV=production`
   - `DATABASE_URL` (if using PostgreSQL)

**Render Configuration**: See `render.yaml`

### Production Checklist
- [ ] Use secure password hashing (bcrypt)
- [ ] Implement real database (PostgreSQL recommended)
- [ ] Set up environment variables securely
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Add rate limiting
- [ ] Set up monitoring and logging
- [ ] Configure database backups
- [ ] Test full CI/CD pipeline

## 📚 Database Schema

When integrating a real database (e.g., PostgreSQL), use this schema:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student', 'faculty') NOT NULL,
  department_code VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student courses
CREATE TABLE courses (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50),
  total_lectures INT NOT NULL,
  attended_lectures INT NOT NULL,
  target_percentage INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Faculty timetables
CREATE TABLE timetables (
  id UUID PRIMARY KEY,
  faculty_id UUID REFERENCES users(id),
  name VARCHAR(255),
  settings JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Timetable slots
CREATE TABLE timetable_slots (
  id UUID PRIMARY KEY,
  timetable_id UUID REFERENCES timetables(id),
  day VARCHAR(20) NOT NULL,
  start_time VARCHAR(5) NOT NULL,
  end_time VARCHAR(5) NOT NULL,
  course_name VARCHAR(255) NOT NULL,
  course_code VARCHAR(50),
  instructor_name VARCHAR(255) NOT NULL,
  resource_type ENUM('classroom', 'lab') NOT NULL,
  resource_id INT NOT NULL,
  is_lab BOOLEAN NOT NULL
);
```

## 🔧 Development Workflow

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Edit code in `client/` or `server/`
   - Follow existing code style and patterns

3. **Test locally**
   ```bash
   pnpm test
   pnpm run typecheck
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: your change description"
   ```

5. **Push and create pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Adding New Pages/Routes

1. Create new component in `client/pages/YourPage.tsx`
2. Add route in `client/App.tsx`:
   ```typescript
   <Route path="/your-route" element={<YourPage />} />
   ```

### Adding New API Endpoints

1. Create handler in `server/routes/your-route.ts`
2. Register in `server/index.ts`:
   ```typescript
   app.post("/api/your-endpoint", yourHandler);
   ```

### Adding Student Features

- Components go in `client/components/student/`
- Use `StudentDashboard.tsx` as entry point
- Leverage `CourseCard` and `AddCourseModal` components

### Adding Faculty Features

- Components go in `client/components/faculty/`
- Use `FacultyDashboard.tsx` as entry point
- Update timetable generation in `server/utils/timetable-generator.ts`

## 🎨 Styling & Theme

The app uses a **dark theme** with neon accents:

- **Background**: Deep charcoal (`#1a1a2e`)
- **Primary Accent**: Neon Cyan (`#00d4ff`)
- **Secondary Accent**: Magenta/Purple (`#ff006e`)
- **Cards**: Semi-transparent slate with borders

### CSS Variables (in `client/global.css`)

```css
:root {
  --background: 225 25% 11%;
  --primary: 180 100% 50%;
  --accent: 290 100% 50%;
}
```

### Adding Custom Styles

Use Tailwind utilities + custom CSS in global.css:

```tsx
<div className="bg-gradient-to-r from-cyan-400 to-purple-500">
  Custom gradient
</div>
```

## 📱 Responsive Design

The app is fully responsive for:
- Mobile (320px+)
- Tablet (768px+)
- Desktop (1024px+)

Use Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
pnpm run dev
```

### Build fails
```bash
# Clear cache and rebuild
rm -rf node_modules pnpm-lock.yaml dist/
pnpm install
pnpm run build
```

### Timetable generation empty
- Ensure courses are added
- Check resources are allocated
- Verify time settings are reasonable
- Review constraints for conflicts

### Authentication not working
- Clear localStorage: `localStorage.clear()`
- Refresh the page
- Check browser console for errors

## 📖 Additional Resources

- [Tailwind CSS Docs](https://tailwindcss.com)
- [React Router Docs](https://reactrouter.com)
- [Express.js Docs](https://expressjs.com)
- [Vite Docs](https://vitejs.dev)
- [Framer Motion Docs](https://www.framer.com/motion)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `pnpm test`
5. Commit and push
6. Open a pull request

## 📄 License

MIT License - See LICENSE file for details

## 🙋 Support

For issues, questions, or suggestions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include screenshots/error messages if applicable

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Maintained by**: ClassCanvas Team
