import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User as UserIcon, Shield, Award, Calendar, ArrowLeft, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/Footer";
import api from '@/lib/api';

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any | null>(null);
    const [submissions, setSubmissions] = useState<any[]>([]);

    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
            setUser(JSON.parse(userInfo));
            fetchSubmissions();
        } else {
            navigate("/auth");
        }
    }, [navigate]);

    const fetchSubmissions = async () => {
        try {
            const { data } = await api.get('/submissions/user');
            setSubmissions(data);
        } catch (error) {
            console.error("Failed to fetch submissions");
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <div className="container mx-auto px-4 py-8 flex-1">
                <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate("/")}>
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Button>

                <div className="grid gap-6 md:grid-cols-[300px_1fr]">
                    {/* Sidebar Card */}
                    <Card>
                        <CardHeader className="text-center">
                            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary">
                                <UserIcon className="w-12 h-12" />
                            </div>
                            <CardTitle className="text-2xl">{user.username}</CardTitle>
                            <CardDescription>{user.email}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
                                <Shield className="w-4 h-4 text-primary" />
                                <span className="capitalize">{user.role || 'User'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
                                <Award className="w-4 h-4 text-yellow-500" />
                                <span>{user.points || 0} XP</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Main Content */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="history">
                                <TabsList className="mb-6">
                                    <TabsTrigger value="history">Submission History</TabsTrigger>
                                    <TabsTrigger value="settings">Settings</TabsTrigger>
                                </TabsList>

                                <TabsContent value="history" className="space-y-4">
                                    {submissions.length > 0 ? (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Problem</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Language</TableHead>
                                                    <TableHead className="text-right">Date</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {submissions.map((sub) => (
                                                    <TableRow key={sub._id}>
                                                        <TableCell className="font-medium">{sub.problem?.title || 'Unknown Problem'}</TableCell>
                                                        <TableCell>
                                                            <Badge variant={sub.status === 'Accepted' ? 'default' : 'destructive'}>
                                                                {sub.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="capitalize">{sub.language}</TableCell>
                                                        <TableCell className="text-right text-muted-foreground text-xs">
                                                            {new Date(sub.createdAt).toLocaleDateString()}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    ) : (
                                        <div className="text-center py-12 text-muted-foreground">
                                            <History className="mx-auto h-12 w-12 opacity-20 mb-3" />
                                            <p>No submissions yet. Start solving problems!</p>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="settings" className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label>Username</Label>
                                        <Input defaultValue={user.username} readOnly disabled className="bg-muted" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Email</Label>
                                        <Input defaultValue={user.email} readOnly disabled className="bg-muted" />
                                    </div>
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
