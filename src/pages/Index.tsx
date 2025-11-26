import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [selectedTab, setSelectedTab] = useState('overview');

  const playerStats = {
    name: 'CYBER_KNIGHT',
    rank: 'ELITE',
    rating: 2847,
    wins: 324,
    losses: 156,
    winRate: 67.5,
    kda: 3.8,
  };

  const tournaments = [
    { id: 1, name: 'Cyber Championship 2025', status: 'LIVE', prize: '$50,000', participants: 128 },
    { id: 2, name: 'Neon League Finals', status: 'UPCOMING', prize: '$25,000', participants: 64 },
    { id: 3, name: 'Digital Warfare Pro', status: 'UPCOMING', prize: '$15,000', participants: 32 },
  ];

  const recentMatches = [
    { id: 1, opponent: 'SHADOW_HAWK', result: 'WIN', score: '16-12', time: '2 hours ago' },
    { id: 2, opponent: 'NEON_STRIKER', result: 'WIN', score: '16-9', time: '5 hours ago' },
    { id: 3, opponent: 'DARK_PHOENIX', result: 'LOSS', score: '14-16', time: '1 day ago' },
    { id: 4, opponent: 'CYBER_GHOST', result: 'WIN', score: '16-7', time: '1 day ago' },
  ];

  const achievements = [
    { id: 1, title: 'Headshot Master', icon: 'Target', progress: 85, total: 100 },
    { id: 2, title: 'Victory Streak', icon: 'Flame', progress: 12, total: 20 },
    { id: 3, title: 'Tournament Elite', icon: 'Trophy', progress: 8, total: 10 },
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--darker-bg))] text-foreground">
      <div className="scan-line absolute inset-0 pointer-events-none opacity-20" />
      
      <div className="relative z-10">
        <header className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] backdrop-blur-lg">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-purple))] flex items-center justify-center">
                  <Icon name="Zap" className="text-[hsl(var(--darker-bg))]" size={24} />
                </div>
                <h1 className="text-3xl font-bold glitch neon-glow">ESPORTS PRO</h1>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="pulse-glow rounded-full px-6 py-2 bg-[hsl(var(--muted))] border border-[hsl(var(--neon-cyan))]">
                  <span className="text-sm font-medium">ONLINE</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
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
                  <span className="text-sm text-muted-foreground">RATING</span>
                  <span className="text-2xl font-bold neon-glow">{playerStats.rating}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">K/D/A</span>
                  <span className="text-xl font-bold text-[hsl(var(--neon-cyan))]">{playerStats.kda}</span>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">WIN RATE</span>
                    <span className="text-sm font-bold text-[hsl(var(--neon-cyan))]">{playerStats.winRate}%</span>
                  </div>
                  <Progress value={playerStats.winRate} className="h-2 bg-[hsl(var(--muted))]" />
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[hsl(var(--border))]">
                  <div>
                    <div className="text-sm text-muted-foreground">WINS</div>
                    <div className="text-xl font-bold text-green-400">{playerStats.wins}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">LOSSES</div>
                    <div className="text-xl font-bold text-red-400">{playerStats.losses}</div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="neon-card p-6 col-span-1 lg:col-span-2">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Icon name="Trophy" className="text-[hsl(var(--neon-cyan))]" />
                ACHIEVEMENTS
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
                OVERVIEW
              </TabsTrigger>
              <TabsTrigger 
                value="tournaments"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(var(--neon-cyan))] data-[state=active]:to-[hsl(var(--neon-purple))] data-[state=active]:text-[hsl(var(--darker-bg))]"
              >
                <Icon name="Award" size={16} className="mr-2" />
                TOURNAMENTS
              </TabsTrigger>
              <TabsTrigger 
                value="matches"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(var(--neon-cyan))] data-[state=active]:to-[hsl(var(--neon-purple))] data-[state=active]:text-[hsl(var(--darker-bg))]"
              >
                <Icon name="Swords" size={16} className="mr-2" />
                MATCHES
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'TOTAL MATCHES', value: playerStats.wins + playerStats.losses, icon: 'Target', color: 'neon-cyan' },
                  { label: 'AVG K/D/A', value: playerStats.kda.toFixed(1), icon: 'Zap', color: 'neon-purple' },
                  { label: 'WIN RATE', value: `${playerStats.winRate}%`, icon: 'TrendingUp', color: 'neon-cyan' },
                  { label: 'CURRENT STREAK', value: '5W', icon: 'Flame', color: 'neon-pink' },
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
              {tournaments.map((tournament) => (
                <Card key={tournament.id} className="neon-card p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold">{tournament.name}</h3>
                        <Badge className={tournament.status === 'LIVE' 
                          ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 pulse-glow'
                          : 'bg-[hsl(var(--muted))] text-[hsl(var(--neon-cyan))]'
                        }>
                          {tournament.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <Icon name="DollarSign" size={16} className="text-[hsl(var(--neon-cyan))]" />
                          {tournament.prize}
                        </span>
                        <span className="flex items-center gap-2">
                          <Icon name="Users" size={16} className="text-[hsl(var(--neon-purple))]" />
                          {tournament.participants} Players
                        </span>
                      </div>
                    </div>
                    <Icon name="ChevronRight" size={24} className="text-[hsl(var(--neon-cyan))]" />
                  </div>
                </Card>
              ))}
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
                © 2025 ESPORTS PRO. All rights reserved.
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
    </div>
  );
};

export default Index;
