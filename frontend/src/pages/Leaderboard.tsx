import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Medal, Crown, TrendingUp, Search, User, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from 'react-router-dom';

const MOCK_LEADERBOARD = [
    { rank: 1, name: "AlgoMaster_99", xp: 15420, level: 42, language: "C++", avatar: "https://github.com/shadcn.png" },
    { rank: 2, name: "PythonistaDev", xp: 14200, level: 40, language: "Python", avatar: "https://github.com/shadcn.png" },
    { rank: 3, name: "JS_Ninja", xp: 13800, level: 38, language: "JavaScript", avatar: "https://github.com/shadcn.png" },
    { rank: 4, name: "Rust_Evangelist", xp: 12500, level: 35, language: "Rust", avatar: "" },
    { rank: 5, name: "Go_Gopher", xp: 11900, level: 33, language: "Go", avatar: "" },
    { rank: 6, name: "Java_Junkie", xp: 10500, level: 30, language: "Java", avatar: "" },
    { rank: 7, name: "Cpp_Wizard", xp: 9800, level: 28, language: "C++", avatar: "" },
    { rank: 8, name: "Ruby_Gem", xp: 9200, level: 26, language: "Ruby", avatar: "" },
    { rank: 9, name: "Swift_Speed", xp: 8700, level: 25, language: "Swift", avatar: "" },
    { rank: 10, name: "Kotlin_King", xp: 8100, level: 23, language: "Kotlin", avatar: "" },
];

const Leaderboard = () => {
    const [period, setPeriod] = useState("all-time");

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1: return <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500 animate-bounce-slow" />;
            case 2: return <Medal className="w-6 h-6 text-slate-400 fill-slate-300" />;
            case 3: return <Medal className="w-6 h-6 text-orange-400 fill-orange-300" />;
            default: return <span className="text-lg font-bold text-slate-500 w-6 text-center">{rank}</span>;
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans pb-12">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
                            ← Back to Dashboard
                        </Link>
                    </div>
                    <h1 className="text-xl font-bold text-slate-800">Global Leaderboard</h1>
                    <div className="w-24"></div> {/* Spacer */}
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white mb-8 shadow-lg shadow-blue-500/20">
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-extrabold mb-2">Rise to the Top</h2>
                            <p className="text-blue-100 max-w-md">Compete with developers worldwide, earn XP, and showcase your coding mastery.</p>
                        </div>
                        <Trophy className="w-24 h-24 text-yellow-400 opacity-80" />
                    </div>
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
                    <Tabs defaultValue="all-time" className="w-full sm:w-auto" onValueChange={setPeriod}>
                        <TabsList className="bg-white border border-slate-200">
                            <TabsTrigger value="weekly">Weekly</TabsTrigger>
                            <TabsTrigger value="monthly">Monthly</TabsTrigger>
                            <TabsTrigger value="all-time">All Time</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input placeholder="Search user..." className="pl-9 bg-white border-slate-200" />
                    </div>
                </div>

                {/* Leaderboard Table */}
                <Card className="border-slate-200 shadow-sm bg-white/80 backdrop-blur-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    <th className="px-6 py-4 w-20 text-center">Rank</th>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4 text-center">Level</th>
                                    <th className="px-6 py-4">Language</th>
                                    <th className="px-6 py-4 text-right">Total XP</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {MOCK_LEADERBOARD.map((user, index) => (
                                    <tr
                                        key={index}
                                        className={`group hover:bg-blue-50/50 transition-colors ${index < 3 ? 'bg-gradient-to-r from-transparent via-transparent' : ''} ${index === 0 ? 'to-yellow-50/30' :
                                                index === 1 ? 'to-slate-50/30' :
                                                    index === 2 ? 'to-orange-50/30' : ''
                                            }`}
                                    >
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center">
                                                {getRankIcon(user.rank)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className={`h-10 w-10 border-2 ${index === 0 ? 'border-yellow-400' :
                                                        index === 1 ? 'border-slate-300' :
                                                            index === 2 ? 'border-orange-300' : 'border-slate-100'
                                                    }`}>
                                                    <AvatarImage src={user.avatar} />
                                                    <AvatarFallback className="bg-slate-200 text-slate-600 font-bold">
                                                        {user.name.slice(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                                                        {user.name}
                                                    </div>
                                                    {index === 0 && (
                                                        <Badge variant="secondary" className="text-[10px] bg-yellow-100 text-yellow-700 h-5 px-1.5 gap-1">
                                                            <Sparkles className="w-3 h-3" /> Champion
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge variant="outline" className="font-mono bg-slate-50 text-slate-600 border-slate-200">
                                                Lvl {user.level}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <span className={`w-2 h-2 rounded-full ${user.language === 'Python' ? 'bg-blue-500' :
                                                        user.language === 'JavaScript' ? 'bg-yellow-400' :
                                                            user.language === 'C++' ? 'bg-purple-500' :
                                                                user.language === 'Rust' ? 'bg-orange-600' : 'bg-slate-400'
                                                    }`} />
                                                {user.language}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="font-bold text-slate-800 font-mono text-lg tracking-tight">
                                                {user.xp.toLocaleString()}
                                            </span>
                                            <span className="text-xs text-slate-400 ml-1">XP</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Leaderboard;
