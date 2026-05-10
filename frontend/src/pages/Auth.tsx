import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { GlobalFooter } from "@/components/GlobalFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Terminal, Github, Mail, ShieldCheck, Zap, ArrowRight } from "lucide-react";

// Validation schemas
const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");
const displayNameSchema = z.string().min(2, "Display name must be at least 2 characters").max(50, "Display name too long");

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; displayName?: string }>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      navigate("/");
    }
  }, [navigate]);

  const validateForm = (isSignUp: boolean) => {
    const newErrors: { email?: string; password?: string; displayName?: string } = {};

    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }

    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }

    if (isSignUp) {
      const displayNameResult = displayNameSchema.safeParse(displayName);
      if (!displayNameResult.success) {
        newErrors.displayName = displayNameResult.error.errors[0].message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(!isLogin)) return;

    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/signup';
      const payload = isLogin 
        ? { email: email.trim(), password }
        : { username: displayName.trim(), email: email.trim(), password };
        
      const { data } = await api.post(endpoint, payload);

      localStorage.setItem('userInfo', JSON.stringify(data));

      toast({
        title: isLogin ? "Welcome back!" : "Account Created!",
        description: isLogin ? "You have successfully logged in." : "Welcome to the Obsidian Arena.",
      });
      
      setTimeout(() => {
        navigate("/");
      }, 100);
      
      return;
    } catch (error: any) {
      toast({
        title: isLogin ? "Login Failed" : "Sign Up Failed",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-body antialiased selection:bg-primary selection:text-primary-foreground">
      <BackgroundEffects />
      
      <header className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center">
        <div 
          className="text-2xl font-headline font-black tracking-tighter text-primary cursor-pointer uppercase"
          onClick={() => navigate('/')}
        >
          Obsidian<span className="text-on-surface">.</span>
        </div>
        <Button 
          variant="ghost" 
          className="font-mono text-xs uppercase tracking-widest text-primary hover:text-primary-foreground hover:bg-primary"
          onClick={() => { setIsLogin(!isLogin); setErrors({}); }}
        >
          {isLogin ? "Sign Up" : "Log In"}
        </Button>
      </header>

      <main className="relative z-10 flex items-center justify-center min-h-screen px-4 py-24">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono uppercase tracking-[0.2em] mb-6">
              <ShieldCheck className="w-3 h-3" />
              Security Protocol
            </div>
            <h1 className="font-headline text-5xl font-black tracking-tighter uppercase mb-2">
              {isLogin ? "Welcome" : "Initialize"} <span className="text-primary">{isLogin ? "Back." : "Build."}</span>
            </h1>
            <p className="text-on-surface-variant font-light text-sm">
              {isLogin ? "Enter your credentials to access the architecture." : "Create your architect profile to join the elite roster."}
            </p>
          </div>

          <div className="bg-surface-container-low border border-outline-variant/10 p-8 md:p-10 rounded-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary/20"></div>
            
            <form onSubmit={handleAuth} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-widest text-primary/60">Architect Handle</label>
                  <Input 
                    placeholder="e.g. Neo" 
                    className="bg-surface-container-lowest border-outline-variant/20 rounded-sm focus:border-primary transition-all"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    disabled={loading}
                  />
                  {errors.displayName && <p className="text-[10px] text-red-400 font-mono">{errors.displayName}</p>}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-widest text-primary/60">Identity Core (Email)</label>
                <Input 
                  placeholder="architect@obsidian.io" 
                  className="bg-surface-container-lowest border-outline-variant/20 rounded-sm focus:border-primary transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
                {errors.email && <p className="text-[10px] text-red-400 font-mono">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-mono uppercase tracking-widest text-primary/60">Access Key</label>
                  {isLogin && <a href="#" className="text-[10px] font-mono text-primary/40 hover:text-primary">RECOVER?</a>}
                </div>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  className="bg-surface-container-lowest border-outline-variant/20 rounded-sm focus:border-primary transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                {errors.password && <p className="text-[10px] text-red-400 font-mono">{errors.password}</p>}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest py-6 rounded-sm flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? "Authenticating..." : (isLogin ? "Engage" : "Initiate")}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-variant/10"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase font-mono"><span className="bg-surface-container-low px-2 text-on-surface-variant/40">Alternative Nodes</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="border-outline-variant/20 rounded-sm hover:bg-surface-container-highest transition-all flex items-center gap-2">
                <Github className="w-4 h-4" />
                <span className="text-[10px] font-mono">GITHUB</span>
              </Button>
              <Button variant="outline" className="border-outline-variant/20 rounded-sm hover:bg-surface-container-highest transition-all flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="text-[10px] font-mono">GOOGLE</span>
              </Button>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-6 opacity-30">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                <span className="font-mono text-[10px] uppercase tracking-tighter">Encrypted</span>
             </div>
             <span className="font-mono text-[10px] uppercase tracking-tighter">System: Stable</span>
          </div>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
};

export default Auth;
