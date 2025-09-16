import React, { useState } from 'react';
import { Terminal as TerminalIcon, Plus, Cloud, Settings, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Terminal } from '@/components/ui/terminal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GitTopicModal } from '@/components/GitTopicModal';

export const GitCoreArchitecture: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [terminalHistory, setTerminalHistory] = useState<string[]>([]);
  const [activeFlowTab, setActiveFlowTab] = useState('working');
  const [gitState, setGitState] = useState({
    workingFiles: ['index.html', 'style.css', 'script.js'],
    stagedFiles: [] as string[],
    remoteConnected: false
  });

  const openModal = (topicId: string) => {
    setSelectedTopic(topicId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTopic(null);
  };

  const stageFile = (file: string) => {
    setGitState(prev => ({
      ...prev,
      workingFiles: prev.workingFiles.filter(f => f !== file),
      stagedFiles: [...prev.stagedFiles, file]
    }));
    setTerminalHistory(prev => [...prev, `$ git add ${file}`, `Staged '${file}' for commit`]);
  };

  const stageAllFiles = () => {
    setGitState(prev => ({
      ...prev,
      workingFiles: [],
      stagedFiles: [...prev.stagedFiles, ...prev.workingFiles]
    }));
    setTerminalHistory(prev => [...prev, `$ git add .`, `All files staged for commit`]);
  };

  const commitFiles = () => {
    if (gitState.stagedFiles.length > 0) {
      setGitState(prev => ({
        ...prev,
        stagedFiles: []
      }));
      setTerminalHistory(prev => [
        ...prev, 
        `$ git commit -m "add new feature"`, 
        `[main d6d822b] add new feature\n ${gitState.stagedFiles.length} files changed, ${gitState.stagedFiles.length * 15} insertions(+)`
      ]);
    }
  };

  const pushToRemote = () => {
    if (gitState.remoteConnected) {
      setTerminalHistory(prev => [
        ...prev,
        `$ git push origin main`,
        `Enumerating objects: 5, done.\nCounting objects: 100% (5/5), done.\nTo https://github.com/user/repo.git\n   d6d822b..cbc5e4c  main -> main`
      ]);
    } else {
      setTerminalHistory(prev => [
        ...prev,
        `$ git push origin main`,
        `fatal: No configured push destination`
      ]);
    }
  };

  const runCompleteGitCycle = () => {
    // Stage all files
    setTimeout(() => stageAllFiles(), 500);
    // Commit with default message
    setTimeout(() => commitFiles(), 1500);
    // Push to remote
    setTimeout(() => pushToRemote(), 2500);
  };

  const unstageFile = (file: string) => {
    setGitState(prev => ({
      ...prev,
      stagedFiles: prev.stagedFiles.filter(f => f !== file),
      workingFiles: [...prev.workingFiles, file]
    }));
    setTerminalHistory(prev => [...prev, `$ git reset HEAD ${file}`, `Unstaged '${file}' from staging area`]);
  };

  const connectRemote = () => {
    setGitState(prev => ({ ...prev, remoteConnected: true }));
    setTerminalHistory(prev => [...prev, '$ git remote add origin https://github.com/user/repo.git', 'Remote origin added successfully']);
  };

  const resetDemo = () => {
    setGitState({
      workingFiles: ['index.html', 'style.css', 'script.js'],
      stagedFiles: [],
      remoteConnected: false
    });
    setTerminalHistory([]);
  };

  const clearTerminal = () => {
    setTerminalHistory([]);
  };

  return (
    <section id="git-core-architecture" className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            <Settings className="w-4 h-4 mr-2" />
            Core Concepts
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Git's <span className="text-gradient-primary">Core Architecture</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Understand the fundamental structure of Git's three-stage architecture
          </p>
        </div>

        {/* Concept Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: TerminalIcon,
              title: "Working Directory",
              description: "Your project files where you make changes",
              color: "warm-orange",
              topicId: "working-directory"
            },
            {
              icon: Plus,
              title: "Staging Area",
              description: "Prepared changes ready for commit",
              color: "electric-blue",
              topicId: "staging"
            },
            {
              icon: Cloud,
              title: "Remote Repository",
              description: "External repository for collaboration",
              color: "neon-green",
              topicId: "remote-repository"
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

        {/* Interactive Visualization */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Three-Stage Visualization */}
          <Card className="card-glow glow-blue">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Three-Stage Architecture</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Working Directory */}
                <div className="p-4 border-2 border-orange-500 rounded-lg bg-orange-500/10">
                  <h4 className="font-semibold text-orange-400 mb-3 flex items-center">
                    <TerminalIcon className="w-4 h-4 mr-2" />
                    Working Directory
                  </h4>
                  <div className="space-y-2">
                    {gitState.workingFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-surface-elevated rounded">
                        <span className="text-sm">{file}</span>
                        <Button size="sm" onClick={() => stageFile(file)}>
                          Stage
                        </Button>
                      </div>
                    ))}
                    {gitState.workingFiles.length === 0 && (
                      <p className="text-muted-foreground text-sm">No unstaged files</p>
                    )}
                  </div>
                  {gitState.workingFiles.length > 0 && (
                    <Button onClick={stageAllFiles} className="w-full mt-3" size="sm">
                      git add .
                    </Button>
                  )}
                </div>

                {/* Staging Area */}
                <div className="p-4 border-2 border-blue-500 rounded-lg bg-blue-500/10">
                  <h4 className="font-semibold text-blue-400 mb-3 flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Staging Area
                  </h4>
                  <div className="space-y-2">
                    {gitState.stagedFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-surface-elevated rounded">
                        <span className="text-sm">{file}</span>
                        <Button size="sm" variant="outline" onClick={() => unstageFile(file)}>
                          Unstage
                        </Button>
                      </div>
                    ))}
                    {gitState.stagedFiles.length === 0 && (
                      <p className="text-muted-foreground text-sm">No staged files</p>
                    )}
                  </div>
                  {gitState.stagedFiles.length > 0 && (
                    <Button onClick={commitFiles} className="w-full mt-3" size="sm">
                      git commit -m "add new feature"
                    </Button>
                  )}
                </div>

                {/* Remote Repository */}
                <div className="p-4 border-2 border-green-500 rounded-lg bg-green-500/10">
                  <h4 className="font-semibold text-green-400 mb-3 flex items-center">
                    <Cloud className="w-4 h-4 mr-2" />
                    Remote Repository
                  </h4>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm ${gitState.remoteConnected ? 'text-green-400' : 'text-muted-foreground'}`}>
                      {gitState.remoteConnected ? 'Connected to GitHub' : 'Not connected'}
                    </span>
                    {!gitState.remoteConnected && (
                      <Button size="sm" onClick={connectRemote}>
                        Connect
                      </Button>
                    )}
                  </div>
                  {gitState.remoteConnected && (
                    <Button onClick={pushToRemote} className="w-full" size="sm">
                      git push origin main
                    </Button>
                  )}
                </div>

                {/* Complete Git Cycle Button */}
                <div className="pt-4 border-t">
                  <Button onClick={runCompleteGitCycle} className="w-full" variant="secondary">
                    Complete Git Cycle (add → commit → push)
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Terminal */}
          <Card className="card-glow glow-green h-[700px]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <RefreshCw className="w-5 h-5" />
                <span>Interactive Terminal</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col">
              <Terminal
                title="Git Core Architecture Demo"
                output={terminalHistory}
                onClear={clearTerminal}
                height="h-[500px]"
              />
              <Button onClick={resetDemo} variant="outline" className="w-full mt-4">
                Reset Demo
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Git Flow Visualization with Tabs */}
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {/* Git Flow Tabs */}
          <Card className="card-glow glow-orange h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Git Flow Visualization</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[500px]">
              <Tabs value={activeFlowTab} onValueChange={setActiveFlowTab} className="h-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="working" className="flex items-center space-x-2">
                    <TerminalIcon className="w-4 h-4" />
                    <span>Working</span>
                  </TabsTrigger>
                  <TabsTrigger value="staging" className="flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Staging</span>
                  </TabsTrigger>
                  <TabsTrigger value="remote" className="flex items-center space-x-2">
                    <Cloud className="w-4 h-4" />
                    <span>Remote</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="working" className="h-[420px] overflow-y-auto">
                  <div className="text-center space-y-4 pt-4">
                    <div className="w-24 h-24 rounded-xl bg-orange-500/20 border-2 border-orange-500 mx-auto mb-4 flex items-center justify-center">
                      <TerminalIcon className="w-10 h-10 text-orange-400" />
                    </div>
                    <h4 className="font-semibold text-orange-400">Working Directory</h4>
                    <p className="text-sm text-muted-foreground">Edit files here<br/>git add →</p>
                    
                    <div className="bg-surface-elevated p-4 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-2">Current files:</div>
                      {gitState.workingFiles.length > 0 ? (
                        gitState.workingFiles.map((file, idx) => (
                          <div key={idx} className="text-sm text-orange-400">{file}</div>
                        ))
                      ) : (
                        <div className="text-sm text-muted-foreground">All files staged</div>
                      )}
                    </div>

                    <div className="flex justify-center">
                      <div className="text-center text-xs text-muted-foreground bg-surface-elevated px-3 py-1 rounded">
                        git add .
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="staging" className="h-[420px] overflow-y-auto">
                  <div className="text-center space-y-4 pt-4">
                    <div className="w-24 h-24 rounded-xl bg-blue-500/20 border-2 border-blue-500 mx-auto mb-4 flex items-center justify-center">
                      <Plus className="w-10 h-10 text-blue-400" />
                    </div>
                    <h4 className="font-semibold text-blue-400">Staging Area</h4>
                    <p className="text-sm text-muted-foreground">Prepared changes<br/>git commit →</p>
                    
                    <div className="bg-surface-elevated p-4 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-2">Staged files:</div>
                      {gitState.stagedFiles.length > 0 ? (
                        gitState.stagedFiles.map((file, idx) => (
                          <div key={idx} className="text-sm text-blue-400">{file}</div>
                        ))
                      ) : (
                        <div className="text-sm text-muted-foreground">No staged files</div>
                      )}
                    </div>

                    <div className="flex justify-center">
                      <div className="text-center text-xs text-muted-foreground bg-surface-elevated px-3 py-1 rounded">
                        git commit -m "message"
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="remote" className="h-[420px] overflow-y-auto">
                  <div className="text-center space-y-4 pt-4">
                    <div className="w-24 h-24 rounded-xl bg-green-500/20 border-2 border-green-500 mx-auto mb-4 flex items-center justify-center">
                      <Cloud className="w-10 h-10 text-green-400" />
                    </div>
                    <h4 className="font-semibold text-green-400">Remote Repository</h4>
                    <p className="text-sm text-muted-foreground">External repository<br/>git push →</p>
                    
                    <div className="bg-surface-elevated p-4 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-2">Connection status:</div>
                      <div className={`text-sm ${gitState.remoteConnected ? 'text-green-400' : 'text-muted-foreground'}`}>
                        {gitState.remoteConnected ? 'Connected to GitHub' : 'Not connected'}
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <div className="text-center text-xs text-muted-foreground bg-surface-elevated px-3 py-1 rounded">
                        git push origin main
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Complete Git Cycle Flow */}
          <Card className="card-glow glow-blue h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <RefreshCw className="w-5 h-5" />
                <span>Complete Git Cycle</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[500px] overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-orange-500/10 border border-orange-500/20 rounded">
                  <div className="flex items-center space-x-2">
                    <TerminalIcon className="w-4 h-4 text-orange-400" />
                    <span className="text-sm font-medium">Working Directory</span>
                  </div>
                  <code className="text-xs bg-surface-elevated px-2 py-1 rounded">git add .</code>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/20 rounded">
                  <div className="flex items-center space-x-2">
                    <Plus className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium">Staging Area</span>
                  </div>
                  <code className="text-xs bg-surface-elevated px-2 py-1 rounded">git commit -m</code>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded">
                  <div className="flex items-center space-x-2">
                    <Cloud className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium">Remote Repository</span>
                  </div>
                  <code className="text-xs bg-surface-elevated px-2 py-1 rounded">git push</code>
                </div>

                <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <h5 className="font-medium mb-2 text-sm">Default Commit Message:</h5>
                  <code className="text-sm text-primary">"add new feature"</code>
                </div>
              </div>
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