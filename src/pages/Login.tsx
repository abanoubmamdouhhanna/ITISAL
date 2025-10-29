
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/LoginForm';
import AnimatedTransition from '@/components/AnimatedTransition';
import { useLanguage } from '@/context/LanguageContext';


const Login = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  useEffect(() => {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn) {
      navigate('/');
    }
  }, [navigate]);
  
  return (
    <AnimatedTransition location="login">
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <LoginForm />
      </div>
    </AnimatedTransition>
  );
};

export default Login;
