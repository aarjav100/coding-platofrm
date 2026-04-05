import React, { useState } from 'react';
import { BackgroundEffects } from '@/components/BackgroundEffects';
import { TopNav } from '@/components/TopNav';
import { SidebarHUD } from '@/components/SidebarHUD';

const Contests = () => {
  const [activeTab, setActiveTab] = useState('ACTIVE CONTESTS');

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary selection:text-on-primary min-h-screen">
      <BackgroundEffects />
      
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <TopNav />
          
          <main className="flex flex-col md:flex-row flex-1 md:pr-10 lg:pr-20">
            <div className="hidden md:block h-full">
              <SidebarHUD />
            </div>
            
            {/* Content Area */}
            <div className="flex-1 flex flex-col p-6 md:p-10 gap-10">
              {/* Featured Banner */}
              <section className="relative group rounded-lg overflow-hidden min-h-[300px] md:min-h-[400px] flex flex-col justify-end p-8 md:p-12 border border-outline-variant/20">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
                  style={{
                    backgroundImage: `linear-gradient(to top, #111318 0%, rgba(17, 19, 24, 0.4) 50%, rgba(17, 19, 24, 0) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuBFKbf9yKyf8gXIjYz6QUvrKpMFR4f8wa9MCLtlQXAbw5-MKAtbA4D0-L0LX2-AH3CzRIoD4ER0FxyZXaLGYQN1UMWJZnvGKut3-pqZVr_hDyNqy7COMeuE_kG3QuUfiJoR6B5rAQs6BPKiRcUKHECsXxIMhi2o94rf8toBO0f-NNuWA34REyd2fJlNyMx06Xjpjz4Zyo1IZvrvOFJnbKDP_R7C0Rw5q4IgtT9KHZKMzOUeW5XjVNSxF9E3cZXMbGO2bRSxajO1xU4')`
                  }}
                ></div>
                <div className="absolute top-6 right-6 md:top-10 md:right-10 flex gap-2">
                  <span className="bg-primary-container text-on-primary-container px-3 py-1 text-[10px] md:text-xs font-bold tracking-widest uppercase rounded">Featured</span>
                  <span className="bg-surface-container-highest/80 backdrop-blur text-white px-3 py-1 text-[10px] md:text-xs font-bold tracking-widest uppercase rounded">March 24</span>
                </div>
                <div className="relative z-10 max-w-2xl">
                  <h1 className="font-headline text-3xl md:text-5xl font-bold leading-tight mb-4 tracking-tighter">
                    CODE THE FUTURE: <span className="text-primary">GENESIS HACK</span>
                  </h1>
                  <p className="text-on-surface-variant text-sm md:text-lg leading-relaxed mb-8 font-body">
                    Build the next generation of decentralized infrastructure. $50,000 prize pool, world-class mentors, and exclusive NFT rewards for top contributors.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="bg-primary-container text-on-primary-container font-bold px-8 py-3 rounded hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all">Register Now</button>
                    <button className="bg-surface-container-highest text-on-surface font-bold px-8 py-3 rounded border border-outline-variant hover:bg-surface-bright transition-all">View Details</button>
                  </div>
                </div>
              </section>

              {/* Contest Controls */}
              <section className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row justify-between border-b border-outline-variant/30 pb-2 gap-4 md:items-end">
                  <div className="flex gap-4 md:gap-8 overflow-x-auto w-full md:w-auto scrollbar-hide">
                    {['ACTIVE CONTESTS', 'UPCOMING', 'PAST RESULTS'].map((tab) => (
                      <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-4 border-b-2 font-bold text-xs md:text-sm tracking-wide whitespace-nowrap transition-colors ${
                          activeTab === tab 
                            ? 'border-primary text-primary' 
                            : 'border-transparent text-outline hover:text-on-surface'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 pb-2 md:pb-4 whitespace-nowrap self-start md:self-auto">
                    <span className="text-xs text-outline font-mono">SORT BY:</span>
                    <button className="text-xs font-bold flex items-center gap-1">
                      PRIZE POOL <span className="material-symbols-outlined text-[14px]">expand_more</span>
                    </button>
                  </div>
                </div>

                {/* Grid of Contests */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {/* Contest Card 1 */}
                  <div className="bg-surface-container-low border border-outline-variant/10 rounded-lg p-6 hover:bg-surface-container transition-all group flex flex-col justify-between h-full min-h-[320px]">
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div className="bg-primary/10 text-primary px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase">Live Now</div>
                        <div className="text-outline text-xs font-mono">ID: #C-1092</div>
                      </div>
                      <h3 className="font-headline text-xl font-bold mb-2 group-hover:text-primary transition-colors">Neural Net Optimization</h3>
                      <p className="text-on-surface-variant text-sm mb-6 line-clamp-2">Optimize latency for large-scale language models in constrained hardware environments.</p>
                      
                      <div className="space-y-3 mb-8">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-outline text-lg">calendar_today</span>
                          <div className="flex flex-col">
                            <span className="text-[10px] text-outline uppercase font-bold tracking-tighter">Starts</span>
                            <span className="text-sm font-medium">Started 2h ago</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-outline text-lg">schedule</span>
                          <div className="flex flex-col">
                            <span className="text-[10px] text-outline uppercase font-bold tracking-tighter">Duration</span>
                            <span className="text-sm font-medium">48 Hours</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-primary text-lg">payments</span>
                          <div className="flex flex-col">
                            <span className="text-[10px] text-outline uppercase font-bold tracking-tighter">Prize Pool</span>
                            <span className="text-sm font-bold text-primary">$12,000 USD</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className="w-full bg-surface-container-highest text-on-surface font-bold py-3 rounded hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-2 mt-auto">
                      Join Contest <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>

                  {/* Contest Card 2 */}
                  <div className="bg-surface-container-low border border-outline-variant/10 rounded-lg p-6 hover:bg-surface-container transition-all group flex flex-col justify-between h-full min-h-[320px]">
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div className="bg-secondary/10 text-secondary px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase">System Design</div>
                        <div className="text-outline text-xs font-mono">ID: #C-1095</div>
                      </div>
                      <h3 className="font-headline text-xl font-bold mb-2 group-hover:text-primary transition-colors">Distributed Cache Engine</h3>
                      <p className="text-on-surface-variant text-sm mb-6 line-clamp-2">Design and implement a zero-copy distributed cache with high consistency guarantees.</p>
                      
                      <div className="space-y-3 mb-8">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-outline text-lg">calendar_today</span>
                          <div className="flex flex-col">
                            <span className="text-[10px] text-outline uppercase font-bold tracking-tighter">Starts</span>
                            <span className="text-sm font-medium">Tomorrow, 10:00 AM</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-outline text-lg">schedule</span>
                          <div className="flex flex-col">
                            <span className="text-[10px] text-outline uppercase font-bold tracking-tighter">Duration</span>
                            <span className="text-sm font-medium">3 Hours</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-primary text-lg">payments</span>
                          <div className="flex flex-col">
                            <span className="text-[10px] text-outline uppercase font-bold tracking-tighter">Prize Pool</span>
                            <span className="text-sm font-bold text-primary">$5,000 USD</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className="w-full bg-surface-container-highest text-on-surface font-bold py-3 rounded hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-2 mt-auto">
                      Pre-Register <span className="material-symbols-outlined text-sm">notifications_active</span>
                    </button>
                  </div>

                  {/* Contest Card 3 */}
                  <div className="bg-surface-container-low border border-outline-variant/10 rounded-lg p-6 hover:bg-surface-container transition-all group flex flex-col justify-between h-full min-h-[320px]">
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div className="bg-primary/10 text-primary px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase">Algorithms</div>
                        <div className="text-outline text-xs font-mono">ID: #C-1102</div>
                      </div>
                      <h3 className="font-headline text-xl font-bold mb-2 group-hover:text-primary transition-colors">Obsidian Sprint 08</h3>
                      <p className="text-on-surface-variant text-sm mb-6 line-clamp-2">A weekly high-speed competitive programming round featuring 5 problems.</p>
                      
                      <div className="space-y-3 mb-8">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-outline text-lg">calendar_today</span>
                          <div className="flex flex-col">
                            <span className="text-[10px] text-outline uppercase font-bold tracking-tighter">Starts</span>
                            <span className="text-sm font-medium">March 15, 18:00</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-outline text-lg">schedule</span>
                          <div className="flex flex-col">
                            <span className="text-[10px] text-outline uppercase font-bold tracking-tighter">Duration</span>
                            <span className="text-sm font-medium">90 Minutes</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-primary text-lg">payments</span>
                          <div className="flex flex-col">
                            <span className="text-[10px] text-outline uppercase font-bold tracking-tighter">Prize Pool</span>
                            <span className="text-sm font-bold text-primary">Points + $1k</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className="w-full bg-surface-container-highest text-on-surface font-bold py-3 rounded hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-2 mt-auto">
                      Join Sprint <span className="material-symbols-outlined text-sm">bolt</span>
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </main>
          
          {/* Sticky Footer CTA */}
          <footer className="mt-auto border-t border-outline-variant/10 py-6 px-4 md:px-10 flex flex-col sm:flex-row items-center justify-between bg-surface-container-high/60 backdrop-blur-[20px] gap-4">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse w-shrink-0"></div>
              <p className="text-[10px] md:text-xs font-mono text-outline">CURRENTLY 12,482 DEVELOPERS ONLINE</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-10">
              <a className="text-[10px] md:text-xs font-bold text-outline hover:text-on-surface transition-colors" href="#">API DOCS</a>
              <a className="text-[10px] md:text-xs font-bold text-outline hover:text-on-surface transition-colors" href="#">GUIDELINES</a>
              <a className="text-[10px] md:text-xs font-bold text-outline hover:text-on-surface transition-colors" href="#">SUPPORT</a>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Contests;
