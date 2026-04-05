import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const SidebarHUD: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  const getMenuClass = (activePath: string) => {
    const isActive = path === activePath || (activePath === '/contests' && path.startsWith('/contests'));
    return {
      container: `group flex items-center gap-4 cursor-pointer`,
      indicator: `w-1 h-6 transition-all rounded-full ${isActive ? 'bg-primary opacity-100' : 'bg-primary opacity-0 group-hover:opacity-100'}`,
      icon: `material-symbols-outlined transition-colors ${isActive ? 'text-primary' : 'text-outline group-hover:text-primary'}`,
      text: `font-label text-sm ${isActive ? 'font-bold text-primary' : 'font-medium'}`
    };
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: 'space_dashboard' },
    { name: 'Contests', path: '/contests', icon: 'code' },
    { name: 'Leaderboard', path: '/leaderboard', icon: 'social_leaderboard' },
    { name: 'Problems', path: '/playground', icon: 'integration_instructions' },
  ];

  return (
    <aside className="w-64 flex flex-col gap-8 p-8 border-r border-outline-variant/10 text-on-surface h-full">
      <div className="flex flex-col gap-6">
        {navItems.map((item) => {
          const classes = getMenuClass(item.path);
          return (
            <Link to={item.path} key={item.name} className={classes.container}>
              <div className={classes.indicator}></div>
              <span className={classes.icon}>{item.icon}</span>
              <span className={classes.text}>{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-auto p-4 bg-surface-container-low rounded border-b-2 border-primary-container">
        <p className="text-xs text-outline font-mono mb-2">PRO STATUS</p>
        <p className="text-sm font-bold text-on-surface">Emerald Tier</p>
        <div className="w-full bg-surface-container-highest h-1 mt-3 rounded-full overflow-hidden">
          <div className="bg-primary w-3/4 h-full"></div>
        </div>
      </div>
    </aside>
  );
};
