import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User as UserIcon, Shield, Award, Calendar, ArrowLeft, History, Mail, Code2, Terminal, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TopNav } from "@/components/TopNav";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { GlobalFooter } from "@/components/GlobalFooter";
import api from '@/lib/api';

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any | null>(null);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
            setUser(JSON.parse(userInfo));
            fetchSubmissions();
        } else {
            navigate("/auth");
        }
        setLoading(false);
    }, [navigate]);

    const fetchSubmissions = async () => {
        try {
            const { data } = await api.get('/submissions/user');
            setSubmissions(data);
        } catch (error) {
            console.error("Failed to fetch submissions");
        }
    };

    if (loading || !user) return null;

    return (
        <div className="min-h-screen bg-background text-on-surface font-body antialiased selection:bg-primary selection:text-primary-foreground">
            <BackgroundEffects />
            <TopNav />

            <main className="relative z-10 py-12 px-4 md:px-12 max-w-screen-2xl mx-auto">
                {/* Header Section */}
                <div className="mb-12">
                   <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono uppercase tracking-[0.2em] mb-4">
                      <Terminal className="w-3 h-3" />
                      Personnel File: {user.username}
                   </div>
                   <h1 className="font-headline text-5xl font-black tracking-tighter uppercase">Architect Profile</h1>
                </div>

                <div className="grid gap-12 lg:grid-cols-[380px_1fr]">
                    {/* Sidebar / Identity Card */}
                    <div className="space-y-6">
                        <Card className="bg-surface-container-low/50 backdrop-blur-xl border-outline-variant/10 rounded-sm overflow-hidden">
                            <div className="h-24 bg-gradient-to-r from-primary/20 to-transparent"></div>
                            <CardHeader className="text-center -mt-12">
                                <div className="w-24 h-24 rounded-sm bg-surface-container-high border border-outline-variant/20 flex items-center justify-center mx-auto mb-4 shadow-2xl relative group">
                                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <UserIcon className="w-12 h-12 text-primary" />
                                </div>
                                <CardTitle className="text-3xl font-headline font-black tracking-tighter uppercase">{user.username}</CardTitle>
                                <CardDescription className="font-mono text-xs text-primary/60 tracking-widest">{user.role?.toUpperCase() || 'ELITE ARCHITECT'}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 pb-8">
                                <div className="flex items-center gap-4 p-4 rounded-sm bg-surface-container-high/50 border border-outline-variant/10">
                                    <div className="size-10 rounded-sm bg-primary/10 flex items-center justify-center border border-primary/20">
                                       <Award className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                       <p className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Contribution Score</p>
                                       <p className="text-xl font-headline font-black">{user.points || 0} XP</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 rounded-sm bg-surface-container-high/50 border border-outline-variant/10">
                                    <div className="size-10 rounded-sm bg-primary/10 flex items-center justify-center border border-primary/20">
                                       <Mail className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="overflow-hidden">
                                       <p className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Secure Uplink</p>
                                       <p className="text-sm font-mono truncate">{user.email}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="p-6 rounded-sm bg-primary/5 border border-primary/10">
                           <div className="flex items-center gap-2 mb-4">
                              <Zap className="w-4 h-4 text-primary" />
                              <h3 className="font-headline font-bold text-xs uppercase tracking-widest">Platform Status</h3>
                           </div>
                           <div className="space-y-4">
                              <div>
                                 <div className="flex justify-between text-[10px] font-mono uppercase mb-1">
                                    <span>Sync Integrity</span>
                                    <span className="text-primary">99.9%</span>
                                 </div>
                                 <div className="h-1 bg-surface-container-high rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[99.9%]"></div>
                                 </div>
                              </div>
                              <p className="text-[10px] text-on-surface-variant font-mono leading-relaxed">
                                 Connection established via encrypted node. Submissions are verified through the Obsidian Protocol.
                              </p>
                           </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="space-y-8">
                        <Tabs defaultValue="history" className="w-full">
                            <TabsList className="bg-surface-container-low/50 backdrop-blur-md border border-outline-variant/10 p-1 rounded-sm w-full sm:w-auto">
                                <TabsTrigger value="history" className="rounded-sm font-headline text-xs uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2 px-6">Deployment Logs</TabsTrigger>
                                <TabsTrigger value="settings" className="rounded-sm font-headline text-xs uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2 px-6">Node Config</TabsTrigger>
                            </TabsList>

                            <TabsContent value="history" className="mt-8">
                                <Card className="bg-surface-container-low/30 backdrop-blur-md border-outline-variant/10 rounded-sm overflow-hidden">
                                    <CardHeader className="border-b border-outline-variant/10 bg-surface-container-low/50">
                                        <CardTitle className="font-headline text-lg font-black tracking-tighter uppercase flex items-center gap-2">
                                           <History className="w-5 h-5 text-primary" />
                                           Submission History
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        {submissions.length > 0 ? (
                                            <Table>
                                                <TableHeader className="bg-surface-container-high/30">
                                                    <TableRow className="border-outline-variant/10 hover:bg-transparent">
                                                        <TableHead className="text-[10px] font-mono uppercase tracking-widest py-4">Challenge</TableHead>
                                                        <TableHead className="text-[10px] font-mono uppercase tracking-widest py-4">Result</TableHead>
                                                        <TableHead className="text-[10px] font-mono uppercase tracking-widest py-4">Environment</TableHead>
                                                        <TableHead className="text-right text-[10px] font-mono uppercase tracking-widest py-4">Timestamp</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {submissions.map((sub) => (
                                                        <TableRow key={sub._id} className="border-outline-variant/5 hover:bg-primary/5 transition-colors group">
                                                            <TableCell className="py-5">
                                                               <div className="flex items-center gap-3">
                                                                  <div className="size-8 rounded-sm bg-surface-container-high flex items-center justify-center border border-outline-variant/10 group-hover:border-primary/30 transition-colors">
                                                                     <Code2 className="w-4 h-4 text-on-surface-variant" />
                                                                  </div>
                                                                  <span className="font-headline font-bold text-sm tracking-tight">{sub.problem?.title || 'System Core'}</span>
                                                               </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge className={sub.status === 'Accepted' ? 'bg-green-500/10 text-green-500 border-green-500/20 rounded-sm font-mono text-[10px] uppercase tracking-widest' : 'bg-red-500/10 text-red-500 border-red-500/20 rounded-sm font-mono text-[10px] uppercase tracking-widest'}>
                                                                    {sub.status}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="font-mono text-xs text-on-surface-variant uppercase">{sub.language}</TableCell>
                                                            <TableCell className="text-right font-mono text-[10px] text-on-surface-variant/60 uppercase">
                                                                {new Date(sub.createdAt).toLocaleDateString()}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        ) : (
                                            <div className="text-center py-24 border-t border-outline-variant/5">
                                                <Terminal className="mx-auto h-12 w-12 text-primary/20 mb-4" />
                                                <p className="text-sm text-on-surface-variant font-mono uppercase tracking-widest">No active deployments detected in the archive.</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="settings" className="mt-8">
                                <Card className="bg-surface-container-low/30 backdrop-blur-md border-outline-variant/10 rounded-sm p-8">
                                   <div className="max-w-xl space-y-6">
                                      <div className="space-y-2">
                                          <Label className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary/60">Node Identifier</Label>
                                          <Input defaultValue={user.username} readOnly disabled className="bg-surface-container-high border-outline-variant/20 rounded-sm font-mono h-12" />
                                          <p className="text-[10px] text-on-surface-variant/40 font-mono">Public identity within the NexCode mesh.</p>
                                      </div>
                                      <div className="space-y-2">
                                          <Label className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary/60">Communication Protocol</Label>
                                          <Input defaultValue={user.email} readOnly disabled className="bg-surface-container-high border-outline-variant/20 rounded-sm font-mono h-12" />
                                          <p className="text-[10px] text-on-surface-variant/40 font-mono">Verified secure uplink address.</p>
                                      </div>
                                      <div className="pt-6 border-t border-outline-variant/10">
                                         <p className="text-xs text-on-surface-variant italic">Config locked by Admin. Deploy changes through the central hub.</p>
                                      </div>
                                   </div>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </main>

            <GlobalFooter />
        </div>
    );
}
