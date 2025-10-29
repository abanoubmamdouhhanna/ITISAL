
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { login } from '@/lib/auth'; 

interface LoginFormProps {
  onLoginSuccess?: () => void;
}


const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);
  
    // // Simple validation
    // if (!username || !password) {
    //   setError('Please enter both username and password');
    //   setIsLoading(false);
    //   return;
    // }
  
    try {
      const responseMessage = await login({ userName: username, password });
  
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify({ username }));
  
      toast.success('Login successful!');
  
      if (onLoginSuccess) {
        onLoginSuccess();
      }
  
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Login failed');
      toast.error(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <Card className="w-full max-w-md p-6">
      <div className="text-center mb-6">
        <img 
          src="/lovable-uploads/7d436c20-8067-41f7-9bbf-dd60f8aea80b.png" 
          alt="Golden Box Logo" 
          className="h-12 w-auto mx-auto mb-4" 
        />
        <h1 className="text-2xl font-semibold mb-1">{t('login.title')}</h1>
      </div>
      
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">{t('app.username')}</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t('login.username_placeholder')}
              autoComplete="username"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">{t('app.password')}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('login.password_placeholder')}
              autoComplete="current-password"
              disabled={isLoading}
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t('app.loading') : t('login.button')}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default LoginForm;
