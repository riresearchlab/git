import React, { useState } from 'react';
import { Cherry, Archive, Settings, TerminalIcon, RefreshCw, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Terminal } from '@/components/ui/terminal';
import { GitTopicModal } from '@/components/GitTopicModal';

interface Commit {
  id: string;
  message: string;
  hash: string;
}

interface StashEntry {
  id: string;
  message: string;
  files: string[];
}

export const GitAdvancedCommands: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [commits, setCommits] = useState<Commit[]>([
    { id: '1', message: 'Initial commit', hash: 'd6d822b' },
    { id: '2', message: 'Add authentication', hash: 'cbc5e4c' },
    { id: '3', message: 'Fix security bug', hash: '9f15548' },
    { id: '4', message: 'Add user dashboard', hash: '31686f5' },
  ]);
  const [stash, setStash] = useState<StashEntry[]>([]);
  const [workingChanges, setWorkingChanges] = useState(['src/auth.js', 'styles/main.css']);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [resetHistory, setResetHistory] = useState<Commit[]>([]);

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

  const cherryPick = (commitHash: string) => {
    const commit = commits.find(c => c.hash === commitHash);
    if (!commit) return;

    const newCommit = {
      ...commit,
      id: `cherry-${Date.now()}`,
      hash: `chr${Math.random().toString(36).substr(2, 4)}`,
      message: `${commit.message} (cherry-picked)`
    };

    setCommits(prev => [...prev, newCommit]);
    addOutput(
      `git cherry-pick ${commitHash}`,
      `[main ${newCommit.hash}] ${newCommit.message}\\n 1 file changed, 5 insertions(+)`
    );
  };

  const stashChanges = (message: string = 'WIP: work in progress') => {
    if (workingChanges.length === 0) return;

    const newStash: StashEntry = {
      id: `stash-${Date.now()}`,
      message,
      files: [...workingChanges]
    };

    setStash(prev => [newStash, ...prev]);
    setWorkingChanges([]);
    addOutput(
      `git stash push -m "${message}"`,
      `Saved working directory and index state On main: ${message}\\nHEAD is now at d6d822b ${commits[commits.length - 1]?.message}`
    );
  };

  const applyStash = (stashId: string) => {
    const stashEntry = stash.find(s => s.id === stashId);
    if (!stashEntry) return;

    setWorkingChanges(prev => [...prev, ...stashEntry.files]);
    setStash(prev => prev.filter(s => s.id !== stashId));
    const filesOutput = stashEntry.files.map(f => `  modified: ${f}`).join('\n');
    addOutput(
      `git stash apply stash@{0}`,
      `On branch main: ${stashEntry.message}
Changes applied successfully

Changes not staged for commit:
${filesOutput}`
    );
  };

  const performReset = (mode: string, targetCommit?: string) => {
    const target = targetCommit || commits[commits.length - 2]?.hash || 'HEAD~1';
    const targetCommitObj = commits.find(c => c.hash === target) || commits[commits.length - 2];
    
    if (mode === '--hard') {
      setWorkingChanges([]);
      setResetHistory([...commits]);
      setCommits(prev => prev.slice(0, -1));
    }
    
    addOutput(
      `git reset ${mode} ${target}`,
      `HEAD is now at ${target} ${targetCommitObj?.message || 'Previous commit'}${mode === '--hard' ? '\\nWorking directory and index reset' : ''}`
    );
  };

  const addWorkingChanges = () => {
    const newFiles = ['src/newFeature.js', 'tests/feature.test.js'];
    setWorkingChanges(prev => [...prev, ...newFiles]);
    addOutput(
      'echo "console.log(\'new feature\')" > src/newFeature.js',
      'Created new files for demonstration'
    );
  };

  const resetDemo = () => {
    setCommits([
      { id: '1', message: 'Initial commit', hash: 'd6d822b' },
      { id: '2', message: 'Add authentication', hash: 'cbc5e4c' },
      { id: '3', message: 'Fix security bug', hash: '9f15548' },
      { id: '4', message: 'Add user dashboard', hash: '31686f5' },
    ]);
    setStash([]);
    setWorkingChanges(['src/auth.js', 'styles/main.css']);
    setTerminalOutput([]);
    setResetHistory([]);
  };

  const clearTerminal = () => {
    setTerminalOutput([]);
  };

  return (
    <section id="git-advanced-commands" className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            <Cherry className="w-4 h-4 mr-2" />
            Power User Tools
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gradient-primary">Advanced</span> Commands
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Master sophisticated Git operations for complex workflow scenarios and precise history manipulation
          </p>
        </div>

        {/* Concept Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: Cherry,
              title: "Cherry Pick",
              description: "Apply specific commits to current branch",
              color: "electric-blue",
              topicId: "cherry-pick"
            },
            {
              icon: Archive,
              title: "Stash",
              description: "Temporarily save changes without committing",
              color: "neon-green",
              topicId: "stash"
            },
            {
              icon: Settings,
              title: "Reset",
              description: "Move HEAD and branch pointer to specific commit",
              color: "warm-orange",
              topicId: "reset"
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
          {/* Advanced Operations */}
          <Card className="card-glow glow-blue">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Cherry className="w-5 h-5" />
                <span>Advanced Operations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Cherry Pick Section */}
                <div>
                  <h4 className="font-semibold mb-3">Cherry Pick Commits</h4>
                  <div className="space-y-2 mb-4">
                    {commits.slice(0, 4).map((commit) => (
                      <div key={commit.id} className="flex items-center justify-between p-2 bg-surface-elevated rounded">
                        <div className="flex items-center space-x-2">
                          <Cherry className="w-4 h-4 text-blue-400" />
                          <code className="text-xs bg-primary/20 px-2 py-1 rounded">{commit.hash}</code>
                          <span className="text-sm">{commit.message}</span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => cherryPick(commit.hash)}
                        >
                          Pick
                        </Button>
                      </div>
                    ))}
                  </div>
                  {commits.length > 4 && (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded">
                      <div className="text-sm font-medium text-green-400">Cherry-picked commits:</div>
                      {commits.slice(4).map((commit) => (
                        <div key={commit.id} className="text-sm text-green-300 mt-1">
                          {commit.hash} - {commit.message}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Stash Section */}
                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-3">Stash Management</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium mb-2">Working Directory</div>
                      <div className="space-y-2 mb-3">
                        {workingChanges.length > 0 ? (
                          workingChanges.map((file, idx) => (
                            <div key={idx} className="flex items-center space-x-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                              <span className="text-sm">{file}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground text-sm">No changes in working directory</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Button
                          size="sm"
                          onClick={() => stashChanges()}
                          disabled={workingChanges.length === 0}
                          className="w-full"
                        >
                          <Archive className="w-4 h-4 mr-2" />
                          Stash Changes
                        </Button>
                        <Button
                          size="sm"
                          onClick={addWorkingChanges}
                          variant="outline"
                          className="w-full"
                        >
                          Add Working Changes
                        </Button>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-2">Stash Entries</div>
                      <div className="space-y-2">
                        {stash.length > 0 ? (
                          stash.map((entry, idx) => (
                            <div key={entry.id} className="p-2 bg-surface-elevated rounded">
                              <div className="flex items-center justify-between mb-1">
                                <code className="text-xs">stash@{idx}</code>
                                <Button
                                  size="sm"
                                  onClick={() => applyStash(entry.id)}
                                >
                                  Apply
                                </Button>
                              </div>
                              <div className="text-sm text-muted-foreground">{entry.message}</div>
                              <div className="text-xs text-muted-foreground">
                                Files: {entry.files.join(', ')}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground text-sm">No stash entries</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reset Section */}
                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-3">Git Reset Operations</h4>
                  <div className="space-y-3">
                    {[
                      { mode: '--soft', desc: 'Keep changes in staging area', color: 'blue' },
                      { mode: '--mixed', desc: 'Keep changes in working directory', color: 'yellow' },
                      { mode: '--hard', desc: 'Discard all changes (destructive)', color: 'red' }
                    ].map(({ mode, desc, color }) => (
                      <div key={mode} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">git reset {mode}</div>
                          <div className="text-sm text-muted-foreground">{desc}</div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => performReset(mode)}
                          variant={color === 'red' ? 'destructive' : 'outline'}
                        >
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Reset
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terminal and Status */}
          <Card className="card-glow glow-green">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TerminalIcon className="w-5 h-5" />
                <span>Command Output</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Terminal */}
                <Terminal
                  title="Git Advanced Commands Demo"
                  output={terminalOutput}
                  onClear={clearTerminal}
                  height="h-[320px]"
                />

                {/* Status Information */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-surface-elevated rounded">
                      <div className="font-medium">Working Files</div>
                      <div className="text-muted-foreground">{workingChanges.length} modified</div>
                    </div>
                    <div className="p-3 bg-surface-elevated rounded">
                      <div className="font-medium">Stash Entries</div>
                      <div className="text-muted-foreground">{stash.length} saved</div>
                    </div>
                  </div>

                  {/* Best Practices */}
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <h5 className="font-medium mb-2">Advanced Command Tips</h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Use cherry-pick for specific fixes across branches</li>
                      <li>• Stash before switching contexts or branches</li>
                      <li>• Be careful with --hard reset (destructive)</li>
                      <li>• Keep stash entries organized with messages</li>
                    </ul>
                  </div>

                  <Button onClick={resetDemo} variant="outline" className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset Demo
                  </Button>
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