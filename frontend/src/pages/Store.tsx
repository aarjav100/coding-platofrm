import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShoppingBag, ArrowLeft, Coins, Check, FileText, GraduationCap, Ticket, Users, ShoppingCart, Zap, Terminal, Sparkles, CreditCard } from "lucide-react";
import { TopNav } from "@/components/TopNav";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { GlobalFooter } from "@/components/GlobalFooter";

interface StoreItem {
    _id: string;
    name: string;
    description: string;
    price: number;
    type: string;
    image: string;
}

interface UserProfile {
    _id: string;
    username: string;
    points: number;
    inventory: { item: string; purchaseDate: string }[];
}

const Store = () => {
    const [items, setItems] = useState<StoreItem[]>([]);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState<string | null>(null);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const userInfo = localStorage.getItem('userInfo');
            if (userInfo) {
                setUser(JSON.parse(userInfo));
            }

            const { data } = await api.get('/store');
            setItems(data);
        } catch (error: any) {
            console.error("Failed to fetch store data", error);
            if (error.response?.status === 401) {
                toast({
                    title: "Authentication Required",
                    description: "Please login to access the archive.",
                    variant: "destructive"
                });
                navigate("/auth");
                return;
            }
            toast({
                title: "Sync Failure",
                description: "Failed to load archive items.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleBuy = async (item: StoreItem) => {
        if (!user) {
            toast({
                title: "Identity Required",
                description: "Please authenticate to acquire items.",
                variant: "destructive"
            });
            return;
        }

        if (user.points < item.price) {
            toast({
                title: "Insufficient Credits",
                description: `You require ${item.price - user.points} more XP to acquire this asset.`,
                variant: "destructive"
            });
            return;
        }

        setPurchasing(item._id);

        try {
            const { data } = await api.post('/store/buy', { itemId: item._id });

            const currentUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const newUserInfo = { ...currentUserInfo, points: data.points, inventory: data.inventory };
            localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
            setUser(newUserInfo);

            toast({
                title: "Asset Acquired",
                description: data.message,
                className: "bg-primary text-primary-foreground border-none"
            });

        } catch (error: any) {
            if (error.response?.status === 401) {
                toast({
                    title: "Session Expired",
                    description: "Please login again to continue.",
                    variant: "destructive"
                });
                navigate("/auth");
                return;
            }
            toast({
                title: "Acquisition Failed",
                description: error.response?.data?.message || "Internal sync error",
                variant: "destructive"
            });
        } finally {
            setPurchasing(null);
        }
    };

    const hasItem = (itemId: string) => {
        return user?.inventory?.some((inv: any) => (inv.item === itemId || inv.item._id === itemId));
    };

    const getIconForType = (type: string) => {
        switch (type) {
            case 'dsa_sheet': return <FileText className="w-12 h-12 text-primary" />;
            case 'course': return <GraduationCap className="w-12 h-12 text-primary" />;
            case 'contest_pass': return <Ticket className="w-12 h-12 text-primary" />;
            case 'mentorship': return <Users className="w-12 h-12 text-primary" />;
            default: return <Sparkles className="w-12 h-12 text-primary" />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-on-surface font-body antialiased selection:bg-primary selection:text-primary-foreground">
            <BackgroundEffects />
            <TopNav />

            <main className="relative z-10 py-12 px-4 md:px-12 max-w-screen-2xl mx-auto">
                {/* Store Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono uppercase tracking-[0.2em] mb-4">
                            <Terminal className="w-3 h-3" />
                            Asset Archive v4.2
                        </div>
                        <h1 className="font-headline text-6xl font-black tracking-tighter uppercase mb-4">The Exchange.</h1>
                        <p className="text-on-surface-variant text-lg font-light max-w-xl">
                            Convert your hard-earned XP into high-level assets and curriculum upgrades.
                        </p>
                    </div>

                    {user && (
                        <div className="flex flex-col items-end gap-2 p-6 rounded-sm bg-surface-container-low/50 backdrop-blur-md border border-outline-variant/10 shadow-2xl animate-in fade-in slide-in-from-right-8 duration-700">
                           <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/60">Available Balance</span>
                           <div className="flex items-center gap-3 text-primary">
                              <Zap className="w-6 h-6 fill-primary" />
                              <span className="text-4xl font-headline font-black tracking-tighter">{user.points || 0} XP</span>
                           </div>
                        </div>
                    )}
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {items.map((item) => (
                        <Card key={item._id} className="bg-surface-container-low/30 backdrop-blur-md border-outline-variant/10 rounded-sm overflow-hidden group hover:bg-surface-container-low/50 transition-all duration-500 hover:-translate-y-1">
                            <div className="aspect-video bg-surface-container-high/50 relative overflow-hidden flex items-center justify-center border-b border-outline-variant/5">
                                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
                                <div className="relative z-10 transform transition-transform duration-700 group-hover:scale-110">
                                   {getIconForType(item.type)}
                                </div>
                                {hasItem(item._id) && (
                                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-[10px] font-mono font-black px-3 py-1 rounded-sm flex items-center gap-2 shadow-2xl uppercase tracking-widest">
                                        <Check className="w-3 h-3" />
                                        Owned
                                    </div>
                                )}
                            </div>
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <Badge variant="outline" className="rounded-sm font-mono text-[9px] uppercase tracking-widest border-primary/20 text-primary/60 px-2 py-0.5">{item.type.replace('_', ' ')}</Badge>
                                    <div className="flex items-center gap-1.5 text-primary font-headline font-bold text-lg">
                                       <Zap className="w-4 h-4 fill-primary" />
                                       {item.price}
                                    </div>
                                </div>
                                <CardTitle className="font-headline text-xl font-black tracking-tighter uppercase group-hover:text-primary transition-colors">{item.name}</CardTitle>
                                <CardDescription className="font-light text-sm line-clamp-2 h-10 leading-relaxed">{item.description}</CardDescription>
                            </CardHeader>
                            <CardFooter className="pt-2 pb-6">
                                <Button
                                    className="w-full h-12 rounded-sm bg-surface-container-highest text-on-surface hover:bg-primary hover:text-primary-foreground font-headline font-black uppercase tracking-tighter transition-all disabled:opacity-50"
                                    onClick={() => handleBuy(item)}
                                    disabled={purchasing === item._id || !user || (user.points < item.price)}
                                >
                                    {purchasing === item._id ? (
                                       <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                       <>
                                          <ShoppingCart className="w-4 h-4 mr-2" />
                                          {hasItem(item._id) ? "Acquire Again" : "Acquire Asset"}
                                       </>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                    
                    {items.length === 0 && (
                        <div className="col-span-full py-32 text-center border border-dashed border-outline-variant/20 rounded-sm">
                           <Terminal className="w-12 h-12 mx-auto text-primary/20 mb-4" />
                           <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">Archive is currently empty. Sync required.</p>
                        </div>
                    )}
                </div>
            </main>

            <GlobalFooter />
        </div>
    );
};

export default Store;
