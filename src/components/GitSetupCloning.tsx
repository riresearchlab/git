import React, { useState } from 'react';
import { Settings, Download, FileText, TerminalIcon, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Terminal } from '@/components/ui/terminal';
import { GitTopicModal } from '@/components/GitTopicModal';

export const GitSetupCloning: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [terminalHistory, setTerminalHistory] = useState<string[]>([]);
  const [gitState, setGitState] = useState({
    configured: false,
    cloned: false,
    userName: '',
    userEmail: '',
    repoUrl: ''
  });

  const openModal = (topicId: string) => {
    setSelectedTopic(topicId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTopic(null);
  };

  const executeCommand = (command: string, output: string, stateUpdate?: any) => {
    setTerminalHistory(prev => [...prev, `$ ${command}`, output]);
    if (stateUpdate) {
      setGitState(prev => ({ ...prev, ...stateUpdate }));
    }
  };

  const configureGit = () => {
    executeCommand(
      'git config --global user.name "John Doe"',
      'Username configured globally',
      { configured: true, userName: 'John Doe', userEmail: 'john@example.com' }
    );
    executeCommand(
      'git config --global user.email "john@example.com"',
      'Email configured globally'
    );
  };

  const cloneRepo = () => {
    executeCommand(
      'git clone https://github.com/example/project.git',
      'Cloning into \'project\'...\nremote: Enumerating objects: 15, done.\nremote: Total 15 (delta 0), reused 15 (delta 0)\nUnpacking objects: 100% (15/15), done.',
      { cloned: true, repoUrl: 'https://github.com/example/project.git' }
    );
  };

  const showLog = () => {
    executeCommand(
      'git log --oneline',
      'abc1234 Initial commit\ndef5678 Add README\nghi9012 Setup project structure'
    );
  };

  const resetDemo = () => {
    setTerminalHistory([]);
    setGitState({
      configured: false,
      cloned: false,
      userName: '',
      userEmail: '',
      repoUrl: ''
    });
  };

  const clearTerminal = () => {
    setTerminalHistory([]);
  };

  return (
    <section id="git-setup-cloning" className="py-20 bg-gradient-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            <Download className="w-4 h-4 mr-2" />
            Getting Started
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gradient-primary">Setting up</span> and Cloning
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get started with Git by configuring your identity and cloning repositories
          </p>
        </div>

        {/* Concept Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: Settings,
              title: "Git Config",
              description: "Set up your Git identity and preferences",
              color: "electric-blue",
              topicId: "config"
            },
            {
              icon: Download,
              title: "Git Clone",
              description: "Download repository from remote server",
              color: "neon-green",
              topicId: "clone"
            },
            {
              icon: FileText,
              title: "Git Log",
              description: "View commit history and track changes",
              color: "warm-orange",
              topicId: "git-log"
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
          {/* Setup Progress */}
          <Card className="card-glow glow-blue">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Git Setup Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Configuration Status */}
                <div className="space-y-4">
                  <h4 className="font-semibold mb-3">Configuration Status</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-surface-elevated">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${gitState.configured ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <span className="text-sm">Git Configuration</span>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={configureGit}
                        disabled={gitState.configured}
                      >
                        {gitState.configured ? 'Configured' : 'Configure'}
                      </Button>
                    </div>
                    
                    {gitState.configured && (
                      <div className="ml-6 space-y-2 text-sm text-muted-foreground">
                        <div>Username: {gitState.userName}</div>
                        <div>Email: {gitState.userEmail}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Repository Status */}
                <div className="space-y-4">
                  <h4 className="font-semibold mb-3">Repository Status</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-surface-elevated">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${gitState.cloned ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <span className="text-sm">Repository Cloned</span>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={cloneRepo}
                        disabled={gitState.cloned}
                      >
                        {gitState.cloned ? 'Cloned' : 'Clone'}
                      </Button>
                    </div>
                    
                    {gitState.cloned && (
                      <div className="ml-6 text-sm text-muted-foreground">
                        Repository: {gitState.repoUrl}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-4 border-t">
                  <Button 
                    onClick={showLog}
                    disabled={!gitState.cloned}
                    className="w-full"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Commit History
                  </Button>
                  <Button onClick={resetDemo} variant="outline" className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset Demo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Terminal */}
          <Card className="card-glow glow-green">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TerminalIcon className="w-5 h-5" />
                <span>Interactive Terminal</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Terminal
                title="Git Setup & Cloning Demo"
                output={terminalHistory}
                onClear={clearTerminal}
                height="h-96"
              />
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