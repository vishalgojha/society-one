import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/AuthContext';

export default function OperatorLogin() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setIsLoading(true);
    try {
      await login(email);
      toast.success('Magic link sent. Check your inbox to continue.');
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-white">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="operator@society.com"
            className="h-12 border-slate-700 bg-slate-800 text-white"
            disabled={isLoading}
          />
        </div>
        <Button type="submit" disabled={isLoading} className="h-12 w-full bg-emerald-500 text-white hover:bg-emerald-600">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <LogIn className="mr-2 h-5 w-5" />
              Send magic link
            </>
          )}
        </Button>
      </form>
      <p className="text-center text-xs text-slate-500">
        Access is provisioned per society. Ask an admin to create your operator profile first.
      </p>
    </div>
  );
}
