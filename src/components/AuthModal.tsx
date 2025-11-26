import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthSuccess: (user: any, token: string) => void;
}

const AuthModal = ({ open, onOpenChange, onAuthSuccess }: AuthModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      action: 'register',
      username: formData.get('username'),
      email: formData.get('email'),
      password: formData.get('password'),
      full_name: formData.get('full_name'),
    };

    try {
      const response = await fetch('https://functions.poehali.dev/789ef27e-aa67-4653-976e-e949fc84c3bf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast({ title: 'Успешно!', description: 'Вы зарегистрированы' });
        onAuthSuccess(result.user, result.token);
        onOpenChange(false);
      } else {
        toast({ title: 'Ошибка', description: result.error || 'Ошибка регистрации', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Ошибка соединения', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      action: 'login',
      username: formData.get('username'),
      password: formData.get('password'),
    };

    try {
      const response = await fetch('https://functions.poehali.dev/789ef27e-aa67-4653-976e-e949fc84c3bf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast({ title: 'Успешно!', description: 'Вы вошли в систему' });
        onAuthSuccess(result.user, result.token);
        onOpenChange(false);
      } else {
        toast({ title: 'Ошибка', description: result.error || 'Ошибка входа', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Ошибка соединения', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="neon-card border-[hsl(var(--neon-cyan))] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl neon-glow">ВХОД В СИСТЕМУ</DialogTitle>
          <DialogDescription>Зарегистрируйтесь или войдите в аккаунт</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[hsl(var(--muted))]">
            <TabsTrigger value="login">ВХОД</TabsTrigger>
            <TabsTrigger value="register">РЕГИСТРАЦИЯ</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="login-username">Имя пользователя</Label>
                <Input
                  id="login-username"
                  name="username"
                  required
                  className="bg-[hsl(var(--muted))] border-[hsl(var(--border))]"
                />
              </div>
              <div>
                <Label htmlFor="login-password">Пароль</Label>
                <Input
                  id="login-password"
                  name="password"
                  type="password"
                  required
                  className="bg-[hsl(var(--muted))] border-[hsl(var(--border))]"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-purple))] text-[hsl(var(--darker-bg))] hover:opacity-90"
              >
                {isLoading ? 'ВХОД...' : 'ВОЙТИ'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label htmlFor="register-username">Имя пользователя</Label>
                <Input
                  id="register-username"
                  name="username"
                  required
                  className="bg-[hsl(var(--muted))] border-[hsl(var(--border))]"
                />
              </div>
              <div>
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  name="email"
                  type="email"
                  required
                  className="bg-[hsl(var(--muted))] border-[hsl(var(--border))]"
                />
              </div>
              <div>
                <Label htmlFor="register-full-name">Полное имя</Label>
                <Input
                  id="register-full-name"
                  name="full_name"
                  className="bg-[hsl(var(--muted))] border-[hsl(var(--border))]"
                />
              </div>
              <div>
                <Label htmlFor="register-password">Пароль</Label>
                <Input
                  id="register-password"
                  name="password"
                  type="password"
                  required
                  className="bg-[hsl(var(--muted))] border-[hsl(var(--border))]"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-purple))] text-[hsl(var(--darker-bg))] hover:opacity-90"
              >
                {isLoading ? 'РЕГИСТРАЦИЯ...' : 'ЗАРЕГИСТРИРОВАТЬСЯ'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
