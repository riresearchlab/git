import React, { useState } from 'react';
import { Download, Upload, GitBranch, Globe, RefreshCw, TerminalIcon, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Terminal } from '@/components/ui/terminal';
import { GitTopicModal } from '@/components/GitTopicModal';

export const GitSynchronizing: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [localCommits, setLocalCommits] = useState(2);
  const [remoteCommits, setRemoteCommits] = useState(3);
  const [hasUnpushedChanges, setHasUnpushedChanges] = useState(true);
  const [hasUnpulledChanges, setHasUnpulledChanges] = useState(true);
  const [currentBranch, setCurrentBranch] = useState('main');
  const [branches, setBranches] = useState(['main', 'develop', 'feature/auth']);

  const openModal = (topicId: string) => {
    setSelectedTopic(topicId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTopic(null);
  };

  const addOutput = (command: string, output: string) => {
    setTerminalOutput(prev => [...prev, `$ ${command}`, output]);
  };

  const performPull = () => {
    if (remoteCommits > 0) {
      setRemoteCommits(0);
      setHasUnpulledChanges(false);
      addOutput(
        'git pull origin main',
        `remote: Enumerating objects: ${remoteCommits * 2}, done.
remote: Counting objects: 100% (${remoteCommits * 2}/${remoteCommits * 2}), done.
Updating d6d822b..cbc5e4c
Fast-forward
 README.md | 2 ++
 1 file changed, 2 insertions(+)`
      );
    } else {
      addOutput('git pull origin main', 'Already up to date.');
    }
  };

  const performPush = () => {
    if (localCommits > 0) {
      setLocalCommits(0);
      setHasUnpushedChanges(false);
      addOutput(
        'git push origin main',
        `Enumerating objects: ${localCommits * 3}, done.
Counting objects: 100% (${localCommits * 3}/${localCommits * 3}), done.
Writing objects: 100% (${localCommits}/${localCommits}), done.
Total ${localCommits} (delta 0), reused 0 (delta 0)
To https://github.com/user/repo
   d6d822b..cbc5e4c  main -> main`
      );
    } else {
      addOutput('git push origin main', 'Everything up-to-date');
    }
  };

  const createBranch = () => {
    const newBranch = `feature/new-${Date.now()}`;
    setBranches(prev => [...prev, newBranch]);
    setCurrentBranch(newBranch);
    addOutput(`git checkout -b ${newBranch}`, `Switched to a new branch '${newBranch}'`);
  };

  const deleteBranch = (branchToDelete: string) => {
    if (['main', 'develop', 'feature/auth'].includes(branchToDelete)) {
      addOutput(`git branch -d ${branchToDelete}`, `error: Cannot delete protected branch '${branchToDelete}'.`);
      return;
    }
    if (branchToDelete === currentBranch) {
      addOutput(`git branch -d ${branchToDelete}`, `error: Cannot delete branch '${branchToDelete}' which is currently checked out.`);
      return;
    }
    setBranches(prev => prev.filter(b => b !== branchToDelete));
    addOutput(`git branch -d ${branchToDelete}`, `Deleted branch ${branchToDelete}.`);
  };

  const switchBranch = (branch: string) => {
    setCurrentBranch(branch);
    addOutput(`git checkout ${branch}`, `Switched to branch '${branch}'`);
  };

  const resetDemo = () => {
    setTerminalOutput([]);
    setLocalCommits(2);
    setRemoteCommits(3);
    setHasUnpushedChanges(true);
    setHasUnpulledChanges(true);
    setCurrentBranch('main');
    setBranches(['main', 'develop', 'feature/auth']);
  };

  const clearTerminal = () => {
    setTerminalOutput([]);
  };

  return (
    <section id="git-synchronizing" className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            <RefreshCw className="w-4 h-4 mr-2" />
            Remote Sync
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gradient-primary">Synchronizing</span> with Remotes
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Keep your local and remote repositories in sync with push, pull, and branch operations
          </p>
        </div>

        {/* Concept Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: Download,
              title: "Git Pull",
              description: "Download and merge remote changes",
              color: "neon-green",
              topicId: "pull"
            },
            {
              icon: Upload,
              title: "Git Push",
              description: "Upload local commits to remote repository",
              color: "electric-blue",
              topicId: "push"
            },
            {
              icon: GitBranch,
              title: "Git Branch",
              description: "Create parallel development paths for features",
              color: "warm-orange",
              topicId: "branching"
            }
          ].map((concept, idx) => {
            const Icon = concept.icon;
            return (
              <Card key={idx} className="card-glow group hover:scale-105 transition-transform">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 rounded-xl bg-surface-elevated mx-auto mb-6 flex items-center justify-center glow-${concept.color === 'electric-blue' ? 'blue' : concept.color === 'neon-green' ? 'green' : 'orange'}`}>
                    <Icon className={`w-8 h-8 text-${concept.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{concept.title}</h3>
                  <p className="text-base text-muted-foreground mb-6">{concept.description}</p>
                  <Button 
                    variant="outline" 
                    size="default" 
                    className="w-full"
                    onClick={() => openModal(concept.topicId)}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Sync Status Visualization */}
          <Card className="card-glow glow-blue">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <RefreshCw className="w-5 h-5" />
                <span>Repository Sync Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Remote Status */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium flex items-center space-x-2">
                        <TerminalIcon className="w-4 h-4" />
                        <span>Local Repository</span>
                      </h5>
                      <Badge variant={hasUnpushedChanges ? "destructive" : "secondary"}>
                        {localCommits} unpushed
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {hasUnpushedChanges && (
                        <div className="flex items-center space-x-2 text-sm text-yellow-600">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span>Local changes ready to push</span>
                        </div>
                      )}
                      <Button 
                        onClick={performPush} 
                        className="w-full text-sm"
                        disabled={!hasUnpushedChanges}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        git push origin {currentBranch}
                      </Button>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium flex items-center space-x-2">
                        <Globe className="w-4 h-4" />
                        <span>Remote (GitHub)</span>
                      </h5>
                      <Badge variant={hasUnpulledChanges ? "destructive" : "secondary"}>
                        {remoteCommits} unpulled
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {hasUnpulledChanges && (
                        <div className="flex items-center space-x-2 text-sm text-blue-600">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Remote changes available</span>
                        </div>
                      )}
                      <Button 
                        onClick={performPull} 
                        className="w-full text-sm"
                        disabled={!hasUnpulledChanges}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        git pull origin {currentBranch}
                      </Button>
                    </div>
                  </Card>
                </div>

                {/* Sync Status Indicator */}
                <Card className="p-4 bg-gradient-to-r from-blue-500/10 to-green-500/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <RefreshCw className="w-5 h-5 text-primary" />
                      <div>
                        <h5 className="font-medium">Repository Status</h5>
                        <p className="text-sm text-muted-foreground">
                          {!hasUnpushedChanges && !hasUnpulledChanges 
                            ? 'Local and remote repositories are in sync' 
                            : 'Synchronization needed'}
                        </p>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      !hasUnpushedChanges && !hasUnpulledChanges ? 'bg-green-500' : 'bg-orange-500'
                    }`}></div>
                  </div>
                </Card>

                {/* Branch Management */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Branch Management</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Current Branch: <Badge variant="secondary">{currentBranch}</Badge></span>
                      <Button size="sm" onClick={createBranch}>
                        <GitBranch className="w-4 h-4 mr-1" />
                        New Branch
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {branches.map(branch => {
                        const isProtected = ['main', 'develop', 'feature/auth'].includes(branch);
                        return (
                          <div key={branch} className="flex">
                            <Button
                              size="sm"
                              variant={currentBranch === branch ? "default" : "outline"}
                              onClick={() => switchBranch(branch)}
                              className={isProtected ? 'rounded-full' : 'rounded-r-none'}
                            >
                              {branch}
                            </Button>
                            {!isProtected && (
                              <Button
                                size="sm"
                                variant="destructive"
                                className="rounded-l-none rounded-r-full px-2"
                                onClick={() => deleteBranch(branch)}
                                disabled={currentBranch === branch}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terminal Output */}
          <Card className="card-glow glow-green">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TerminalIcon className="w-5 h-5" />
                <span>Command Output</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Terminal
                title="Git Synchronization Demo"
                output={terminalOutput}
                onClear={clearTerminal}
                height="h-[320px]"
              />
              
              <Button onClick={resetDemo} variant="outline" className="w-full mt-4">
                Reset Demo
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Modal */}
        <GitTopicModal 
          isOpen={isModalOpen}
          onClose={closeModal}
          topicId={selectedTopic}
        />
      </div>
    </section>
  );
};