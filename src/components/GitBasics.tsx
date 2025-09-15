import React, { useState } from 'react';
import { Terminal as TerminalIcon, GitBranch, Plus, Save, Eye, RefreshCw, Settings, Download, Cloud, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Terminal } from '@/components/ui/terminal';
import { GitTopicModal } from '@/components/GitTopicModal';

export const GitBasics: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [terminalHistory, setTerminalHistory] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [gitState, setGitState] = useState({
    initialized: false,
    staged: [] as string[],
    committed: [] as { message: string; files: string[] }[],
    configured: false,
    cloned: false,
    remoteAdded: false,
    userName: '',
    userEmail: ''
  });

  const commands = [
    { cmd: 'git config --global user.name "Your Name"', desc: 'Set your Git username' },
    { cmd: 'git config --global user.email "you@example.com"', desc: 'Set your Git email' },
    { cmd: 'git clone https://github.com/riresearchlab/git', desc: 'Clone a repository from GitHub' },
    { cmd: 'git init', desc: 'Initialize a new Git repository' },
    { cmd: 'git remote add origin https://github.com/riresearchlab/git', desc: 'Add remote repository' },
    { cmd: 'git add README.md', desc: 'Stage a file for commit' },
    { cmd: 'git commit -m "Initial commit"', desc: 'Create your first commit' },
    { cmd: 'git status', desc: 'Check repository status' },
    { cmd: 'git log', desc: 'View commit history' }
  ];

  const executeCommand = (command: string) => {
    setTerminalHistory(prev => [...prev, `admin@ubuntu:~$ ${command}`]);
    
    switch (command) {
      case 'git config --global user.name "Your Name"':
        setGitState(prev => ({ ...prev, userName: 'Your Name', configured: true }));
        setTerminalHistory(prev => [...prev, 'Global username set to: Your Name']);
        break;
      case 'git config --global user.email "you@example.com"':
        setGitState(prev => ({ ...prev, userEmail: 'you@example.com', configured: true }));
        setTerminalHistory(prev => [...prev, 'Global email set to: you@example.com']);
        break;
      case 'git clone https://github.com/riresearchlab/git':
        setGitState(prev => ({ ...prev, cloned: true, initialized: true }));
        setTerminalHistory(prev => [...prev, 'Cloning into \'git\'...', 'remote: Enumerating objects: 15, done.', 'remote: Counting objects: 100% (15/15), done.', 'remote: Compressing objects: 100% (12/12), done.', 'remote: Total 15 (delta 2), reused 15 (delta 2), pack-reused 0', 'Unpacking objects: 100% (15/15), done.']);
        break;
      case 'git init':
        setGitState(prev => ({ ...prev, initialized: true }));
        setTerminalHistory(prev => [...prev, 'Initialized empty Git repository in .git/']);
        break;
      case 'git remote add origin https://github.com/riresearchlab/git':
        if (gitState.initialized) {
          setGitState(prev => ({ ...prev, remoteAdded: true }));
          setTerminalHistory(prev => [...prev, 'Remote origin added successfully']);
        } else {
          setTerminalHistory(prev => [...prev, 'fatal: not a git repository']);
        }
        break;
      case 'git add README.md':
        if (gitState.initialized) {
          setGitState(prev => ({ ...prev, staged: ['README.md'] }));
          setTerminalHistory(prev => [...prev, 'File staged successfully']);
        } else {
          setTerminalHistory(prev => [...prev, 'fatal: not a git repository']);
        }
        break;
      case 'git commit -m "Initial commit"':
        if (gitState.staged.length > 0) {
          setGitState(prev => ({
            ...prev,
            committed: [...prev.committed, { message: 'Initial commit', files: [...prev.staged] }],
            staged: []
          }));
          setTerminalHistory(prev => [...prev, '[main (root-commit) abc1234] Initial commit', ' 1 file changed, 0 insertions(+), 0 deletions(-)']);
        } else {
          setTerminalHistory(prev => [...prev, 'nothing to commit, working tree clean']);
        }
        break;
      case 'git status':
        if (!gitState.initialized) {
          setTerminalHistory(prev => [...prev, 'fatal: not a git repository']);
        } else if (gitState.staged.length > 0) {
          setTerminalHistory(prev => [...prev, 'On branch main', 'Changes to be committed:', '  (use "git reset HEAD <file>..." to unstage)', '', '	modified:   README.md']);
        } else {
          setTerminalHistory(prev => [...prev, 'On branch main', 'nothing to commit, working tree clean']);
        }
        break;
      case 'git log':
        if (gitState.committed.length > 0) {
          gitState.committed.forEach(commit => {
            setTerminalHistory(prev => [...prev, `commit abc${Math.random().toString().slice(2, 8)}`, `Author: ${gitState.userName || 'You'} <${gitState.userEmail || 'you@example.com'}>`, `Date: ${new Date().toDateString()}`, '', `    ${commit.message}`, '']);
          });
        } else {
          setTerminalHistory(prev => [...prev, 'fatal: your current branch \'main\' does not have any commits yet']);
        }
        break;
    }
  };

  const resetDemo = () => {
    setTerminalHistory([]);
    setGitState({ 
      initialized: false, 
      staged: [], 
      committed: [], 
      configured: false, 
      cloned: false, 
      remoteAdded: false, 
      userName: '', 
      userEmail: '' 
    });
    setCurrentStep(0);
  };

  const openModal = (topicId: string) => {
    setSelectedTopic(topicId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTopic(null);
  };

  return (
    <section id="git-basics" className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            <Terminal className="w-4 h-4 mr-2" />
            Interactive Git Basics
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Master the <span className="text-gradient-primary">Fundamentals</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Learn Git basics with live command execution and visual feedback
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
          {/* Left Column */}
          <div className="space-y-8">
            {/* Git State Visualization */}
            <Card className="card-glow glow-green">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GitBranch className="w-5 h-5" />
                  <span>Git Repository State</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Git Configuration */}
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center space-x-2">
                      <Settings className="w-4 h-4" />
                      <span>Git Configuration</span>
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-4 p-3 rounded-lg bg-surface-elevated">
                        <div className={`w-3 h-3 rounded-full ${gitState.userName ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <span className="text-sm">User: {gitState.userName || 'Not configured'}</span>
                      </div>
                      <div className="flex items-center space-x-4 p-3 rounded-lg bg-surface-elevated">
                        <div className={`w-3 h-3 rounded-full ${gitState.userEmail ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <span className="text-sm">Email: {gitState.userEmail || 'Not configured'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Repository Status */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4 p-4 rounded-lg bg-surface-elevated">
                      <div className={`w-4 h-4 rounded-full ${gitState.cloned ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                      <span className={gitState.cloned ? 'text-blue-400' : 'text-gray-400'}>
                        Repository {gitState.cloned ? 'Cloned from GitHub' : 'Not cloned'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 p-4 rounded-lg bg-surface-elevated">
                      <div className={`w-4 h-4 rounded-full ${gitState.initialized ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <span className={gitState.initialized ? 'text-green-400' : 'text-gray-400'}>
                        Repository {gitState.initialized ? 'Initialized' : 'Not Initialized'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 p-4 rounded-lg bg-surface-elevated">
                      <div className={`w-4 h-4 rounded-full ${gitState.remoteAdded ? 'bg-purple-500' : 'bg-gray-400'}`}></div>
                      <span className={gitState.remoteAdded ? 'text-purple-400' : 'text-gray-400'}>
                        Remote Origin {gitState.remoteAdded ? 'Added' : 'Not added'}
                      </span>
                    </div>
                  </div>

                  {/* Staging Area */}
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center space-x-2">
                      <Plus className="w-4 h-4" />
                      <span>Staging Area</span>
                    </h4>
                    <div className="min-h-[60px] p-4 border-2 border-dashed border-accent rounded-lg">
                      {gitState.staged.length > 0 ? (
                        gitState.staged.map((file, idx) => (
                          <Badge key={idx} variant="secondary" className="mr-2 mb-2">
                            {file}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-center">No staged files</p>
                      )}
                    </div>
                  </div>

                  {/* Commit History */}
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center space-x-2">
                      <Save className="w-4 h-4" />
                      <span>Commit History</span>
                    </h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {gitState.committed.length > 0 ? (
                        gitState.committed.map((commit, idx) => (
                          <div key={idx} className="p-3 bg-primary/10 rounded-lg border-l-4 border-primary">
                            <div className="font-mono text-sm text-primary">
                              commit abc{Math.random().toString().slice(2, 8)}
                            </div>
                            <div className="text-sm">{commit.message}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Files: {commit.files.join(', ')}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-center p-4">No commits yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Git Commands */}
            <Card className="card-glow glow-orange">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TerminalIcon className="w-5 h-5" />
                  <span>Git Commands</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {commands.map((command, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <Button
                        onClick={() => executeCommand(command.cmd)}
                        className="text-sm font-mono flex-1 justify-start"
                        variant={idx <= currentStep ? "default" : "outline"}
                      >
                        {command.cmd}
                      </Button>
                    </div>
                  ))}
                  <Button onClick={resetDemo} variant="outline" className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Interactive Terminal */}
          <Card className="card-glow glow-blue">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TerminalIcon className="w-5 h-5" />
                <span>Interactive Terminal</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Terminal
                title="Git Basics Demo"
                output={terminalHistory}
                onClear={() => setTerminalHistory([])}
                height="h-[450px]"
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