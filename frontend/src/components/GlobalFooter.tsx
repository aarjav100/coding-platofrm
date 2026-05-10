import React from 'react';

export const GlobalFooter: React.FC = () => {
  return (
    <footer className="bg-surface-container-lowest w-full border-t border-outline-variant/15 flex flex-col md:flex-row justify-between items-center px-12 py-8 mt-auto relative z-10">
      <div className="flex flex-col items-center md:items-start gap-4">
        <span className="text-lg font-bold text-primary font-headline tracking-tighter">NexCode</span>
        <p className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant/50">© 2026 NexCode. Precision engineered for the Obsidian Architect.</p>
      </div>
      <div className="flex gap-8 mt-6 md:mt-0">
        <a className="font-headline text-xs uppercase tracking-widest text-on-surface-variant/70 hover:text-primary transition-colors" href="#">Documentation</a>
        <a className="font-headline text-xs uppercase tracking-widest text-on-surface-variant/70 hover:text-primary transition-colors" href="#">Terms of Service</a>
        <a className="font-headline text-xs uppercase tracking-widest text-on-surface-variant/70 hover:text-primary transition-colors" href="#">Contact Support</a>
      </div>
    </footer>
  );
};
