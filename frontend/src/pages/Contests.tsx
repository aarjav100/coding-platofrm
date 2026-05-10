import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNav } from '@/components/TopNav';
import { BackgroundEffects } from '@/components/BackgroundEffects';
import { GlobalFooter } from '@/components/GlobalFooter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Clock, Users, ChevronRight, Terminal, Zap, Shield, Target } from 'lucide-react';

const Contests = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const featuredContests = [
    {
      id: 'c1',
      title: "Obsidian Core Challenge",
      description: "Optimize the core kernel of the Obsidian architecture for maximum throughput.",
      startTime: "Starts in 2h 15m",
      participants: 1240,
      difficulty: "Elite",
      prize: "5,000 Pts",
      status: "upcoming"
    },
    {
      id: 'c2',
      title: "Reactive Ascension",
      description: "Build a real-time reactive dashboard using advanced state management patterns.",
      startTime: "Active Now",
      participants: 856,
      difficulty: "Advanced",
      prize: "2,500 Pts",
      status: "active"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface font-body antialiased selection:bg-primary selection:text-primary-foreground">
      <BackgroundEffects />
      <TopNav />

      <main className="relative z-10 pt-20 pb-32 px-4 md:px-12 max-w-screen-xl mx-auto">
        <section className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono uppercase tracking-[0.2em] mb-6">
            <Trophy className="w-3 h-3" />
            Active Arena
          </div>
          <h1 className="font-headline text-5xl md:text-6xl font-black tracking-tighter mb-4 uppercase">
            THE <span className="text-primary">ARENA.</span>
          </h1>
          <p className="text-on-surface-variant max-w-2xl font-light text-lg">
            Compete against the world's most capable architects. Prove your technical superiority and ascend the elite roster.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Contest Feed */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-primary/60 mb-6 flex items-center gap-2">
              <Zap className="w-3 h-3" />
              Priority Engagements
            </h2>
            
            {featuredContests.map((contest) => (
              <div key={contest.id} className="bg-surface-container-low border border-outline-variant/10 p-8 rounded-sm group hover:border-primary/30 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                   <Target className="w-24 h-24" />
                </div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <Badge variant="outline" className={`rounded-sm font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 ${contest.status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                      {contest.status}
                    </Badge>
                    <div className="flex items-center gap-2 text-on-surface-variant/60 font-mono text-[10px]">
                       <Clock className="w-3 h-3" />
                       {contest.startTime}
                    </div>
                  </div>
                  <h3 className="font-headline text-2xl font-black mb-3 group-hover:text-primary transition-colors">{contest.title}</h3>
                  <p className="text-on-surface-variant mb-8 font-light leading-relaxed">
                    {contest.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-outline-variant/5">
                    <div className="flex items-center gap-2">
                       <Users className="w-4 h-4 text-on-surface-variant/40" />
                       <span className="text-xs font-mono">{contest.participants} Architects</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <Shield className="w-4 h-4 text-on-surface-variant/40" />
                       <span className="text-xs font-mono">{contest.difficulty}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <Zap className="w-4 h-4 text-primary/60" />
                       <span className="text-xs font-mono text-primary">{contest.prize}</span>
                    </div>
                    <Button 
                      className="ml-auto rounded-sm bg-surface-container-highest hover:bg-primary hover:text-primary-foreground transition-all px-6"
                      onClick={() => navigate(`/contest/${contest.id}`)}
                    >
                      Deploy
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Info */}
          <div className="space-y-12">
            <div>
               <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-primary/60 mb-8 flex items-center gap-2">
                <Terminal className="w-3 h-3" />
                Arena Metrics
              </h2>
              <div className="bg-surface-container-lowest border border-outline-variant/10 p-6 rounded-sm space-y-6">
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-on-surface-variant font-mono">Global Peak</span>
                    <span className="text-sm font-bold">14,209 ops/s</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-on-surface-variant font-mono">Uptime</span>
                    <span className="text-sm font-bold text-green-500">99.99%</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-on-surface-variant font-mono">Avg Latency</span>
                    <span className="text-sm font-bold">12ms</span>
                 </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/10 p-8 rounded-sm">
               <h3 className="font-headline font-black text-xl mb-4">WANT TO HOST?</h3>
               <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
                 Enterprise partners can host private challenges to recruit top-tier technical talent from our roster.
               </p>
               <Button variant="outline" className="w-full rounded-sm border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground">
                 Contact Relations
               </Button>
            </div>
          </div>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
};

export default Contests;
