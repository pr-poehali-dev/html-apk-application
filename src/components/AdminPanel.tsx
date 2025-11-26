import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AdminPanelProps {
  userId: number;
  onTournamentCreated: () => void;
}

const AdminPanel = ({ userId, onTournamentCreated }: AdminPanelProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCreateTournament = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      action: 'create',
      name: formData.get('name'),
      description: formData.get('description'),
      prize_money: formData.get('prize_money'),
      max_participants: parseInt(formData.get('max_participants') as string),
      start_date: formData.get('start_date'),
      game_title: formData.get('game_title'),
      tournament_format: formData.get('tournament_format'),
      rules: formData.get('rules'),
      image_url: formData.get('image_url'),
    };

    try {
      const response = await fetch('https://functions.poehali.dev/c59fd766-60cf-4bf3-8f4b-49b277cb5f58', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId.toString(),
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast({ title: 'Успешно!', description: 'Турнир создан' });
        onTournamentCreated();
        (e.target as HTMLFormElement).reset();
      } else {
        toast({ title: 'Ошибка', description: result.error || 'Ошибка создания турнира', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Ошибка соединения', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="neon-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-purple))] flex items-center justify-center">
          <Icon name="Settings" size={20} className="text-[hsl(var(--darker-bg))]" />
        </div>
        <h2 className="text-2xl font-bold neon-glow">АДМИН-ПАНЕЛЬ</h2>
      </div>

      <form onSubmit={handleCreateTournament} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Название турнира *</Label>
            <Input
              id="name"
              name="name"
              required
              placeholder="Киберспортивный Чемпионат 2025"
              className="bg-[hsl(var(--muted))] border-[hsl(var(--border))]"
            />
          </div>

          <div>
            <Label htmlFor="game_title">Игра</Label>
            <Input
              id="game_title"
              name="game_title"
              placeholder="CS:GO, Dota 2, etc."
              className="bg-[hsl(var(--muted))] border-[hsl(var(--border))]"
            />
          </div>

          <div>
            <Label htmlFor="prize_money">Призовой фонд</Label>
            <Input
              id="prize_money"
              name="prize_money"
              placeholder="₽3,500,000"
              className="bg-[hsl(var(--muted))] border-[hsl(var(--border))]"
            />
          </div>

          <div>
            <Label htmlFor="max_participants">Максимум участников</Label>
            <Input
              id="max_participants"
              name="max_participants"
              type="number"
              defaultValue="64"
              className="bg-[hsl(var(--muted))] border-[hsl(var(--border))]"
            />
          </div>

          <div>
            <Label htmlFor="start_date">Дата начала</Label>
            <Input
              id="start_date"
              name="start_date"
              type="datetime-local"
              className="bg-[hsl(var(--muted))] border-[hsl(var(--border))]"
            />
          </div>

          <div>
            <Label htmlFor="tournament_format">Формат</Label>
            <Select name="tournament_format" defaultValue="Single Elimination">
              <SelectTrigger className="bg-[hsl(var(--muted))] border-[hsl(var(--border))]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Single Elimination">Single Elimination</SelectItem>
                <SelectItem value="Double Elimination">Double Elimination</SelectItem>
                <SelectItem value="Round Robin">Round Robin</SelectItem>
                <SelectItem value="Swiss">Swiss</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="description">Описание</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Описание турнира..."
            className="bg-[hsl(var(--muted))] border-[hsl(var(--border))] min-h-[100px]"
          />
        </div>

        <div>
          <Label htmlFor="rules">Правила</Label>
          <Textarea
            id="rules"
            name="rules"
            placeholder="Правила турнира..."
            className="bg-[hsl(var(--muted))] border-[hsl(var(--border))] min-h-[100px]"
          />
        </div>

        <div>
          <Label htmlFor="image_url">URL изображения</Label>
          <Input
            id="image_url"
            name="image_url"
            placeholder="https://example.com/image.jpg"
            className="bg-[hsl(var(--muted))] border-[hsl(var(--border))]"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-purple))] text-[hsl(var(--darker-bg))] hover:opacity-90"
        >
          {isLoading ? 'СОЗДАНИЕ...' : 'СОЗДАТЬ ТУРНИР'}
        </Button>
      </form>
    </Card>
  );
};

export default AdminPanel;
