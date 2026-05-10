import React, { useState, useEffect } from 'react';
import { BackgroundEffects } from '@/components/BackgroundEffects';
import { TopNav } from '@/components/TopNav';
import { GlobalFooter } from '@/components/GlobalFooter';
import api from '@/lib/api';
import { Loader2 } from "lucide-react";

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

    const filteredData = leaderboardData.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Mock currentUser logic since it's in the design
    const userInfoString = localStorage.getItem('userInfo');
    const currentUser = userInfoString ? JSON.parse(userInfoString) : null;
    const currentUserRank = currentUser ? leaderboardData.findIndex(u => u.username === currentUser.username) + 1 : 0;
    const currentUserData = currentUserRank > 0 ? leaderboardData[currentUserRank - 1] : null;

    return (
        <div className="bg-background text-on-surface font-body selection:bg-primary selection:text-on-primary min-h-screen antialiased overflow-x-hidden">
            <BackgroundEffects />
            <TopNav />
            
            <main className="pt-24 pb-32 px-4 md:px-12 max-w-screen-xl mx-auto min-h-screen relative z-10">
                {/* Hero Title Section */}
                <section className="mb-12 relative">
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
                    <h1 className="font-headline text-5xl md:text-6xl font-black tracking-tighter mb-4 text-on-surface">THE <span className="text-primary">ELITE</span> ROSTER.</h1>
                    <p className="text-on-surface-variant max-w-xl font-body leading-relaxed">The Obsidian Architect leaderboard showcases the top 0.1% of technical minds. Precision, speed, and architectural integrity define the ranks.</p>
                </section>

                {/* Stats Bento Overview (Asymmetric) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="md:col-span-2 bg-surface-container-low p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-8xl">terminal</span>
                        </div>
                        <div className="relative z-10">
                            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary/60 mb-2">Platform Total</p>
                            <h3 className="font-headline text-4xl font-bold mb-4">{loading ? '...' : leaderboardData.reduce((acc, user) => acc + (user.solvedCount || 0), 0).toLocaleString()}</h3>
                            <p className="text-sm text-on-surface-variant">Active deployments verified across all architects.</p>
                        </div>
                    </div>
                    <div className="bg-surface-container-high p-8 flex flex-col justify-end">
                        <p className="font-mono text-xs uppercase tracking-[0.2em] text-secondary mb-2">Success Rate</p>
                        <h3 className="font-headline text-3xl font-bold">98.4%</h3>
                    </div>
                    <div className="bg-surface-container p-8 flex flex-col justify-end border-l border-primary/20">
                        <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-2">Next Reset</p>
                        <h3 className="font-headline text-3xl font-bold">04:12:55</h3>
                    </div>
                </div>

                {/* Leaderboard Main Container */}
                <div className="bg-surface-container-lowest overflow-hidden shadow-2xl relative border border-outline-variant/10 rounded-sm">
                    {/* Tabs Navigation */}
                    <div className="flex flex-col md:flex-row md:items-center border-b border-outline-variant/15 px-6 pt-6 gap-4 pb-4 md:pb-0">
                        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                            <button className="px-6 py-2 md:py-4 border-b-2 border-primary text-primary font-mono text-xs uppercase tracking-widest transition-all">All-Time</button>
                            <button className="px-6 py-2 md:py-4 border-b-2 border-transparent text-on-surface-variant hover:text-on-surface font-mono text-xs uppercase tracking-widest transition-all hidden sm:block">Weekly</button>
                            <button className="px-6 py-2 md:py-4 border-b-2 border-transparent text-on-surface-variant hover:text-on-surface font-mono text-xs uppercase tracking-widest transition-all hidden sm:block">Daily</button>
                        </div>
                        <div className="md:ml-auto flex items-center gap-4">
                            <div className="relative w-full md:w-auto min-w-[200px]">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline material-symbols-outlined text-sm">search</span>
                                <input 
                                    className="bg-surface-container-low border-none focus:ring-1 focus:ring-primary pl-10 pr-4 py-2 text-xs font-mono w-full md:w-64 placeholder:text-outline/50 text-on-surface rounded-sm" 
                                    placeholder="Filter developers..." 
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Leaderboard Table */}
                    <div className="overflow-x-auto min-h-[300px]">
                        {loading ? (
                            <div className="flex justify-center items-center py-24">
                                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-surface-container-low">
                                    <tr className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/70">
                                        <th className="px-6 md:px-8 py-5 font-medium w-16 md:w-24">Rank</th>
                                        <th className="px-6 md:px-8 py-5 font-medium">Developer</th>
                                        <th className="px-6 md:px-8 py-5 font-medium">Points</th>
                                        <th className="px-6 md:px-8 py-5 font-medium text-center">Solved</th>
                                        <th className="px-6 md:px-8 py-5 font-medium text-right hidden sm:table-cell">Success Rate</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant/10">
                                    {filteredData.map((user, index) => {
                                        const rank = index + 1;
                                        
                                        // Rank styles
                                        let rankClasses = "text-on-surface-variant font-headline font-black text-sm";
                                        if (rank === 1) rankClasses = "bg-primary/20 text-primary font-headline font-black text-sm";
                                        
                                        // Tags
                                        let tagText = "Architect";
                                        let tagClasses = "text-outline";
                                        if (rank === 1) { tagText = "Lvl 99 Architect"; tagClasses = "text-primary border-primary/30 bg-primary/10"; }
                                        else if (rank === 2) { tagText = "Lead Engineer"; tagClasses = "text-secondary border-secondary/30 bg-secondary/10"; }
                                        else if (rank === 3) { tagText = "Senior Dev"; tagClasses = "text-on-surface-variant border-surface-variant bg-surface-container-highest"; }

                                        return (
                                            <tr key={user._id} className="group hover:bg-surface-container-high transition-colors">
                                                <td className="px-6 md:px-8 py-6">
                                                    <span className={`flex items-center justify-center w-8 h-8 rounded-full ${rankClasses}`}>
                                                        {rank < 10 ? `0${rank}` : rank}
                                                    </span>
                                                </td>
                                                <td className="px-6 md:px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-sm overflow-hidden bg-surface-container-highest flex-shrink-0">
                                                            <img 
                                                                className="w-full h-full object-cover" 
                                                                alt="Avatar" 
                                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="font-headline font-bold text-on-surface leading-none mb-1 group-hover:text-primary transition-colors">{user.username}</p>
                                                            <p className={`inline-block px-1.5 py-0.5 rounded-sm font-mono text-[9px] uppercase border ${tagClasses}`}>
                                                                {tagText}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 md:px-8 py-6 font-mono text-sm md:text-base font-bold text-on-surface text-primary/90">
                                                    {user.points.toLocaleString()}
                                                </td>
                                                <td className="px-6 md:px-8 py-6 text-center font-mono text-sm text-on-surface-variant">
                                                    {user.solvedCount || 0}
                                                </td>
                                                <td className="px-6 md:px-8 py-6 text-right hidden sm:table-cell">
                                                    <span className={`px-2 py-1 font-mono text-xs rounded-sm ${rank === 1 ? 'bg-primary/10 text-primary' : rank === 2 ? 'bg-secondary/10 text-secondary' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                                                        {rank === 1 ? '99.8%' : rank === 2 ? '97.2%' : '94.8%'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {filteredData.length === 0 && !loading && (
                                        <tr>
                                            <td colSpan={5} className="px-8 py-12 text-center text-outline">
                                                No architects found matching "{searchTerm}"
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
                
                {/* Highlighted User Position (Floating Bottom Anchor) */}
                {currentUser && currentUserData && (
                    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-screen-xl z-40 hidden md:block">
                        <div className="bg-surface-container-lowest/80 border border-primary/20 backdrop-blur-xl p-4 rounded-sm flex flex-col md:flex-row md:items-center justify-between shadow-[0_0_50px_rgba(0,0,0,0.5)] gap-4">
                            <div className="flex items-center gap-8">
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-primary font-black">#{currentUserRank}</span>
                                    <div className="w-8 h-8 rounded-sm bg-primary/20 flex items-center justify-center overflow-hidden">
                                        <img className="w-full h-full object-cover" alt="User avatar" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.username}`} />
                                    </div>
                                    <span className="font-headline font-bold text-on-surface">You (The Architect)</span>
                                </div>
                                <div className="hidden md:flex gap-6 items-center border-l border-primary/20 pl-8">
                                    <div>
                                        <p className="text-[10px] uppercase font-mono text-primary/60">Current Pts</p>
                                        <p className="text-sm font-bold text-on-surface">{currentUserData.points.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-mono text-primary/60">Solved</p>
                                        <p className="text-sm font-bold text-on-surface">{currentUserData.solvedCount || 0}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between md:justify-end items-center w-full md:w-auto gap-4">
                                <p className="text-xs font-mono text-on-surface-variant hidden lg:block">Keep pushing limits.</p>
                                <button className="w-full md:w-auto bg-primary text-on-primary px-4 py-2 text-xs font-headline font-black uppercase tracking-tighter rounded-sm hover:brightness-110 active:scale-95 transition-all">
                                    View Full Stats
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <GlobalFooter />

            {/* Decorative Elements */}
            <div className="fixed top-0 right-0 w-1/3 h-screen pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]"></div>
            </div>
        </div>
    );
};

export default Leaderboard;
