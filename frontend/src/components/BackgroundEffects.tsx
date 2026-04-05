import React from 'react';

export const GrainOverlay: React.FC = () => {
  return <div className="fixed inset-0 noise-overlay z-[100] pointer-events-none"></div>;
};

export const HeroGlow: React.FC = () => {
  return <div className="fixed inset-0 emerald-glow z-0 pointer-events-none"></div>;
};

export const BackgroundEffects: React.FC = () => {
  return (
    <>
      <GrainOverlay />
      <HeroGlow />
    </>
  );
};
