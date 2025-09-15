import { Footer } from '@/components/Footer';
import { GitAdvancedCommands } from '@/components/GitAdvancedCommands';
import { GitCoreArchitecture } from '@/components/GitCoreArchitecture';
import { GitIntegratingChanges } from '@/components/GitIntegratingChanges';
import { GitSetupCloning } from '@/components/GitSetupCloning';
import { GitSynchronizing } from '@/components/GitSynchronizing';
import { Hero } from '@/components/Hero';
import { Navigation } from '@/components/Navigation';

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
      </main>
      <Footer />
    </div>
  );
};

export default Index;