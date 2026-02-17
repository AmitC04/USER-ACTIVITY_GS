# 🎓 GenoSpark - Full Stack Learning Platform

A complete full-stack application with **Express.js backend** and **Next.js frontend**.

## 📁 Project Structure

```
genospark/
├── server/                    # Express.js Backend (Port 5000)
│   ├── src/
│   │   ├── controllers/      # Business logic (7 controllers)
│   │   ├── routes/           # API endpoints (7 route files)
│   │   ├── middleware/       # JWT authentication & validation
│   │   ├── utils/            # Validators, JWT, response handlers
│   │   ├── config/           # Database config
│   │   └── index.ts          # Server entry point
│   ├── prisma/
│   │   └── schema.prisma     # Database models (8 models)
│   ├── .env                  # Environment variables
│   ├── .env.example          # Template
│   └── package.json
│
├── client/                    # Next.js Frontend (Port 3000)
│   ├── app/                  # Next.js app directory
│   ├── components/           # React components
│   ├── lib/
│   │   └── api-client.ts     # Axios client (40+ API methods)
│   ├── styles/               # Tailwind CSS
│   ├── .env.local            # Frontend environment
│   ├── next.config.mjs
│   ├── tailwind.config.ts
│   └── package.json
│
├── docker-compose.yml        # MySQL database container
├── .gitignore
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker (for MySQL)
- npm or yarn

### Step 1: Start MySQL Database

```bash
docker-compose up -d
```

✅ MySQL runs on port 3306  
Database: `genospark` | User: `genospark_user` | Password: `genospark_password`

### Step 2: Setup Backend

```bash
cd server

# Install dependencies
npm install

# Generate Prisma Client
npm run prisma:generate

# Create database tables
npm run prisma:push

# Start backend server
npm run dev
```

✅ Backend running on `http://localhost:5000`  
📡 Health check: `http://localhost:5000/api/health`

### Step 3: Setup Frontend (New Terminal)

```bash
cd client

# Install dependencies
npm install

# Start frontend development server
npm run dev
```

✅ Frontend running on `http://localhost:3000`

## 🎯 What's Included

### Backend (Express.js + Node.js)
- ✅ **7 Controllers**: Auth, Course, Enrollment, Order, Review, Activity, Session
- ✅ **40+ API Endpoints**: Full CRUD for all resources
- ✅ **MVC Architecture**: Organized separation of concerns
- ✅ **JWT Authentication**: Secure token-based auth
- ✅ **Input Validation**: express-validator with custom schemas
- ✅ **Password Hashing**: bcryptjs for security
- ✅ **Prisma ORM**: Type-safe database queries
- ✅ **Error Handling**: Standardized response format
- ✅ **CORS Enabled**: Frontend can access backend

### Database (MySQL + Prisma)
8 Models with relationships:
- **User** - Students, instructors, admins
- **Course** - Learning courses with metadata
- **Enrollment** - User course enrollments with progress
- **Order** - Purchase orders
- **OrderItem** - Items in orders
- **Review** - Course reviews and ratings
- **Session** - Device session tracking
- **Activity** - User activity logging

### Frontend (Next.js + React)
- ✅ **Axios HTTP Client**: All API calls centralized
- ✅ **React Hooks**: useState, useEffect for state
- ✅ **TypeScript**: Full type safety
- ✅ **Tailwind CSS**: Responsive styling
- ✅ **Radix UI**: Accessible components
- ✅ **Zero Hardcoding**: All data from backend API
- ✅ **Auto Auth**: JWT token handling
- ✅ **Next.js App Router**: Modern routing

## 📡 API Response Format

All endpoints return standardized responses:

### Success (200-201)
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ },
  "statusCode": 200
}
```

### Error (400-500)
```json
{
  "success": false,
  "message": "Error description",
  "errors": { "field": ["error message"] },
  "statusCode": 400
}
```

## 🔑 Authentication

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

Response includes `token` - store in localStorage, sent automatically via Axios.

## 🛠️ Available Commands

### Backend
```bash
npm run dev              # Start dev server with hot reload
npm run build            # Build TypeScript to JavaScript
npm start                # Run production server
npm run prisma:generate  # Generate Prisma Client
npm run prisma:push      # Sync schema to database
npm run prisma:studio    # Open Prisma visual editor
npm run lint             # Run ESLint
```

### Frontend
```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Run production server
npm run lint             # Run linter
```

### Docker
```bash
docker-compose up -d     # Start MySQL background
docker-compose down      # Stop MySQL
docker-compose logs      # View logs
docker ps                # List running containers
```

## 💾 Database Management

### View Data with Prisma Studio
```bash
cd server
npm run prisma:studio
```
Opens GUI at `http://localhost:5555`

### Create New Table
1. Edit `server/prisma/schema.prisma`
2. Add your model
3. Run: `npm run prisma:push`

