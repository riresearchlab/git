import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { GitBasics } from '@/components/GitBasics';
import { GitBranching } from '@/components/GitBranching';
import { GitAdvanced } from '@/components/GitAdvanced';
import { Features } from '@/components/Features';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <GitBasics />
        <GitBranching />
        <GitAdvanced />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default Index;