import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/LoginForm';
import AnimatedTransition from '@/components/AnimatedTransition';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  useEffect(() => {
    // Redirect if already authenticated
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);
  
  return (
    <AnimatedTransition location="login">
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <LoginForm />
      </div>
    </AnimatedTransition>
  );
};

export default Login;
