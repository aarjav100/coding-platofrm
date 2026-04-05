import React from 'react';

export const GlobalFooter: React.FC = () => {
  return (
    <footer className="z-10 flex flex-col md:flex-row justify-between items-center px-12 py-8 w-full border-t border-surface-variant bg-surface-container-lowest">
      <div className="mb-4 md:mb-0">
        <span className="font-headline text-lg font-bold text-primary">NexCode</span>
      </div>
      <div className="flex flex-col items-center gap-4">
        <p className="font-['Space_Grotesk'] text-xs uppercase tracking-widest text-slate-500">
          © 2024 NexCode. Precision engineered for the Obsidian Architect.
        </p>
        <div className="flex gap-6">
          <a
            className="font-['Space_Grotesk'] text-xs uppercase tracking-widest text-slate-500 hover:text-primary transition-colors"
            href="#"
          >
            Documentation
          </a>
          <a
            className="font-['Space_Grotesk'] text-xs uppercase tracking-widest text-slate-500 hover:text-primary transition-colors"
            href="#"
          >
            Terms of Service
          </a>
          <a
            className="font-['Space_Grotesk'] text-xs uppercase tracking-widest text-slate-500 hover:text-primary transition-colors"
            href="#"
          >
            Privacy Policy
          </a>
          <a
            className="font-['Space_Grotesk'] text-xs uppercase tracking-widest text-slate-500 hover:text-primary transition-colors"
            href="#"
          >
            Contact Support
          </a>
        </div>
      </div>
    </footer>
  );
};
