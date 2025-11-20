import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { authAPI } from '@/api/auth';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const error = searchParams.get('error');

  useEffect(() => {
    if (error) {
      // Handle error - redirect to login
      navigate('/login?error=authentication_failed');
      return;
    }

    if (token) {
      // Store token and get user info
      localStorage.setItem('token', token);
      
      authAPI.getCurrentUser(token)
        .then((user) => {
          localStorage.setItem('user', JSON.stringify(user));
          // Reload page to update auth context
          window.location.href = '/calendar';
        })
        .catch(() => {
          navigate('/login?error=authentication_failed');
        });
    } else {
      navigate('/login');
    }
  }, [token, error, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;