## 🌐 Environment Variables

### Server (.env)
```
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
DATABASE_URL="mysql://genospark_user:genospark_password@localhost:3306/genospark"
JWT_SECRET="your-jwt-secret-key"
REFRESH_TOKEN_SECRET="your-refresh-token-secret"
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🔧 Troubleshooting

### MySQL Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Fix**: Start Docker
```bash
docker-compose up -d
```

### Backend won't start
**Fix**: Install dependencies and generate Prisma
```bash
cd server
npm install
npm run prisma:generate
```

### Frontend can't reach API
**Fix**: Verify backend is running and check .env.local
```bash
# Check backend
curl http://localhost:5000/api/health

# Check frontend .env.local has correct API_URL
```

### Port already in use

**Port 3000**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

**Port 5000**:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### Prisma Client missing
```bash
cd server
npm run prisma:generate
npm install
```

## 🎨 API Endpoints

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Courses
- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course details
- `GET /api/courses/stats` - Course statistics
- `POST /api/courses` - Create course (admin)
- `PUT /api/courses/:id` - Update course (admin)
- `DELETE /api/courses/:id` - Delete course (admin)

### Enrollments
- `POST /api/enrollments/enroll` - Enroll in course (protected)
- `GET /api/enrollments` - Get user enrollments (protected)
- `PATCH /api/enrollments/:id/progress` - Update progress (protected)

### Orders
- `GET /api/orders` - Get user orders (protected)
- `POST /api/orders` - Create order (protected)
- `GET /api/orders/:id` - Get order details (protected)

### Reviews
- `GET /api/reviews/course/:id` - Get course reviews
- `GET /api/reviews` - Get user reviews (protected)
- `POST /api/reviews` - Create review (protected)
- `PUT /api/reviews/:id` - Update review (protected)
- `DELETE /api/reviews/:id` - Delete review (protected)

### Activities
- `GET /api/activities` - Get user activities (protected)
- `GET /api/activities/unread-count` - Unread count (protected)
- `PATCH /api/activities/:id/read` - Mark as read (protected)
- `PATCH /api/activities/read-all` - Mark all as read (protected)

### Sessions
- `GET /api/sessions/active` - Get active sessions (protected)
- `GET /api/sessions` - Get all sessions (protected)
- `DELETE /api/sessions/:id` - End session (protected)
- `POST /api/sessions/logout-all` - End all sessions (protected)

## 📝 Making API Calls from Frontend

Use the centralized Axios client:

```typescript
import { apiClient } from '@/lib/api-client';

// Register
const response = await apiClient.auth.register({
  name: 'John',
  email: 'john@example.com',
  password: 'pass123'
});

// Get all courses
const courses = await apiClient.courses.getAll({ page: 1, limit: 10 });

// Enroll in course
await apiClient.enrollments.enroll({ courseId: 1 });

// Get user profile
const profile = await apiClient.auth.getProfile();
```

All methods are **type-safe** and use proper HTTP verbs.

## 🚢 Production Deployment

### Backend (Heroku/Railway)
```bash
cd server
npm run build
# Deploy dist/ folder
```

### Frontend (Vercel)
```bash
cd client
# Connect GitHub repository
# Auto-deploys on push
```

### Environment Variables (Production)
Update `.env` files with production values:
- Database URL pointing to production MySQL
- JWT secrets (strong random values)
- API URLs matching production domains
- `NODE_ENV=production`

## 📚 Project Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend Framework** | Next.js 14 |
| **Frontend Library** | React 19 |
| **Type System** | TypeScript 5.3 |
| **HTTP Client** | Axios 1.7 |
| **CSS Framework** | Tailwind CSS 3.4 |
| **UI Components** | Radix UI |
| **Backend Framework** | Express.js 4.18 |
| **Backend Runtime** | Node.js 18+ |
| **ORM** | Prisma 5.7 |
| **Database** | MySQL 8.0 |
| **Authentication** | JWT (jsonwebtoken) |
| **Password Hashing** | bcryptjs 2.4 |
| **Containerization** | Docker |

## ✅ Full Feature Checklist

- ✅ User registration and login
- ✅ JWT authentication
- ✅ Course management
- ✅ Course enrollment
- ✅ Purchase orders
- ✅ Course reviews and ratings
- ✅ Progress tracking
- ✅ Activity logging
- ✅ Session management
- ✅ Input validation
- ✅ Error handling
- ✅ Database relationships
- ✅ Password hashing
- ✅ CORS enabled
- ✅ TypeScript throughout
- ✅ Responsive UI
- ✅ API documentation

## 🎉 You're Ready!

Start developing your learning platform:

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev

# Terminal 3 (Optional) - Database
cd server
npm run prisma:studio
```

Visit:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000/api/health
- **Database GUI**: http://localhost:5555

Happy coding! 🚀
