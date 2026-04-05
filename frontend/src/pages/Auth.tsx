import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { GlobalFooter } from "@/components/GlobalFooter";

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
        description: isLogin ? "You have successfully logged in." : "Welcome to NexCode! Start your coding journey.",
      });
      
      // Use setTimeout to allow browser extensions (like React DevTools) to finish their background port messaging
      // before we navigate away and unmount the component, which causes the proxy.js error.
      setTimeout(() => {
        navigate("/");
      }, 100);
      
      return; // Return early so we don't call setLoading(false) on an unmounted component
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
    <div className="bg-surface-container-lowest font-body text-on-surface selection:bg-primary/30 min-h-screen relative flex flex-col overflow-x-hidden">
      <BackgroundEffects />

      {/* Top Navigation Bar */}
      <header className="bg-[#0c0e12]/80 backdrop-blur-md fixed top-0 z-50 w-full">
        <div className="flex items-center justify-between px-8 py-4 w-full max-w-screen-2xl mx-auto">
          <div className="text-2xl font-black tracking-tighter text-primary font-headline cursor-pointer" onClick={() => navigate('/')}>
            NexCode
          </div>
          <div className="flex items-center gap-6">
            <span className="text-slate-400 font-headline font-medium tracking-tight text-sm">
              {isLogin ? "New to the terminal?" : "Already a member?"}
            </span>
            <button 
              onClick={() => { setIsLogin(!isLogin); setErrors({}); }}
              className="text-primary font-bold hover:text-primary-fixed-dim transition-colors duration-200"
            >
              {isLogin ? "Sign Up" : "Log In"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-6 pt-32 pb-12 z-10 w-full">
        
        {/* Ambient glow specifically for Signup to match Stitch */}
        {!isLogin && (
          <>
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-secondary/5 blur-[120px] rounded-full pointer-events-none"></div>
          </>
        )}

        <div className={`w-full ${isLogin ? 'max-w-[440px]' : 'max-w-md'} relative`}>
          
          {isLogin ? (
            // LOGIN VIEW
            <>
              {/* Branding Anchor */}
              <div className="mb-10 text-center">
                <div className="inline-flex items-center justify-center p-3 mb-4 rounded-lg bg-surface-container border border-outline-variant/20 shadow-xl">
                  <span className="material-symbols-outlined text-primary text-3xl">terminal</span>
                </div>
                <h1 className="font-headline font-black tracking-tighter text-4xl text-on-surface uppercase">NexCode</h1>
                <p className="font-label text-xs uppercase tracking-[0.2em] text-outline mt-2">The Obsidian Architect</p>
              </div>

              {/* Login Card */}
              <div className="bg-surface-container border border-outline-variant/10 shadow-2xl relative overflow-hidden group">
                {/* Subtle Top Accent */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
                
                <div className="p-8 md:p-10">
                  <form className="space-y-6" onSubmit={handleAuth}>
                    {/* Email Field */}
                    <div className="space-y-2">
                      <label className="block font-headline text-sm font-semibold tracking-wide text-on-surface-variant" htmlFor="email">Email</label>
                      <div className="relative group/field">
                        <input 
                          className="w-full bg-surface-container-low border-none border-b-2 border-outline-variant/30 text-on-surface px-0 py-3 focus:ring-0 focus:outline-none focus:border-primary transition-all duration-300 placeholder:text-outline/40" 
                          id="email" 
                          placeholder="architect@nexcode.io" 
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={loading}
                        />
                        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary group-focus-within/field:w-full transition-all duration-500 shadow-[0_0_15px_rgba(78,222,163,0.5)]"></div>
                      </div>
                      {errors.email && <p className="text-xs text-error mt-1">{errors.email}</p>}
                    </div>
                    
                    {/* Password Field */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="block font-headline text-sm font-semibold tracking-wide text-on-surface-variant" htmlFor="password">Password</label>
                        <a className="text-xs font-medium text-primary hover:text-primary-fixed-dim transition-colors" href="#">Forgot Password?</a>
                      </div>
                      <div className="relative group/field">
                        <input 
                          className="w-full bg-surface-container-low border-none border-b-2 border-outline-variant/30 text-on-surface px-0 py-3 focus:ring-0 focus:outline-none focus:border-primary transition-all duration-300 placeholder:text-outline/40" 
                          id="password" 
                          placeholder="••••••••" 
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={loading}
                        />
                        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary group-focus-within/field:w-full transition-all duration-500 shadow-[0_0_15px_rgba(78,222,163,0.5)]"></div>
                      </div>
                      {errors.password && <p className="text-xs text-error mt-1">{errors.password}</p>}
                    </div>

                    {/* Primary Action */}
                    <button 
                      className="w-full bg-primary text-on-primary font-headline font-bold py-4 mt-4 hover:shadow-[0_0_30px_rgba(78,222,163,0.3)] active:scale-[0.98] transition-all duration-200 uppercase tracking-widest text-sm disabled:opacity-50" 
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Authenticating..." : "Sign In"}
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="relative my-10 flex items-center">
                    <div className="flex-grow border-t border-outline-variant/15"></div>
                    <span className="flex-shrink mx-4 text-[10px] font-bold text-outline uppercase tracking-widest">Or Continue With</span>
                    <div className="flex-grow border-t border-outline-variant/15"></div>
                  </div>

                  {/* Social Logins */}
                  <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-2 py-3 px-4 bg-surface-container-highest border border-outline-variant/10 hover:bg-surface-bright transition-colors duration-200">
                      <img alt="" className="w-5 h-5 invert" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKNH9aIBBHOxU0mrHEi3Eh5ChUt_WeypRT2lxbxzsl01AoS6vxgf5b3MO-ud9i51cKjQi-W0-ObkOOt7sTN31YTkHdYyxJLg057mHqPKyAm23NWDjGJzSNikHjlwtKrClXIUK4EAQX9DXicsewP1Tm6webKRE08Cs9zndn2bdWt4QnG5gyxxDs17RiI5Eg8uAfRRuygJ14GM3XDJUH8KfiK1URupaa9sfvX8u_rtXu2KtVcZS_UCn3GP7Y80yicuTBjVI0zRUH_NE"/>
                      <span className="text-xs font-headline font-semibold uppercase tracking-tight">GitHub</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 py-3 px-4 bg-surface-container-highest border border-outline-variant/10 hover:bg-surface-bright transition-colors duration-200">
                      <img alt="" className="w-4 h-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-Y1yq3F9QHKrbeorhDWSWOu9CWkbNSAiynMTIU_89cHZ47gdK0XnFdwM3FE-EVSJv-BtIFkiK938yqYsrYMG1Nd1oZc7pWvwQJNQ3qHzHe8vveXysHgOJHNvhoqQ3vX892QqYBjUj482xISxlwTjhT8k8usZaC1KiKUAJCaxtNXN7LS3a5FGD28iM5Hr0gpFgFDZFcndRdZ3W6E_kbJNdwUnmFzxPBvF33gJKQUqsLu4OeyqtqvtNQ-uiG3G9Eal9NmUkf5fzihU"/>
                      <span className="text-xs font-headline font-semibold uppercase tracking-tight">Google</span>
                    </button>
                  </div>
                </div>

                {/* Footer Link inside Card */}
                <div className="bg-surface-container-high/30 py-6 px-10 text-center border-t border-outline-variant/10">
                  <p className="text-sm text-on-surface-variant font-medium">
                    New to the terminal? <button onClick={() => {setIsLogin(false); setErrors({});}} className="text-primary hover:underline font-bold transition-all ml-1">Sign Up</button>
                  </p>
                </div>
              </div>

              {/* Technical Metadata Footer */}
              <div className="mt-12 flex justify-between items-center opacity-40">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                  <span className="font-mono text-[10px] uppercase tracking-tighter">System: Stable</span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-tighter">v4.2.0-LTS</span>
              </div>
            </>
          ) : (
            // SIGNUP VIEW
            <>
              {/* Asymmetric Editorial Header */}
              <div className="mb-10 text-left">
                <h1 className="font-headline text-5xl font-black text-on-surface tracking-tighter leading-none mb-2">
                  INITIATE <span className="text-primary italic">BUILD</span>
                </h1>
                <p className="text-on-surface-variant font-mono text-sm tracking-wide opacity-80 uppercase">
                  Step into the obsidian architecture.
                </p>
              </div>

              {/* Registration Card (Glassmorphism) */}
              <div className="bg-surface-container/60 backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden group">
                {/* Intentional Asymmetry: Accent line */}
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors duration-500"></div>
                
                <form className="space-y-6" onSubmit={handleAuth}>
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="block text-xs font-mono uppercase tracking-widest text-on-surface-variant opacity-60 ml-1">Handle / Full Name</label>
                    <div className="relative group/field">
                      <input 
                        className="w-full bg-surface-container-low border-none border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-on-surface font-body py-3 transition-all duration-300 placeholder:text-on-surface/20" 
                        placeholder="ARCHITECT NAME" 
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        disabled={loading}
                      />
                      <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-500 group-focus-within/field:w-full"></div>
                    </div>
                    {errors.displayName && <p className="text-xs text-error mt-1">{errors.displayName}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="block text-xs font-mono uppercase tracking-widest text-on-surface-variant opacity-60 ml-1">Email Address</label>
                    <div className="relative group/field">
                      <input 
                        className="w-full bg-surface-container-low border-none border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-on-surface font-body py-3 transition-all duration-300 placeholder:text-on-surface/20" 
                        placeholder="NODE@NEXCODE.IO" 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                      />
                      <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-500 group-focus-within/field:w-full"></div>
                    </div>
                    {errors.email && <p className="text-xs text-error mt-1">{errors.email}</p>}
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <label className="block text-xs font-mono uppercase tracking-widest text-on-surface-variant opacity-60 ml-1">Security Key</label>
                    <div className="relative group/field">
                      <input 
                        className="w-full bg-surface-container-low border-none border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-on-surface font-body py-3 transition-all duration-300 placeholder:text-on-surface/20" 
                        placeholder="••••••••••••" 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                      />
                      <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-500 group-focus-within/field:w-full"></div>
                    </div>
                    {errors.password && <p className="text-xs text-error mt-1">{errors.password}</p>}
                  </div>

                  {/* Terms Checkbox */}
                  <div className="flex items-center space-x-3 py-2">
                    <div className="relative flex items-center">
                      <input 
                        className="h-4 w-4 rounded-none bg-surface-container-highest border-outline-variant text-primary focus:ring-offset-background focus:ring-primary" 
                        id="terms" 
                        type="checkbox"
                        required
                      />
                    </div>
                    <label className="text-xs font-body text-on-surface-variant leading-tight" htmlFor="terms">
                      I agree to the <a className="text-primary hover:underline transition-all" href="#">Terms & Conditions</a> and data protocol.
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button 
                      className="glow-button w-full bg-primary-container text-on-primary-container font-headline font-bold py-4 tracking-tighter uppercase text-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:shadow-[0_0_15px_rgba(78,222,163,0.4)] disabled:opacity-50" 
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Creating..." : "Create Account"}
                      <span className="material-symbols-outlined text-xl">arrow_forward</span>
                    </button>
                  </div>
                </form>

                <div className="mt-8 flex items-center justify-between text-[10px] font-mono tracking-widest opacity-40 uppercase">
                  <span>Precision Secured</span>
                  <span>V 2.0.4-BETA</span>
                </div>
              </div>
            </>
          )}

        </div>
      </main>

      <GlobalFooter />
    </div>
  );
};

export default Auth;
