import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { GitCoreArchitecture } from '@/components/GitCoreArchitecture';
import { GitSetupCloning } from '@/components/GitSetupCloning';
import { GitSynchronizing } from '@/components/GitSynchronizing';
import { GitIntegratingChanges } from '@/components/GitIntegratingChanges';
import { GitAdvancedCommands } from '@/components/GitAdvancedCommands';
import { Features } from '@/components/Features';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <GitCoreArchitecture />
        <GitSetupCloning />
        <GitSynchronizing />
        <GitIntegratingChanges />
        <GitAdvancedCommands />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default Index;