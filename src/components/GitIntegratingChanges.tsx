import React, { useState } from 'react';
import { GitMerge, RotateCcw, ArrowRight, GitBranch, Terminal, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GitTopicModal } from '@/components/GitTopicModal';

interface Commit {
  id: string;
  message: string;
  branch: string;
  hash: string;
}

export const GitIntegratingChanges: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [commits, setCommits] = useState<Commit[]>([
    { id: '1', message: 'Initial commit', branch: 'main', hash: 'abc1234' },
    { id: '2', message: 'Add feature A', branch: 'main', hash: 'def5678' },
    { id: '3', message: 'Feature B development', branch: 'feature', hash: 'ghi9012' },
    { id: '4', message: 'Fix bug in feature B', branch: 'feature', hash: 'jkl3456' },
  ]);
  const [rebaseResult, setRebaseResult] = useState<Commit[]>([]);
  const [mergeResult, setMergeResult] = useState<Commit[]>([]);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [currentBranch, setCurrentBranch] = useState('main');
  const [availableBranches] = useState(['main', 'feature', 'develop']);

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

  const performMerge = (sourceBranch: string) => {
    const mainCommits = commits.filter(c => c.branch === 'main');
    const featureCommits = commits.filter(c => c.branch === sourceBranch);
    
    const mergeCommit = {
      id: `merge-${Date.now()}`,
      message: `Merge branch '${sourceBranch}' into ${currentBranch}`,
      branch: currentBranch,
      hash: `mrg${Math.random().toString(36).substr(2, 4)}`
    };

    const result = [...mainCommits, ...featureCommits, mergeCommit];
    setMergeResult(result);
    
    addOutput(
      `git merge ${sourceBranch}`,
      `Merge made by the 'recursive' strategy.\n ${featureCommits.length} files changed, ${featureCommits.length * 10} insertions(+), 2 deletions(-)`
    );
  };

  const performRebase = (targetBranch: string) => {
    const targetCommits = commits.filter(c => c.branch === targetBranch);
    const currentCommits = commits.filter(c => c.branch === currentBranch && c.branch !== targetBranch);
    
    const rebasedCommits = currentCommits.map((commit, idx) => ({
      ...commit,
      hash: `reb${Math.random().toString(36).substr(2, 4)}`,
      id: `rebased-${idx}`
    }));

    const result = [...targetCommits, ...rebasedCommits];
    setRebaseResult(result);
    
    addOutput(
      `git rebase ${targetBranch}`,
      `Successfully rebased and updated refs/heads/${currentBranch}.\n${rebasedCommits.length} commits rebased`
    );
  };

  const demonstrateWorkflow = () => {
    addOutput(
      'git checkout -b feature/new-component',
      "Switched to a new branch 'feature/new-component'"
    );
    setTimeout(() => {
      addOutput(
        'git add . && git commit -m "Add new component"',
        '[feature/new-component abc1234] Add new component\n 3 files changed, 45 insertions(+)'
      );
    }, 1000);
    setTimeout(() => {
      addOutput(
        'git checkout main && git merge feature/new-component',
        'Updating def5678..abc1234\nFast-forward\n src/Component.js | 45 +++++++++++++++++++++++++++++++++++++++++++++\n 1 file changed, 45 insertions(+)'
      );
    }, 2000);
  };

  const resetDemo = () => {
    setCommits([
      { id: '1', message: 'Initial commit', branch: 'main', hash: 'abc1234' },
      { id: '2', message: 'Add feature A', branch: 'main', hash: 'def5678' },
      { id: '3', message: 'Feature B development', branch: 'feature', hash: 'ghi9012' },
      { id: '4', message: 'Fix bug in feature B', branch: 'feature', hash: 'jkl3456' },
    ]);
    setRebaseResult([]);
    setMergeResult([]);
    setTerminalOutput([]);
    setCurrentBranch('main');
  };

  return (
    <section id="git-integrating-changes" className="py-20 bg-gradient-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            <GitMerge className="w-4 h-4 mr-2" />
            Advanced Integration
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gradient-primary">Integrating</span> Changes
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Master the art of combining work from different branches using merge, rebase, and workflow strategies
          </p>
        </div>

        {/* Concept Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: GitMerge,
              title: "Git Merge",
              description: "Combine changes from different branches back together",
              color: "neon-green",
              topicId: "merging"
            },
            {
              icon: RotateCcw,
              title: "Git Rebase",
              description: "Rewrite commit history for cleaner timeline",
              color: "warm-orange",
              topicId: "rebase"
            },
            {
              icon: ArrowRight,
              title: "Workflow",
              description: "Organize team collaboration with structured strategies",
              color: "electric-blue",
              topicId: "workflow"
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
          {/* Integration Visualization */}
          <Card className="card-glow glow-blue">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GitBranch className="w-5 h-5" />
                <span>Integration Methods</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Original Commits */}
                <div>
                  <h4 className="font-semibold mb-3">Original Branch Structure</h4>
                  <div className="space-y-2">
                    {commits.map((commit) => (
                      <div key={commit.id} className="flex items-center justify-between p-2 bg-surface-elevated rounded">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${commit.branch === 'main' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                          <code className="text-xs bg-primary/20 px-2 py-1 rounded">{commit.hash}</code>
                          <span className="text-sm">{commit.message}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">{commit.branch}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Integration Actions */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Integration Operations</h4>
                  <div className="grid gap-3">
                    <Button
                      onClick={() => performMerge('feature')}
                      className="w-full justify-start"
                    >
                      <GitMerge className="w-4 h-4 mr-2" />
                      Merge feature into main
                    </Button>
                    <Button
                      onClick={() => performRebase('main')}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Rebase feature onto main
                    </Button>
                    <Button
                      onClick={demonstrateWorkflow}
                      className="w-full justify-start"
                      variant="secondary"
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Demo Feature Workflow
                    </Button>
                  </div>
                </div>

                {/* Results */}
                {mergeResult.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 text-green-400">Merge Result</h4>
                    <div className="space-y-2">
                      {mergeResult.slice(-3).map((commit) => (
                        <div key={commit.id} className="flex items-center space-x-2 p-2 bg-green-500/10 border border-green-500/20 rounded">
                          <code className="text-xs bg-green-500/20 px-2 py-1 rounded">{commit.hash}</code>
                          <span className="text-sm">{commit.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {rebaseResult.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 text-orange-400">Rebase Result</h4>
                    <div className="space-y-2">
                      {rebaseResult.slice(-3).map((commit) => (
                        <div key={commit.id} className="flex items-center space-x-2 p-2 bg-orange-500/10 border border-orange-500/20 rounded">
                          <code className="text-xs bg-orange-500/20 px-2 py-1 rounded">{commit.hash}</code>
                          <span className="text-sm">{commit.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Terminal and Workflow */}
          <Card className="card-glow glow-green">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Terminal className="w-5 h-5" />
                <span>Integration Commands</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Terminal Output */}
                <div className="bg-black rounded-lg p-4 font-mono text-sm h-64 overflow-y-auto">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-400 ml-2">Terminal</span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-gray-300">Git Integration Demo</div>
                    <div className="text-gray-300">Practice merging, rebasing, and workflow operations</div>
                    <div className="text-gray-300">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                    {terminalOutput.map((line, idx) => (
                      <div key={idx} className={line.startsWith('$') ? 'text-green-400' : 'text-gray-300'}>
                        {line}
                      </div>
                    ))}
                    <div className="text-green-400">
                      $ <span className="animate-pulse">_</span>
                    </div>
                  </div>
                </div>

                {/* Branch Management */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Current Context</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Current Branch:</span>
                      <Badge variant="secondary">{currentBranch}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {availableBranches.map(branch => (
                        <Button
                          key={branch}
                          size="sm"
                          variant={currentBranch === branch ? "default" : "outline"}
                          onClick={() => setCurrentBranch(branch)}
                        >
                          {branch}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Best Practices */}
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <h5 className="font-medium mb-2">Integration Best Practices</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Use merge for preserving branch history</li>
                    <li>• Use rebase for clean linear history</li>
                    <li>• Always test after integration</li>
                    <li>• Follow team workflow conventions</li>
                  </ul>
                </div>

                <Button onClick={resetDemo} variant="outline" className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
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