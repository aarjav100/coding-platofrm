import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Shield, Award, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { ArrowLeft } from "lucide-react";

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any | null>(null);

    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        } else {
            navigate("/auth");
        }
    }, [navigate]);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <div className="container mx-auto px-4 py-8 flex-1">
                <Button
                    variant="ghost"
                    className="mb-6 gap-2"
                    onClick={() => navigate("/")}
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Button>

                <div className="grid gap-6 md:grid-cols-[300px_1fr]">
                    {/* Sidebar Card */}
                    <Card>
                        <CardHeader className="text-center">
                            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary">
                                <User className="w-12 h-12" />
                            </div>
                            <CardTitle className="text-2xl">{user.username}</CardTitle>
                            <CardDescription>{user.email}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Shield className="w-4 h-4" />
                                <span>Standard User</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Award className="w-4 h-4" />
                                <span>{user.points || 0} Points</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span>Joined {new Date().toLocaleDateString()}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Main Content */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Settings</CardTitle>
                            <CardDescription>Manage your account settings and preferences.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="general">
                                <TabsList className="mb-4">
                                    <TabsTrigger value="general">General</TabsTrigger>
                                    <TabsTrigger value="security">Security</TabsTrigger>
                                    <TabsTrigger value="preferences">Preferences</TabsTrigger>
                                </TabsList>

                                <TabsContent value="general" className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="username">Username</Label>
                                        <Input id="username" defaultValue={user.username} readOnly disabled className="bg-muted" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" defaultValue={user.email} readOnly disabled className="bg-muted" />
                                    </div>
                                </TabsContent>

                                <TabsContent value="security" className="space-y-4">
                                    <div className="p-4 rounded-lg bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                        <p className="text-sm font-medium">Password management is handled by your auth provider.</p>
                                    </div>
                                </TabsContent>

                                <TabsContent value="preferences" className="space-y-4">
                                    <p className="text-sm text-muted-foreground">Theme preferences can be managed from the navigation bar.</p>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Footer />
        </div>
    );
}
