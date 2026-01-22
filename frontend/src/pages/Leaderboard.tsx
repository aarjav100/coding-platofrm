import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Medal, Crown, Search, Sparkles, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from 'react-router-dom';
import api from '@/lib/api';

interface LeaderboardUser {
    _id: string;
    username: string;
    points: number;
    solvedCount: number;
    lastLogin: string;
}

const Leaderboard = () => {
    const [period, setPeriod] = useState("all-time");
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const { data } = await api.get('/leaderboard');
                setLeaderboardData(data);
            } catch (error) {
                console.error("Failed to fetch leaderboard", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1: return <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500 animate-bounce-slow" />;
            case 2: return <Medal className="w-6 h-6 text-slate-400 fill-slate-300" />;
            case 3: return <Medal className="w-6 h-6 text-orange-400 fill-orange-300" />;
            default: return <span className="text-lg font-bold text-slate-500 w-6 text-center">{rank}</span>;
        }
    };

    const filteredData = leaderboardData.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                            <TabsTrigger value="weekly" disabled>Weekly</TabsTrigger>
                            <TabsTrigger value="monthly" disabled>Monthly</TabsTrigger>
                            <TabsTrigger value="all-time">All Time</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search user..."
                            className="pl-9 bg-white border-slate-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Leaderboard Table */}
                <Card className="border-slate-200 shadow-sm bg-white/80 backdrop-blur-sm overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        <th className="px-6 py-4 w-20 text-center">Rank</th>
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4 text-center">Problems Solved</th>
                                        <th className="px-6 py-4">Last Active</th>
                                        <th className="px-6 py-4 text-right">Total XP</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredData.map((user, index) => (
                                        <tr
                                            key={user._id}
                                            className={`group hover:bg-blue-50/50 transition-colors ${index < 3 ? 'bg-gradient-to-r from-transparent via-transparent' : ''} ${index === 0 ? 'to-yellow-50/30' :
                                                index === 1 ? 'to-slate-50/30' :
                                                    index === 2 ? 'to-orange-50/30' : ''
                                                }`}
                                        >
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center">
                                                    {getRankIcon(index + 1)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className={`h-10 w-10 border-2 ${index === 0 ? 'border-yellow-400' :
                                                        index === 1 ? 'border-slate-300' :
                                                            index === 2 ? 'border-orange-300' : 'border-slate-100'
                                                        }`}>
                                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} />
                                                        <AvatarFallback className="bg-slate-200 text-slate-600 font-bold">
                                                            {user.username.slice(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                                                            {user.username}
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
                                                    {user.solvedCount}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="font-bold text-slate-800 font-mono text-lg tracking-tight">
                                                    {user.points.toLocaleString()}
                                                </span>
                                                <span className="text-xs text-slate-400 ml-1">XP</span>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredData.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                                No users found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default Leaderboard;
