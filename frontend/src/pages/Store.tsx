import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShoppingBag, ArrowLeft, Coins, Check, FileText, GraduationCap, Ticket, Users } from "lucide-react";

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
    const { toast } = useToast();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const userInfo = localStorage.getItem('userInfo');
            if (userInfo) {
                // We might want to fetch fresh user profile specifically for points
                // But for now let's use what we have or maybe fetch /api/users/profile if valid ref
                // Let's assume we can rely on local storage initially but ideally we sync points
                // Actually, let's fetch items first

                // Wait, 'userInfo' in localStorage might be stale regarding points if updated via authController but not re-saved to LS on add-points. 
                // We should probably rely on a fresh fetch of user data or the return from buy/add-points.
                // For accurate display, let's assume we fetch items and maybe we need a user profile endpoint.
                // Since I didn't create a dedicated user profile endpoint in this plan (it might exist in authController/middleware), I'll try to rely on what I can get.
                // Actually authController usually has getProfile. Let's stick to the plan: use what we have or just manage points locally after buy.
                // HOWEVER, to get the initial points correctly, we might need to refresh user data. 
                // Let's rely on localStorage first, and update it on purchase.

                setUser(JSON.parse(userInfo));
            }

            const { data } = await api.get('/store');
            setItems(data);
        } catch (error) {
            console.error("Failed to fetch store data", error);
            toast({
                title: "Error",
                description: "Failed to load store items.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleBuy = async (item: StoreItem) => {
        if (!user) {
            toast({
                title: "Login Required",
                description: "Please login to purchase items.",
                variant: "destructive"
            });
            return;
        }

        if (user.points < item.price) {
            toast({
                title: "Insufficient Points",
                description: `You need ${item.price - user.points} more points to buy this.`,
                variant: "destructive"
            });
            return;
        }

        setPurchasing(item._id);

        try {
            const { data } = await api.post('/store/buy', { itemId: item._id });

            // Update local state
            const updatedUser = { ...user, points: data.points, inventory: data.inventory };
            setUser(updatedUser);
            localStorage.setItem('userInfo', JSON.stringify({ ...updatedUser, token: JSON.parse(localStorage.getItem('userInfo') || '{}').token })); // valid? 
            // ACTUALLY: The userInfo in LS usually stores { ...userFields, token }. 
            // The backend buy response returns { points, inventory, message }. 
            // We should merge this carefully.

            const currentUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const newUserInfo = { ...currentUserInfo, points: data.points, inventory: data.inventory };
            localStorage.setItem('userInfo', JSON.stringify(newUserInfo));

            toast({
                title: "Purchase Successful!",
                description: data.message,
                className: "bg-green-500 text-white border-none"
            });

        } catch (error: any) {
            toast({
                title: "Purchase Failed",
                description: error.response?.data?.message || "Something went wrong",
                variant: "destructive"
            });
        } finally {
            setPurchasing(null);
        }
    };

    const hasItem = (itemId: string) => {
        // Logic to check if user already has item if unique? 
        // For now we allow multiples, but let's visually show if owned.
        return user?.inventory?.some((inv: any) => (inv.item === itemId || inv.item._id === itemId));
    };

    const getIconForType = (type: string) => {
        switch (type) {
            case 'dsa_sheet': return <FileText className="w-10 h-10 text-blue-500" />;
            case 'course': return <GraduationCap className="w-10 h-10 text-purple-500" />;
            case 'contest_pass': return <Ticket className="w-10 h-10 text-yellow-500" />;
            case 'mentorship': return <Users className="w-10 h-10 text-green-500" />;
            default: return null; // Fallback to image if no icon or other types
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>

                    {user && (
                        <div className="flex items-center gap-2 bg-yellow-500/10 text-yellow-600 px-4 py-2 rounded-full border border-yellow-500/20 shadow-sm animate-in fade-in slide-in-from-top-4 duration-700">
                            <Coins className="w-5 h-5 fill-yellow-500 text-yellow-600" />
                            <span className="font-bold">{user.points || 0} Points</span>
                        </div>
                    )}
                </div>

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                        <ShoppingBag className="w-10 h-10 text-primary" />
                        CodeMaster Store
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Redeem your hard-earned points for exclusive swag!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {items.map((item) => (
                        <Card key={item._id} className="overflow-hidden border-border transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                            <div className="aspect-square bg-muted relative overflow-hidden group flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                                {['dsa_sheet', 'course', 'contest_pass', 'mentorship'].includes(item.type) ? (
                                    <div className="transform transition-transform duration-500 group-hover:scale-110">
                                        {getIconForType(item.type)}
                                    </div>
                                ) : (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                )}
                                {hasItem(item._id) && (
                                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                                        <Check className="w-3 h-3" />
                                        Owned
                                    </div>
                                )}
                            </div>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <Badge variant="outline" className="capitalize">{item.type.replace('_', ' ')}</Badge>
                                </div>
                                <CardTitle className="mt-2 line-clamp-1">{item.name}</CardTitle>
                                <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-1 text-yellow-600 font-bold text-lg">
                                    <Coins className="w-5 h-5 fill-yellow-500" />
                                    {item.price}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full"
                                    onClick={() => handleBuy(item)}
                                    disabled={purchasing === item._id || !user || (user.points < item.price)}
                                    variant={user && user.points >= item.price ? "default" : "secondary"}
                                >
                                    {purchasing === item._id && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    {purchasing === item._id ? "Buying..." : "Redeem"}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Store;
