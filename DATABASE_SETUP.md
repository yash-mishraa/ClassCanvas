# ClassCanvas Database Setup Guide

This guide explains how to integrate PostgreSQL with ClassCanvas for persistent data storage in production.

## Current State (MVP)

The current implementation uses **localStorage** for data persistence:
- **Student courses**: Stored in browser's localStorage
- **Faculty timetables**: Stored in browser's localStorage  
- **Authentication**: In-memory session storage (demo only)

This is perfect for MVP and testing but should be replaced with a real database for production.

## Setting Up PostgreSQL

### Prerequisites

- PostgreSQL 14+ installed locally or use a managed service (Render, Heroku, AWS RDS, Neon, etc.)
- `psql` command-line tool
- Node.js database client (prisma, node-postgres, etc.)

### Option 1: Local PostgreSQL

```bash
# Install PostgreSQL (macOS)
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Create database
createdb classcanvas
createdb classcanvas_test

# Connect to database
psql classcanvas
```

### Option 2: Managed Service (Recommended for Production)

We recommend using **Neon** (PostgreSQL hosting) or **Render**:

**Neon Setup**:
1. Visit https://neon.tech
2. Create account and project
3. Get connection string: `postgresql://user:password@host/database`

**Render Setup**:
1. Use Render's PostgreSQL add-on when creating your web service
2. Connection string provided in environment variables

## Installing Prisma ORM

Prisma is recommended for type-safe database access:

```bash
# Install Prisma and client
pnpm add -D prisma
pnpm add @prisma/client

# Initialize Prisma
pnpm exec prisma init
```

This creates `prisma/schema.prisma` and `.env.local`.

## Database Schema

### Schema Definition (prisma/schema.prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Users table
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  role          Role
  departmentCode String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  courses       Course[]
  timetables    Timetable[]

  @@map("users")
}

enum Role {
  STUDENT
  FACULTY
}

// Student courses
model Course {
  id                 String   @id @default(cuid())
  userId             String
  name               String
  code               String?
  totalLectures      Int
  attendedLectures   Int
  targetPercentage   Int
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  // Relations
  user               User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("courses")
  @@index([userId])
}

