import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import AuthModal from '@/components/AuthModal';
import AdminPanel from '@/components/AdminPanel';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string>('');
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingTournaments, setIsLoadingTournaments] = useState(false);
  const { toast } = useToast();

  const playerStats = {
    name: user?.username || 'ГОСТЬ',
    rank: 'ЭЛИТА',
    rating: 2847,
    wins: 324,
    losses: 156,
    winRate: 67.5,
    kda: 3.8,
  };

  const recentMatches = [
    { id: 1, opponent: 'ТЕНЕВОЙ_ЯСТРЕБ', result: 'WIN', score: '16-12', time: '2 часа назад' },
    { id: 2, opponent: 'НЕОН_ШТУРМ', result: 'WIN', score: '16-9', time: '5 часов назад' },
    { id: 3, opponent: 'ТЕМНЫЙ_ФЕНИКС', result: 'LOSS', score: '14-16', time: '1 день назад' },
    { id: 4, opponent: 'КИБЕР_ПРИЗРАК', result: 'WIN', score: '16-7', time: '1 день назад' },
  ];

  const achievements = [
    { id: 1, title: 'Мастер Хедшотов', icon: 'Target', progress: 85, total: 100 },
    { id: 2, title: 'Серия Побед', icon: 'Flame', progress: 12, total: 20 },
    { id: 3, title: 'Элита Турниров', icon: 'Trophy', progress: 8, total: 10 },
  ];

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    loadTournaments();
  }, []);

  const loadTournaments = async (search = '') => {
    setIsLoadingTournaments(true);
    try {
      const url = new URL('https://functions.poehali.dev/c59fd766-60cf-4bf3-8f4b-49b277cb5f58');
      if (search) url.searchParams.append('search', search);
      
      const response = await fetch(url.toString());
      const result = await response.json();
      
      if (response.ok) {
        setTournaments(result.tournaments || []);
      }
    } catch (error) {
      console.error('Error loading tournaments:', error);
    } finally {
      setIsLoadingTournaments(false);
    }
  };

  const handleAuthSuccess = (userData: any, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
  };

  const handleLogout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast({ title: 'Вы вышли из системы' });
  };

  const handleRegisterForTournament = async (tournamentId: number) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    try {
      const response = await fetch('https://functions.poehali.dev/c59fd766-60cf-4bf3-8f4b-49b277cb5f58', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.id.toString(),
        },
        body: JSON.stringify({
          action: 'register',
          tournament_id: tournamentId,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast({ title: 'Успешно!', description: result.message });
        loadTournaments(searchQuery);
      } else {
        toast({ title: 'Ошибка', description: result.error, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Ошибка соединения', variant: 'destructive' });
    }
  };

  const handleSearch = () => {
    loadTournaments(searchQuery);
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--darker-bg))] text-foreground">
      <div className="scan-line absolute inset-0 pointer-events-none opacity-20" />
      
      <div className="relative z-10">
        <header className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] backdrop-blur-lg sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-purple))] flex items-center justify-center">
                  <Icon name="Zap" className="text-[hsl(var(--darker-bg))]" size={24} />
                </div>
                <h1 className="text-3xl font-bold glitch neon-glow">КИБЕРСПОРТ PRO</h1>
              </div>
              
              <div className="flex items-center gap-4">
                {user ? (
                  <>
                    <div className="pulse-glow rounded-full px-4 py-2 bg-[hsl(var(--muted))] border border-[hsl(var(--neon-cyan))] flex items-center gap-2">
                      <Icon name="User" size={16} />
                      <span className="text-sm font-medium">{user.username}</span>
                    </div>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="border-[hsl(var(--neon-cyan))] text-[hsl(var(--neon-cyan))] hover:bg-[hsl(var(--neon-cyan))] hover:text-[hsl(var(--darker-bg))]"
                    >
                      ВЫХОД
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setAuthModalOpen(true)}
                    className="bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-purple))] text-[hsl(var(--darker-bg))] hover:opacity-90"
                  >
                    ВХОД / РЕГИСТРАЦИЯ
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          {user?.is_admin && (
            <div className="mb-8">
              <AdminPanel userId={user.id} onTournamentCreated={() => loadTournaments(searchQuery)} />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="neon-card p-6 col-span-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-purple))] p-1">
                  <div className="w-full h-full rounded-full bg-[hsl(var(--card))] flex items-center justify-center">
                    <Icon name="User" size={32} className="text-[hsl(var(--neon-cyan))]" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold neon-glow">{playerStats.name}</h2>
                  <Badge className="bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-purple))] text-[hsl(var(--darker-bg))] border-0">
                    {playerStats.rank}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">РЕЙТИНГ</span>
                  <span className="text-2xl font-bold neon-glow">{playerStats.rating}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">K/D/A</span>
                  <span className="text-xl font-bold text-[hsl(var(--neon-cyan))]">{playerStats.kda}</span>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">% ПОБЕД</span>
                    <span className="text-sm font-bold text-[hsl(var(--neon-cyan))]">{playerStats.winRate}%</span>
                  </div>
                  <Progress value={playerStats.winRate} className="h-2 bg-[hsl(var(--muted))]" />
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[hsl(var(--border))]">
                  <div>
                    <div className="text-sm text-muted-foreground">ПОБЕДЫ</div>
                    <div className="text-xl font-bold text-green-400">{playerStats.wins}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">ПОРАЖЕНИЯ</div>
                    <div className="text-xl font-bold text-red-400">{playerStats.losses}</div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="neon-card p-6 col-span-1 lg:col-span-2">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Icon name="Trophy" className="text-[hsl(var(--neon-cyan))]" />
                ДОСТИЖЕНИЯ
              </h3>
              <div className="space-y-6">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-cyan))] flex items-center justify-center pulse-glow">
                          <Icon name={achievement.icon as any} size={24} className="text-[hsl(var(--darker-bg))]" />
                        </div>
                        <div>
                          <div className="font-bold">{achievement.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {achievement.progress} / {achievement.total}
                          </div>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-[hsl(var(--neon-cyan))]">
                        {Math.round((achievement.progress / achievement.total) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={(achievement.progress / achievement.total) * 100} 
                      className="h-2 bg-[hsl(var(--muted))]"
                    />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-1">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(var(--neon-cyan))] data-[state=active]:to-[hsl(var(--neon-purple))] data-[state=active]:text-[hsl(var(--darker-bg))]"
              >
                <Icon name="LayoutDashboard" size={16} className="mr-2" />
                ОБЗОР
              </TabsTrigger>
              <TabsTrigger 
                value="tournaments"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(var(--neon-cyan))] data-[state=active]:to-[hsl(var(--neon-purple))] data-[state=active]:text-[hsl(var(--darker-bg))]"
              >
                <Icon name="Award" size={16} className="mr-2" />
                ТУРНИРЫ
              </TabsTrigger>
              <TabsTrigger 
                value="matches"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(var(--neon-cyan))] data-[state=active]:to-[hsl(var(--neon-purple))] data-[state=active]:text-[hsl(var(--darker-bg))]"
              >
                <Icon name="Swords" size={16} className="mr-2" />
                МАТЧИ
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'ВСЕГО МАТЧЕЙ', value: playerStats.wins + playerStats.losses, icon: 'Target', color: 'neon-cyan' },
                  { label: 'СРЕДНИЙ K/D/A', value: playerStats.kda.toFixed(1), icon: 'Zap', color: 'neon-purple' },
                  { label: '% ПОБЕД', value: `${playerStats.winRate}%`, icon: 'TrendingUp', color: 'neon-cyan' },
                  { label: 'ТЕКУЩАЯ СЕРИЯ', value: '5П', icon: 'Flame', color: 'neon-pink' },
                ].map((stat, idx) => (
                  <Card key={idx} className="neon-card p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-muted-foreground font-medium">{stat.label}</span>
                      <Icon name={stat.icon as any} size={20} className={`text-[hsl(var(--${stat.color}))]`} />
                    </div>
                    <div className="text-3xl font-bold neon-glow">{stat.value}</div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tournaments" className="space-y-4">
              <Card className="neon-card p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Поиск турниров..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="bg-[hsl(var(--muted))] border-[hsl(var(--border))]"
                  />
                  <Button
                    onClick={handleSearch}
                    className="bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-purple))] text-[hsl(var(--darker-bg))]"
                  >
                    <Icon name="Search" size={20} />
                  </Button>
                </div>
              </Card>

              {isLoadingTournaments ? (
                <Card className="neon-card p-8 text-center">
                  <div className="text-lg">Загрузка турниров...</div>
                </Card>
              ) : tournaments.length === 0 ? (
                <Card className="neon-card p-8 text-center">
                  <div className="text-lg text-muted-foreground">Турниры не найдены</div>
                </Card>
              ) : (
                tournaments.map((tournament) => (
                  <Card key={tournament.id} className="neon-card p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold">{tournament.name}</h3>
                          <Badge className={tournament.status === 'LIVE' 
                            ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 pulse-glow'
                            : 'bg-[hsl(var(--muted))] text-[hsl(var(--neon-cyan))]'
                          }>
                            {tournament.status}
                          </Badge>
                        </div>
                        {tournament.description && (
                          <p className="text-sm text-muted-foreground">{tournament.description}</p>
                        )}
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          {tournament.prize_money && (
                            <span className="flex items-center gap-2">
                              <Icon name="DollarSign" size={16} className="text-[hsl(var(--neon-cyan))]" />
                              {tournament.prize_money}
                            </span>
                          )}
                          <span className="flex items-center gap-2">
                            <Icon name="Users" size={16} className="text-[hsl(var(--neon-purple))]" />
                            {tournament.current_participants || 0} / {tournament.max_participants} Игроков
                          </span>
                          {tournament.game_title && (
                            <span className="flex items-center gap-2">
                              <Icon name="Gamepad2" size={16} className="text-[hsl(var(--neon-cyan))]" />
                              {tournament.game_title}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => handleRegisterForTournament(tournament.id)}
                        className="bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-purple))] text-[hsl(var(--darker-bg))] hover:opacity-90"
                      >
                        УЧАСТВОВАТЬ
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="matches" className="space-y-4">
              {recentMatches.map((match) => (
                <Card key={match.id} className="neon-card p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className={`text-sm font-bold px-4 py-2 rounded-lg ${
                        match.result === 'WIN' 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                          : 'bg-red-500/20 text-red-400 border border-red-500/50'
                      }`}>
                        {match.result}
                      </div>
                      <div>
                        <div className="font-bold text-lg">VS {match.opponent}</div>
                        <div className="text-sm text-muted-foreground">{match.time}</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold neon-glow">{match.score}</div>
                  </div>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </main>

        <footer className="border-t border-[hsl(var(--border))] bg-[hsl(var(--card))] mt-12">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                © 2025 КИБЕРСПОРТ PRO. Все права защищены.
              </div>
              <div className="flex items-center gap-4">
                <Icon name="Github" size={20} className="text-muted-foreground hover:text-[hsl(var(--neon-cyan))] cursor-pointer transition-colors" />
                <Icon name="Twitter" size={20} className="text-muted-foreground hover:text-[hsl(var(--neon-cyan))] cursor-pointer transition-colors" />
                <Icon name="MessageCircle" size={20} className="text-muted-foreground hover:text-[hsl(var(--neon-cyan))] cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
        </footer>
      </div>

      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Index;
