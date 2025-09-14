import React, { useState } from 'react';
import { Terminal, Plus, Cloud, Settings, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GitTopicModal } from '@/components/GitTopicModal';

export const GitCoreArchitecture: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
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
  };

  const unstageFile = (file: string) => {
    setGitState(prev => ({
      ...prev,
      stagedFiles: prev.stagedFiles.filter(f => f !== file),
      workingFiles: [...prev.workingFiles, file]
    }));
  };

  const connectRemote = () => {
    setGitState(prev => ({ ...prev, remoteConnected: true }));
  };

  const resetDemo = () => {
    setGitState({
      workingFiles: ['index.html', 'style.css', 'script.js'],
      stagedFiles: [],
      remoteConnected: false
    });
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
              icon: Terminal,
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
                    <Terminal className="w-4 h-4 mr-2" />
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
                </div>

                {/* Remote Repository */}
                <div className="p-4 border-2 border-green-500 rounded-lg bg-green-500/10">
                  <h4 className="font-semibold text-green-400 mb-3 flex items-center">
                    <Cloud className="w-4 h-4 mr-2" />
                    Remote Repository
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${gitState.remoteConnected ? 'text-green-400' : 'text-muted-foreground'}`}>
                      {gitState.remoteConnected ? 'Connected to GitHub' : 'Not connected'}
                    </span>
                    {!gitState.remoteConnected && (
                      <Button size="sm" onClick={connectRemote}>
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Flow Diagram */}
          <Card className="card-glow glow-green">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <RefreshCw className="w-5 h-5" />
                <span>Data Flow</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-xl bg-orange-500/20 border-2 border-orange-500 mx-auto mb-4 flex items-center justify-center">
                    <Terminal className="w-8 h-8 text-orange-400" />
                  </div>
                  <h4 className="font-semibold text-orange-400">Working Directory</h4>
                  <p className="text-sm text-muted-foreground">Edit files here</p>
                </div>

                <div className="flex justify-center">
                  <div className="text-center text-xs text-muted-foreground bg-surface-elevated px-3 py-1 rounded">
                    git add →
                  </div>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 rounded-xl bg-blue-500/20 border-2 border-blue-500 mx-auto mb-4 flex items-center justify-center">
                    <Plus className="w-8 h-8 text-blue-400" />
                  </div>
                  <h4 className="font-semibold text-blue-400">Staging Area</h4>
                  <p className="text-sm text-muted-foreground">Review changes</p>
                </div>

                <div className="flex justify-center">
                  <div className="text-center text-xs text-muted-foreground bg-surface-elevated px-3 py-1 rounded">
                    git commit →
                  </div>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 rounded-xl bg-green-500/20 border-2 border-green-500 mx-auto mb-4 flex items-center justify-center">
                    <Cloud className="w-8 h-8 text-green-400" />
                  </div>
                  <h4 className="font-semibold text-green-400">Repository</h4>
                  <p className="text-sm text-muted-foreground">Permanent storage</p>
                </div>

                <Button onClick={resetDemo} variant="outline" className="w-full mt-6">
                  Reset Demo
                </Button>
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