import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";
import { FadeIn } from "@/components/animations/FadeIn";
import { ModuleCard } from "@/components/ModuleCard";
import { modules } from "@/data/modules";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Code2, Search, Sparkles, BookOpen, Play, LogIn, LogOut, User, Trophy, Layers, ShoppingBag, Crown, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  MixedContentCarousel,
  CodeSnippetCarousel,
  TestimonialCarousel,
  InfiniteLoopCarousel,
} from "@/components/carousels";
import { Footer } from "@/components/Footer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

// Hero slides data
const heroSlides = [
  {
    type: 'image' as const,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200",
    title: "Master Programming",
    description: "Learn to code with interactive tutorials, real projects, and expert guidance",
    badge: "Start Learning",
    ctaText: "Browse Modules",
    ctaLink: "#modules",
  },
  {
    type: 'content' as const,
    title: "Weekly Coding Contests",
    description: "Challenge yourself with algorithmic problems and compete with developers worldwide",
    badge: "New Contest",
    ctaText: "Join Contest",
    ctaLink: "/contests",
    gradient: "bg-gradient-to-br from-green-600 to-emerald-700",
  },
  {
    type: 'image' as const,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200",
    title: "Learn Together",
    description: "Join our community of 50,000+ developers learning and growing together",
    badge: "Community",
    ctaText: "Get Started Free",
    ctaLink: "/auth",
  },
];

// Code examples for carousel
const codeExamples = [
  {
    title: "React useState Hook",
    language: "javascript",
    code: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Clicked {count} times
    </button>
  );
}`,
    description: "State management made simple with React Hooks",
  },
  {
    title: "TypeScript Interface",
    language: "typescript",
    code: `interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

const user: User = {
  id: 1,
  name: "CodeMaster",
  email: "learn@code.com",
  role: "admin"
};`,
    description: "Type-safe code with TypeScript interfaces",
  },
  {
    title: "Python List Comprehension",
    language: "python",
    code: `# Filter and transform in one line
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Get squares of even numbers
even_squares = [n**2 for n in numbers if n % 2 == 0]
print(even_squares)  # [4, 16, 36, 64, 100]`,
    description: "Elegant Python one-liners for data transformation",
  },
];

// Testimonials data
const testimonials = [
  {
    quote: "This platform helped me transition from a complete beginner to landing my first developer job in just 6 months!",
    author: "Aarjav Jain",
    role: "Frontend Developer",
    company: "TechCorp",
    rating: 5,
  },
  {
    quote: "The interactive coding challenges and real-time feedback made learning algorithms so much easier and fun.",
    author: "Priya Sharma",
    role: "Software Engineer",
    company: "StartupXYZ",
    rating: 5,
  },
  {
    quote: "Best investment I made in my career. The content quality and teaching methodology is top-notch.",
    author: "Rahul Kumar",
    role: "Full Stack Developer",
    company: "Digital Agency",
    rating: 5,
  },
];

// Tech logos for infinite carousel
const techLogos = [
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", alt: "JavaScript" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", alt: "TypeScript" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", alt: "React" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", alt: "Node.js" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", alt: "Python" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg", alt: "Java" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg", alt: "C++" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", alt: "MongoDB" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg", alt: "PostgreSQL" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", alt: "Docker" },
];

