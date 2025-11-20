# Calendar Application with Authentication

A full-stack calendar application with user authentication supporting both manual (email/password) and Google OAuth login, with data stored in MongoDB Atlas.

## Features

- ✅ User authentication (Sign up / Sign in)
- ✅ Google OAuth authentication
- ✅ Protected routes
- ✅ JWT token-based authentication
- ✅ MongoDB Atlas integration
- ✅ User profile management
- ✅ Modern UI with shadcn/ui components

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite
- React Router
- TanStack Query
- shadcn/ui components
- Tailwind CSS

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Passport.js for Google OAuth
- JWT for token authentication
- bcryptjs for password hashing

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)
- Google Cloud Console account (for OAuth)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `backend` directory (copy from `.env.example`):
```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

4. Get MongoDB Atlas connection string:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a cluster (free tier available)
   - Click "Connect" → "Connect your application"
   - Copy the connection string and replace `<password>` with your password

5. Set up Google OAuth:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
   - Set application type to "Web application"
   - Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
   - Copy Client ID and Client Secret to `.env`

6. Start the backend server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `frontend` directory (copy from `.env.example`):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Project Structure

```
calender/
├── backend/
│   ├── config/
│   │   └── passport.js          # Google OAuth configuration
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── models/
│   │   └── User.js              # User schema/model
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   └── user.js              # User profile routes
│   ├── server.js                # Express server setup
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── auth.ts          # Authentication API client
│   │   ├── components/
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── ...
│   │   ├── context/
│   │   │   └── AuthContext.tsx  # Authentication context
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Signup.tsx
│   │   │   ├── AuthCallback.tsx
│   │   │   └── ...
│   │   └── App.tsx
│   └── package.json
└── README.md
```

## Database Schema

### User Model
```javascript
{
  email: String (unique, required for manual auth)
  password: String (hashed, required for manual auth)
  name: String (required)
  googleId: String (unique, for Google auth)
  avatar: String (optional)
  authMethod: String ('manual' | 'google')
  isEmailVerified: Boolean
  createdAt: Date
  updatedAt: Date
}
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/me` - Get current user (requires auth)
- `POST /api/auth/logout` - Logout (requires auth)

### User
- `GET /api/user/profile` - Get user profile (requires auth)
- `PUT /api/user/profile` - Update user profile (requires auth)

## Usage

1. Start both backend and frontend servers
2. Navigate to `http://localhost:5173`
3. You'll be redirected to login if not authenticated
4. Sign up with email/password or use Google OAuth
5. After authentication, you'll be redirected to the calendar

## Security Features

- Passwords are hashed using bcryptjs
- JWT tokens with expiration
- Protected API routes with authentication middleware
- CORS configuration for secure cross-origin requests
- Input validation on both client and server

## Notes

- Make sure MongoDB Atlas allows connections from your IP address (Network Access in Atlas dashboard)
- For production, update the `FRONTEND_URL` in backend `.env` to your production frontend URL
- Update Google OAuth redirect URI for production in Google Cloud Console
- Use strong, unique values for `JWT_SECRET` in production

