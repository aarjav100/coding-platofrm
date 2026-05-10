import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TopNav } from "@/components/TopNav";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { GlobalFooter } from "@/components/GlobalFooter";
import { ModuleCard } from "@/components/ModuleCard";
import { modules } from "@/data/modules";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Code2, Search, Sparkles, BookOpen, Play, LogIn, LogOut, User, Trophy, Layers, ShoppingBag, Crown, ArrowRight, Terminal, Zap, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  MixedContentCarousel,
  CodeSnippetCarousel,
  TestimonialCarousel,
  InfiniteLoopCarousel,
} from "@/components/carousels";

// Hero slides data updated for Obsidian style
const heroSlides = [
  {
    type: 'content' as const,
    title: "THE ELITE ROSTER.",
    description: "Master the technical arts with precision, speed, and architectural integrity. Join the top 0.1% of global minds.",
    badge: "NexCode Elite",
    ctaText: "Start Deployment",
    ctaLink: "/auth",
    gradient: "bg-gradient-to-br from-background via-surface-container-low to-primary/10",
  },
  {
    type: 'image' as const,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80",
    title: "ARCHITECT YOUR FUTURE.",
    description: "Learn to build scalable systems with deep-dive modules in React, Node, and System Design.",
    badge: "New Modules",
    ctaText: "Browse Curriculum",
    ctaLink: "#modules",
  },
];

const codeExamples = [
  {
    title: "Obsidian Component Structure",
    language: "typescript",
    code: `interface SystemConfig {
  architecture: 'monolithic' | 'microservices';
  integrity: number; // 0.0 to 1.0
}

const initializeDeployment = (config: SystemConfig) => {
  console.log(\`Initializing \${config.architecture} system...\`);
  return config.integrity > 0.99 ? "ELITE" : "STANDARD";
};`,
    description: "Type-safe architectural configuration",
  },
];