const Index = () => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check auth state - User ka auth state check karo
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  // Handle logout - Logout karne ka function
  const handleLogout = async () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with auth buttons - Navigation header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden mr-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[80vw] sm:w-[350px]">
                <SheetHeader>
                  <SheetTitle className="text-left flex items-center gap-2">
                    <div className="bg-primary p-1.5 rounded-lg">
                      <Code2 className="h-4 w-4 text-primary-foreground" />
                    </div>
                    CodeMaster
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                  <Button variant="ghost" className="justify-start gap-2" onClick={() => navigate("/showcase")}>
                    <Layers className="h-4 w-4" />
                    Showcase
                  </Button>
                  <Button variant="ghost" className="justify-start gap-2" onClick={() => navigate("/contests")}>
                    <Trophy className="h-4 w-4" />
                    Contests
                  </Button>
                  <Button variant="ghost" className="justify-start gap-2" onClick={() => navigate("/premium")}>
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                    Premium
                  </Button>
                  {user && (
                    <>
                      <div className="h-px bg-border my-2" />
                      <Button variant="ghost" className="justify-start gap-2" onClick={() => navigate("/store")}>
                        <ShoppingBag className="h-4 w-4" />
                        Store
                      </Button>
                      <Button variant="ghost" className="justify-start gap-2" onClick={() => navigate("/leaderboard")}>
                        <Crown className="h-4 w-4" />
                        Leaderboard
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-lg hidden md:block">
                <Code2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">CodeMaster</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate("/showcase")} className="hidden md:flex">
              <Layers className="h-4 w-4 mr-2" />
              Showcase
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/contests")} className="hidden md:flex">
              <Trophy className="h-4 w-4 mr-2" />
              Contests
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/premium")} className="hidden md:flex text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50">
              <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
              Premium
            </Button>
            {loading ? (
              <div className="h-10 w-20 bg-muted animate-pulse rounded-md" />
            ) : user ? (
              <div className="flex items-center gap-2">
                <ModeToggle />
                <Button variant="ghost" size="sm" onClick={() => navigate("/store")} className="hidden md:flex">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Store
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate("/leaderboard")} className="hidden md:flex">
                  <Crown className="h-4 w-4 mr-2" />
                  Leaderboard
                </Button>

                <div className="h-6 w-px bg-border mx-1 hidden md:block" />

                {/* Points Display */}
                <div className="flex items-center gap-2 pl-1 pr-3 py-1.5 bg-accent/20 text-accent-foreground rounded-full border border-accent/20 transition-all hover:bg-accent/30 cursor-help" title="Your Learning Points">
                  <div className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center text-[10px] text-white font-bold shadow-sm">
                    P
                  </div>
                  <span className="text-sm font-bold">{user.points || 0}</span>
                </div>

                <div
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 bg-muted rounded-full border border-border cursor-pointer hover:bg-accent/10 hover:border-accent/50 transition-all select-none"
                >
                  <div className="w-7 h-7 rounded-full bg-background flex items-center justify-center border border-border shadow-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="text-xs font-medium text-foreground pr-2 hidden sm:inline-block max-w-[100px] truncate">
                    {user.username || user.email?.split('@')[0]}
                  </span>
                </div>

                <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive transition-colors rounded-full w-8 h-8">
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only">Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ModeToggle />
                <Button onClick={() => navigate("/auth")} size="sm">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Carousel Section */}
      <section className="relative">
        <FadeIn direction="up">
          <MixedContentCarousel slides={heroSlides} autoplay autoplayInterval={6000} />
        </FadeIn>
      </section>

      {/* Tech Stack Infinite Carousel */}
      <section className="py-8 bg-muted/30 border-y border-border">
        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground uppercase tracking-wider">Technologies We Teach</p>
        </div>
        <InfiniteLoopCarousel items={techLogos} speed={30} />
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <FadeIn delay={0.2}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-foreground">Why Learn With Us?</h2>
              <p className="text-muted-foreground">Everything you need to master coding</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <div className="text-center p-6 rounded-lg bg-card border border-border shadow-soft hover:shadow-medium transition-all">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Code2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 text-foreground">Code Examples</h3>
                <p className="text-sm text-muted-foreground">
                  Real-world code snippets with syntax highlighting
                </p>
              </div>
              <div className="text-center p-6 rounded-lg bg-card border border-border shadow-soft hover:shadow-medium transition-all">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2 text-foreground">Detailed Notes</h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive documentation and explanations
                </p>
              </div>
              <div className="text-center p-6 rounded-lg bg-card border border-border shadow-soft hover:shadow-medium transition-all">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-semibold mb-2 text-foreground">Animations</h3>
                <p className="text-sm text-muted-foreground">
                  Visual concepts brought to life
                </p>
              </div>
              <div className="text-center p-6 rounded-lg bg-card border border-border shadow-soft hover:shadow-medium transition-all">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Play className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 text-foreground">Video Tutorials</h3>
                <p className="text-sm text-muted-foreground">
                  Step-by-step video guides
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Code Examples Carousel */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 text-foreground">Learn by Example</h2>
              <p className="text-muted-foreground">Explore code snippets from our courses</p>
            </div>
            <CodeSnippetCarousel slides={codeExamples} />
          </div>
        </div>
      </section>

      {/* Modules Grid */}
      <section id="modules" className="py-16">
        <div className="container mx-auto px-4">
          <FadeIn delay={0.4}>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <div className="relative flex-1 max-w-md mx-auto mb-8">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="Search modules..."
                    className="pl-10 h-12 bg-card border-border"
                  />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                  Explore Learning Modules
                </h2>
                <p className="text-lg text-muted-foreground">
                  Choose from our comprehensive collection of coding topics
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((module) => (
                  <ModuleCard
                    key={module.id}
                    id={module.id}
                    title={module.title}
                    description={module.description}
                    category={module.category}
                    topics={module.topics}
                    difficulty={module.difficulty}
                    price={module.price}
                  />
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 text-foreground">What Our Students Say</h2>
              <p className="text-muted-foreground">Join thousands of successful developers</p>
            </div>
            <TestimonialCarousel testimonials={testimonials} autoplay />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-primary to-purple-900 animate-gradient-xy opacity-90" />
        <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-10" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <FadeIn delay={0.6}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white border border-white/20 mb-8 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">Launch your career today</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black mb-6 text-white tracking-tight leading-tight drop-shadow-lg">
              Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">Master Code?</span>
            </h2>

            <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
              Join a community of <span className="font-bold text-white">50,000+</span> developers building the future.
              Start your journey with our interactive curriculum today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                variant="secondary"
                className="h-14 px-8 text-lg font-bold bg-white text-primary hover:bg-indigo-50 hover:scale-105 transition-all shadow-xl hover:shadow-2xl hover:shadow-white/20"
                onClick={() => navigate("/auth")}
              >
                Get Started for Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg font-medium border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                onClick={() => {
                  const element = document.querySelector("#modules");
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Explore Modules
              </Button>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-white/40 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Trust badges or simple text acting as social proof */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm font-medium text-indigo-200">Live Mentorship</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-75" />
                <span className="text-sm font-medium text-indigo-200">Real Projects</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse delay-150" />
                <span className="text-sm font-medium text-indigo-200">Global Community</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section >

      <Footer />
    </div >
  );
};

export default Index;
