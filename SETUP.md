# Quick Setup Guide

## Step 1: MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free account
3. Create a new cluster (choose FREE tier)
4. Create a database user:
   - Go to "Database Access" → "Add New Database User"
   - Choose "Password" authentication
   - Save the username and password
5. Whitelist your IP:
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for development) or add your specific IP
6. Get connection string:
   - Go to "Database" → "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/calendar?retryWrites=true&w=majority`

## Step 2: Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - If prompted, configure OAuth consent screen:
     - Choose "External" user type
     - Fill in app name, user support email, developer contact
     - Add scopes: `email`, `profile`
     - Add test users if needed
   - Create OAuth 2.0 Client ID:
     - Application type: "Web application"
     - Name: "Calendar App"
     - Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
     - Click "Create"
   - Copy the Client ID and Client Secret

## Step 3: Backend Configuration

1. Navigate to `backend` folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
# Copy the example file (if it exists) or create new
```

4. Add your configuration to `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/calendar?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

5. Start the backend:
```bash
npm run dev
```

You should see:
```
✅ Connected to MongoDB Atlas
🚀 Server running on port 5000
```

## Step 4: Frontend Configuration

1. Navigate to `frontend` folder (in a new terminal):
```bash
cd frontend
```

2. Install dependencies (if not already done):
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the frontend:
```bash
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

## Step 5: Test the Application

1. Open your browser to `http://localhost:5173`
2. You should be redirected to the login page
3. Try signing up with email/password
4. Or click "Continue with Google" to test OAuth

## Troubleshooting

### MongoDB Connection Issues
- Make sure your IP is whitelisted in MongoDB Atlas
- Verify the connection string is correct
- Check that the database user password doesn't contain special characters that need URL encoding

### Google OAuth Issues
- Verify the redirect URI matches exactly: `http://localhost:5000/api/auth/google/callback`
- Make sure Google+ API is enabled
- Check that OAuth consent screen is configured
- For development, you may need to add your email as a test user

### CORS Issues
- Make sure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check that both servers are running

### Port Already in Use
- Change `PORT` in backend `.env` to a different port (e.g., 5001)
- Update `VITE_API_URL` in frontend `.env` accordingly

## Next Steps

- Customize the user model if needed
- Add email verification for manual signups
- Add password reset functionality
- Customize the UI/UX
- Deploy to production (update environment variables accordingly)