const Index = () => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    toast({
      title: "Connection Terminated",
      description: "See you in the next cycle, Architect.",
    });
  };

  const filteredModules = modules.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-on-surface font-body antialiased overflow-x-hidden selection:bg-primary selection:text-primary-foreground">
      <BackgroundEffects />
      <TopNav />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-20 pb-32 px-4 md:px-12 max-w-screen-2xl mx-auto">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono uppercase tracking-[0.2em] mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <Terminal className="w-3 h-3" />
                  System Status: Online
                </div>
                <h1 className="font-headline text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-[0.9]">
                  THE <span className="text-primary">ELITE</span> <br /> ARCHITECT.
                </h1>
                <p className="text-on-surface-variant text-lg md:text-xl max-w-xl mb-10 leading-relaxed font-light">
                  NexCode is the high-performance training ground for the next generation of technical leads. Precision, speed, and integrity are our only metrics.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className="h-14 px-8 rounded-sm bg-primary text-primary-foreground font-headline font-black uppercase tracking-tighter hover:brightness-110 active:scale-95 transition-all"
                    onClick={() => navigate(user ? "/leaderboard" : "/auth")}
                  >
                    Initialize Session
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="h-14 px-8 rounded-sm border-outline-variant/30 text-on-surface hover:bg-surface-container-high transition-all"
                    onClick={() => document.getElementById('modules')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    View Curriculum
                  </Button>
                </div>
              </div>
              <div className="lg:col-span-5 relative hidden lg:block">
                 <div className="bg-surface-container-low border border-outline-variant/10 p-8 rounded-sm shadow-2xl relative overflow-hidden group">
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px] group-hover:bg-primary/20 transition-all duration-700"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-center mb-8">
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40"></div>
                        </div>
                        <span className="font-mono text-[10px] text-on-surface-variant/40">deployment.v2.4.0</span>
                      </div>
                      <div className="space-y-4">
                        <div className="h-4 w-3/4 bg-on-surface/5 rounded-sm animate-pulse"></div>
                        <div className="h-4 w-full bg-on-surface/5 rounded-sm animate-pulse delay-75"></div>
                        <div className="h-4 w-1/2 bg-on-surface/5 rounded-sm animate-pulse delay-150"></div>
                        <div className="pt-6">
                           <div className="flex items-center gap-3 mb-2">
                             <div className="size-2 rounded-full bg-primary animate-pulse"></div>
                             <span className="font-mono text-[10px] text-primary">Establishing secure connection...</span>
                           </div>
                           <div className="h-1.5 w-full bg-on-surface/5 rounded-full overflow-hidden">
                              <div className="h-full bg-primary w-2/3 animate-in slide-in-from-left duration-1000"></div>
                           </div>
                        </div>
                      </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 border-y border-outline-variant/10 bg-surface-container-lowest/30">
          <div className="container mx-auto px-4 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               <div className="flex flex-col gap-2">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary/60">Success Rate</span>
                  <h3 className="text-4xl font-headline font-black">98.4%</h3>
                  <p className="text-sm text-on-surface-variant">Verified architect deployments.</p>
               </div>
               <div className="flex flex-col gap-2 border-l-0 md:border-l border-outline-variant/10 md:pl-12">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary/60">Platform Scale</span>
                  <h3 className="text-4xl font-headline font-black">50K+</h3>
                  <p className="text-sm text-on-surface-variant">Active nodes in the network.</p>
               </div>
               <div className="flex flex-col gap-2 border-l-0 md:border-l border-outline-variant/10 md:pl-12">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary/60">Avg Points</span>
                  <h3 className="text-4xl font-headline font-black">12.4K</h3>
                  <p className="text-sm text-on-surface-variant">Precision across all modules.</p>
               </div>
            </div>
          </div>
        </section>

        {/* Modules Grid */}
        <section id="modules" className="py-32 px-4 md:px-12 max-w-screen-2xl mx-auto">
          <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="font-headline text-4xl md:text-5xl font-black tracking-tighter mb-4">CURRICULUM DEPLOYMENT.</h2>
              <p className="text-on-surface-variant text-lg font-light">Select a training module to begin your advancement cycle.</p>
            </div>
            <div className="relative w-full md:w-80">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 w-4 h-4" />
               <Input
                 placeholder="Search modules..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="pl-10 h-12 bg-surface-container-low border-outline-variant/20 focus:ring-1 focus:ring-primary rounded-sm text-sm font-mono"
               />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredModules.map((module) => (
              <div key={module.id} className="group cursor-pointer">
                <ModuleCard
                  id={module.id}
                  title={module.title}
                  description={module.description}
                  category={module.category}
                  topics={module.topics}
                  difficulty={module.difficulty}
                  price={module.price}
                />
              </div>
            ))}
            {filteredModules.length === 0 && (
              <div className="col-span-full py-24 text-center border border-dashed border-outline-variant/30 rounded-sm">
                 <p className="text-on-surface-variant font-mono">No matching modules found in the archive.</p>
              </div>
            )}
          </div>
        </section>

        {/* Code Showcase Section */}
        <section className="py-32 bg-surface-container-low/50 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
           <div className="container mx-auto px-4 md:px-12">
              <div className="max-w-4xl mx-auto">
                 <div className="text-center mb-16">
                    <h2 className="font-headline text-3xl md:text-4xl font-black mb-4">TECHNICAL SPECIFICATIONS.</h2>
                    <p className="text-on-surface-variant">Explore the core principles of the Obsidian architecture.</p>
                 </div>
                 <CodeSnippetCarousel slides={codeExamples} />
              </div>
           </div>
        </section>

        {/* CTA Section */}
        <section className="py-40 relative">
           <div className="container mx-auto px-4 text-center">
              <h2 className="font-headline text-5xl md:text-7xl font-black tracking-tighter mb-10 leading-none">
                READY FOR <br /> <span className="text-primary">ASCENSION?</span>
              </h2>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                 <Button 
                    size="lg" 
                    className="h-16 px-12 rounded-sm bg-primary text-primary-foreground font-headline font-black uppercase tracking-tighter hover:scale-105 transition-all shadow-[0_0_40px_rgba(199,100,50,0.3)]"
                    onClick={() => navigate("/auth")}
                 >
                   Join the Roster
                 </Button>
                 <Button 
                    variant="outline" 
                    size="lg" 
                    className="h-16 px-12 rounded-sm border-outline-variant/30 text-on-surface hover:bg-surface-container-high transition-all"
                    onClick={() => navigate("/showcase")}
                 >
                   View Showcase
                 </Button>
              </div>
           </div>
        </section>
      </main>

      <GlobalFooter />
    </div>
  );
};

export default Index;
