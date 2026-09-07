import React from 'react';

export const AmbientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse delay-700" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
    </div>
  );
};
