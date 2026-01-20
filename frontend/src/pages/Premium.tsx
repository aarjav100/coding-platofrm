import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Building, Video, BarChart, Check, Sparkles, ArrowLeft, Crown } from "lucide-react";
import { Link } from "react-router-dom";

const Premium = () => {
    return (
        <div className="min-h-screen bg-background">
            {/* Navbar Placeholder / Back Button */}
            <div className="container mx-auto px-4 py-8">
                <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                {/* Hero Section */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-primary to-purple-900 text-white p-12 md:p-24 text-center mb-16 shadow-2xl">
                    <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-10" />
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white border border-white/20 mb-8 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <Crown className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-medium">Premium Access</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
                            Unlock Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">Full Potential</span>
                        </h1>
                        <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
                            Get access to exclusive content, advanced analytics, and tools designed to fast-track your coding career.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button
                                size="lg"
                                className="bg-white text-primary hover:bg-indigo-50 font-bold h-14 px-8 text-lg"
                            >
                                Get Premium Now
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {/* Locked Problems */}
                    <Card className="border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
                                <Lock className="w-6 h-6 text-red-500" />
                            </div>
                            <CardTitle className="text-xl">Locked Problems</CardTitle>
                            <CardDescription>
                                Access 500+ premium algorithm problems curated by industry experts.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Top 100 Interview Qs</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> System Design Cases</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Advanced DP & Graphs</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button variant="secondary" className="w-full">View Problems</Button>
                        </CardFooter>
                    </Card>

                    {/* Company Sheets */}
                    <Card className="border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                                <Building className="w-6 h-6 text-blue-500" />
                            </div>
                            <CardTitle className="text-xl">Company Sheets</CardTitle>
                            <CardDescription>
                                Targeted preparation sheets for top tech companies.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Google & Meta Tracks</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Amazon Leadership Principles</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Netflix System Design</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button variant="secondary" className="w-full">Explore Sheets</Button>
                        </CardFooter>
                    </Card>

                    {/* Mock Interviews */}
                    <Card className="border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                                <Video className="w-6 h-6 text-purple-500" />
                            </div>
                            <CardTitle className="text-xl">Mock Interviews</CardTitle>
                            <CardDescription>
                                Practice with peers or our AI interviewer to gain confidence.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> AI Behavioral Coach</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Peer Coding Sessions</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Detailed Feedback Reports</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button variant="secondary" className="w-full">Start Practice</Button>
                        </CardFooter>
                    </Card>

                    {/* Advanced Analytics */}
                    <Card className="border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                                <BarChart className="w-6 h-6 text-green-500" />
                            </div>
                            <CardTitle className="text-xl">Advanced Analytics</CardTitle>
                            <CardDescription>
                                Deep dive into your performance with granular insights.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Weak Area Analysis</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Progress Tracking</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Global Percentile Rank</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button variant="secondary" className="w-full">View Analytics</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Premium;