// Faculty timetables
model Timetable {
  id           String        @id @default(cuid())
  facultyId    String
  name         String?
  settings     Json          // Store settings as JSON
  courses      Json[]        // Store course data
  resources    Json          // Store resource allocation
  constraints  String?
  slots        TimeSlot[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  // Relations
  faculty      User          @relation(fields: [facultyId], references: [id], onDelete: Cascade)

  @@map("timetables")
  @@index([facultyId])
}

// Individual time slots in timetable
model TimeSlot {
  id             String   @id @default(cuid())
  timetableId    String
  day            String
  startTime      String
  endTime        String
  courseName     String
  courseCode     String?
  instructorName String
  resourceType   String   // "classroom" or "lab"
  resourceId     Int
  isLab          Boolean

  // Relations
  timetable      Timetable @relation(fields: [timetableId], references: [id], onDelete: Cascade)

  @@map("time_slots")
  @@index([timetableId])
}
```

## Setting Up Environment Variables

Create `.env.local`:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/classcanvas"

# Server
NODE_ENV="development"
PORT="3000"

# Client
VITE_API_URL="http://localhost:5173"
```

For production on Render or Vercel, use environment variables in their dashboards.

## Creating Migrations

```bash
# Create initial migration
pnpm exec prisma migrate dev --name init

# Generate Prisma Client
pnpm exec prisma generate
```

This creates migration files in `prisma/migrations/`.

## Updating Backend to Use Database

### 1. Install bcrypt for password hashing

```bash
pnpm add bcryptjs
pnpm add -D @types/bcryptjs
```

### 2. Update auth route (server/routes/auth.ts)

```typescript
import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { AuthRequest, FacultySignUpRequest } from "@shared/api";

const prisma = new PrismaClient();

export const studentSignUp: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body as AuthRequest;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: "STUDENT",
      },
    });

    // Generate token (implement JWT in production)
    const token = Buffer.from(`${email}:${Date.now()}`).toString("base64");

    res.status(201).json({
      token,
      user: { id: user.id, email, role: "student" },
    });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const studentSignIn: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body as AuthRequest;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.role !== "STUDENT") {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = Buffer.from(`${email}:${Date.now()}`).toString("base64");

    res.json({
      token,
      user: { id: user.id, email, role: "student" },
    });
  } catch (error) {
    console.error("Error in signin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Similar implementation for facultySignUp and facultySignIn
```

### 3. Update faculty route to save timetables

```typescript
export const generateTimetableHandler: RequestHandler = async (req, res) => {
  try {
    const { settings, courses, resources, constraints, name } = req.body;
    const userId = req.user?.id; // From auth middleware

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Generate timetable (existing logic)
    const timetable = generateTimetable(settings, courses, resources, constraints);

    // Save to database
    const saved = await prisma.timetable.create({
      data: {
        facultyId: userId,
        name: name || `Timetable ${new Date().toLocaleDateString()}`,
        settings,
        courses,
        resources,
        constraints,
        slots: {
          create: timetable.map(slot => ({
            ...slot,
            timetableId: undefined, // Will be set by Prisma
          })),
        },
      },
      include: { slots: true },
    });

    res.json({
      success: true,
      timetable: saved,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to generate timetable" });
  }
};
```

## Seeding Demo Data

Create `prisma/seed.ts`:

```typescript
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create demo users
  const student = await prisma.user.upsert({
    where: { email: "student@demo.com" },
    update: {},
    create: {
      email: "student@demo.com",
      passwordHash: await bcrypt.hash("password123", 10),
      role: Role.STUDENT,
    },
  });

  const faculty = await prisma.user.upsert({
    where: { email: "faculty@demo.com" },
    update: {},
    create: {
      email: "faculty@demo.com",
      passwordHash: await bcrypt.hash("password123", 10),
      role: Role.FACULTY,
      departmentCode: "CS001",
    },
  });

  // Create sample courses for student
  await prisma.course.createMany({
    data: [
      {
        userId: student.id,
        name: "Data Structures",
        code: "CS201",
        totalLectures: 40,
        attendedLectures: 35,
        targetPercentage: 75,
      },
      {
        userId: student.id,
        name: "Algorithms",
        code: "CS202",
        totalLectures: 40,
        attendedLectures: 32,
        targetPercentage: 80,
      },
      {
        userId: student.id,
        name: "Database Systems",
        code: "CS203",
        totalLectures: 45,
        attendedLectures: 40,
        targetPercentage: 85,
      },
    ],
  });

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Add to `package.json`:

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

Run seed:

```bash
pnpm exec prisma db seed
```

## Running Migrations

```bash
# Apply pending migrations
pnpm exec prisma migrate deploy

# Develop with automatic migrations
pnpm exec prisma migrate dev

# Reset database (dev only)
pnpm exec prisma migrate reset
```

## Connecting to Database Service

### Render PostgreSQL

When you create a PostgreSQL database on Render, you get a `DATABASE_URL` environment variable. Add it to your environment in Render dashboard.

### Neon PostgreSQL

1. Create project at https://neon.tech
2. Get connection string
3. Set as `DATABASE_URL` environment variable
4. Important: Add `?sslmode=require` to connection string for production

### AWS RDS

1. Create RDS instance
2. Get endpoint
3. Create connection string: `postgresql://user:password@endpoint:5432/dbname`
4. Set as environment variable

## Monitoring & Maintenance

### View Database

```bash
# Open Prisma Studio
pnpm exec prisma studio
```

### Backup

```bash
# Export PostgreSQL
pg_dump classcanvas > backup.sql

# Restore
psql classcanvas < backup.sql
```

## Troubleshooting

### Connection refused
- Verify PostgreSQL is running: `pg_isready`
- Check DATABASE_URL format
- Verify credentials and database name

### Schema mismatch
```bash
# Re-sync schema
pnpm exec prisma db push --force-reset
```

### Migrations conflict
```bash
# Resolve by resetting (dev only)
pnpm exec prisma migrate resolve --rolled-back migration_name
```

## Production Checklist

- [ ] Migrate from localStorage to database
- [ ] Implement proper authentication (JWT with refresh tokens)
- [ ] Use bcrypt for password hashing
- [ ] Set up database backups
- [ ] Enable SSL/TLS for database connections
- [ ] Use connection pooling
- [ ] Implement rate limiting
- [ ] Add database monitoring
- [ ] Set up automated migrations on deploy
- [ ] Test rollback procedures

---

For questions or issues with database setup, refer to:
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Neon Documentation](https://neon.tech/docs)
