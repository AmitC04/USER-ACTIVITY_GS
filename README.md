# GenoSpark Learning Platform

A comprehensive learning platform with user analytics, course management, and progress tracking built with Next.js, Express, and MySQL.

## Tech Stack

### Frontend
- Next.js 16 (App Router) + TypeScript
- React 19
- Tailwind CSS
- Radix UI
- Recharts
- Axios
- State: React Hooks only (useState, useEffect)

### Backend
- Node.js
- Express.js
- Prisma ORM
- MySQL 8
- JWT Authentication
- CORS Enabled

## Features

- User authentication (Register/Login)
- Dashboard with analytics and metrics
- Course management (Enrollments, Progress Tracking)
- Order history and management
- Reviews and ratings system
- Security monitoring and session management
- Responsive UI design

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MySQL 8
- Git

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit the `.env` file with your database credentials and JWT secrets.

4. Update the database schema:
```bash
npx prisma generate
npx prisma db push
```

5. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`.

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```
Update the `NEXT_PUBLIC_API_URL` to point to your backend server.

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`.

## Database Schema

The application uses the following models:

- **User**: Stores user information (id, name, email, password, etc.)
- **Course**: Course information (title, description, price, etc.)
- **Enrollment**: Links users to courses they're enrolled in
- **Order**: Purchase orders (order number, total amount, status, etc.)
- **Review**: Course reviews and ratings
- **Session**: User session tracking
- **Activity**: User activity logs
- **DashboardData**: Analytics and metrics for user dashboards

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires authentication)

### Dashboard
- `GET /api/dashboard/data` - Get dashboard metrics (requires authentication)
- `GET /api/dashboard/stats` - Get dashboard statistics (requires authentication)

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID

### Enrollments
- `GET /api/enrollments` - Get user enrollments
- `POST /api/enrollments` - Create enrollment

### Orders
- `GET /api/orders` - Get user orders

### Reviews
- `GET /api/reviews` - Get user reviews
- `POST /api/reviews` - Create review

### Activities
- `GET /api/activities` - Get user activities

### Sessions
- `GET /api/sessions` - Get active sessions

## Running the Application

1. Start the backend server:
```bash
cd server
npm run dev
```

2. In a new terminal, start the frontend:
```bash
cd client
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Troubleshooting

### Database Connection Issues
If you encounter authentication errors with MySQL, make sure to use the `authPlugin=mysql_native_password` parameter in your DATABASE_URL.

### Prisma Migration Issues
If migrations fail, try using `npx prisma db push` for development or check your database permissions.

## Project Structure

```
├── client/                 # Next.js frontend
│   ├── app/              # App Router pages
│   ├── components/       # React components
│   ├── lib/              # Utility functions
│   └── styles/           # Global styles
└── server/               # Express backend
    ├── prisma/           # Prisma schema and migrations
    ├── src/
    │   ├── controllers/  # Route controllers
    │   ├── routes/       # API routes
    │   ├── middleware/   # Authentication middleware
    │   ├── models/       # Data models
    │   └── utils/        # Utility functions
    └── config/           # Configuration files
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Session management
- Protected routes
- Input validation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request