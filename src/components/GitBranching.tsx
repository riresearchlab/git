import React, { useState, useRef, useEffect } from 'react';
import { GitBranch, GitMerge, Plus, ArrowRight, Zap, Settings, Download, FolderOpen, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GitTopicModal } from '@/components/GitTopicModal';

interface Commit {
  id: string;
  message: string;
  x: number;
  y: number;
  branch: string;
}

interface Branch {
  name: string;
  commits: Commit[];
  color: string;
  active: boolean;
  lane: number;
}

function BranchVisualization({ branches }: { branches: Branch[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size properly
    const container = canvas.parentElement;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // Clear canvas with dark background
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (branches.length === 0) return;

    // Calculate layout
    const commitRadius = 6;
    const laneWidth = 30;
    const commitSpacing = 50;
    const startY = 40;
    const startX = 40;
    const maxCommits = Math.max(...branches.map(b => b.commits.length));

    // Draw network lines first (behind commits)
    branches.forEach((branch) => {
      if (branch.commits.length <= 1) return;

      ctx.strokeStyle = branch.color;
      ctx.lineWidth = 2;
      ctx.setLineDash([]);

      const x = startX + branch.lane * laneWidth;
      ctx.beginPath();
      ctx.moveTo(x, startY);
      ctx.lineTo(x, startY + (branch.commits.length - 1) * commitSpacing);
      ctx.stroke();
    });

    // Draw merge lines
    branches.forEach((branch) => {
      branch.commits.forEach((commit, commitIdx) => {
        if (commit.message.toLowerCase().includes('merge')) {
          const targetX = startX + branch.lane * laneWidth;
          const targetY = startY + commitIdx * commitSpacing;
          
          // Find source branch (assume it's the previous branch)
          const sourceBranch = branches.find(b => b.name !== branch.name && b.commits.length > 0);
          if (sourceBranch) {
            const sourceX = startX + sourceBranch.lane * laneWidth;
            const sourceY = targetY - commitSpacing;

            ctx.strokeStyle = branch.color;
            ctx.lineWidth = 2;
            ctx.setLineDash([3, 3]);
            
            ctx.beginPath();
            ctx.moveTo(sourceX, sourceY);
            ctx.quadraticCurveTo(
              sourceX + (targetX - sourceX) * 0.5, 
              sourceY + (targetY - sourceY) * 0.3,
              targetX, 
              targetY
            );
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      });
    });

    // Draw commits and labels
    branches.forEach((branch) => {
      branch.commits.forEach((commit, commitIdx) => {
        const x = startX + branch.lane * laneWidth;
        const y = startY + commitIdx * commitSpacing;

        // Draw commit circle
        ctx.beginPath();
        ctx.arc(x, y, commitRadius, 0, 2 * Math.PI);
        ctx.fillStyle = branch.color;
        ctx.fill();
        
        // Add white border for active branch
        if (branch.active) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Draw commit message
        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 12px system-ui';
        ctx.textAlign = 'left';
        const message = commit.message.length > 35 ? commit.message.substring(0, 35) + '...' : commit.message;
        ctx.fillText(message, x + 15, y - 2);

        // Draw commit hash
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px Monaco, monospace';
        ctx.fillText(commit.id.substring(0, 8), x + 15, y + 12);
      });
    });

  }, [branches]);

  return (
    <div className="h-80 w-full bg-slate-800/50 rounded-lg overflow-hidden border border-slate-600 relative">
      <div className="absolute top-3 left-3 text-slate-300 text-xs font-mono bg-slate-700/80 px-2 py-1 rounded">
        GRAPH
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </div>
  );
}

export const GitBranching: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([
    {
      name: 'main',
      commits: [
        { id: 'c1', message: 'Initial commit', x: 0, y: 0, branch: 'main' },
        { id: 'c2', message: 'Add README', x: 0, y: 1, branch: 'main' },
      ],
      color: '#0099CC',
      active: true,
      lane: 0
    }
  ]);
  const [currentBranch, setCurrentBranch] = useState('main');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const handleTopicClick = (topicId: string) => {
    setSelectedTopic(topicId);
    setModalOpen(true);
  };

  const addCommand = (cmd: string, output: string) => {
    setCommandHistory(prev => [...prev, `admin@ubuntu:~$ ${cmd}`, output]);
  };

  const createBranch = (branchName: string) => {
    const activeBranch = branches.find(b => b.name === currentBranch);
    if (!activeBranch || branches.some(b => b.name === branchName)) return;

    const lastCommit = activeBranch.commits[activeBranch.commits.length - 1];
    const newLane = Math.max(...branches.map(b => b.lane)) + 1;
    const newBranch: Branch = {
      name: branchName,
      commits: [{ 
        id: `${branchName}-start`, 
        message: `Branch point from ${currentBranch}`, 
        x: newLane,
        y: lastCommit.y,
        branch: branchName
      }],
      color: branchName === 'feature' ? '#00FF7F' : '#FF6600',
      active: false,
      lane: newLane
    };

    setBranches(prev => prev.map(b => ({ ...b, active: false })).concat(newBranch));
    addCommand(`git checkout -b ${branchName}`, `Switched to a new branch '${branchName}'`);
  };

  const switchBranch = (branchName: string) => {
    if (!branches.some(b => b.name === branchName)) return;
    
    setCurrentBranch(branchName);
    setBranches(prev => prev.map(b => ({ ...b, active: b.name === branchName })));
    addCommand(`git checkout ${branchName}`, `Switched to branch '${branchName}'`);
  };

  const addCommit = (message: string) => {
    setBranches(prev => prev.map(branch => {
      if (branch.name === currentBranch) {
        const lastCommit = branch.commits[branch.commits.length - 1];
        const newCommit: Commit = {
          id: `${branch.name}-${Date.now()}`,
          message,
          x: branch.lane,
          y: lastCommit.y + 1,
          branch: branch.name
        };
        return { ...branch, commits: [...branch.commits, newCommit] };
      }
      return branch;
    }));
    addCommand(`git commit -m "${message}"`, `[${currentBranch} abc1234] ${message}`);
  };

  const mergeBranch = (sourceBranch: string) => {
    const source = branches.find(b => b.name === sourceBranch);
    const target = branches.find(b => b.name === currentBranch);
    
    if (!source || !target || sourceBranch === currentBranch) return;

    const mergeCommit: Commit = {
      id: `merge-${Date.now()}`,
      message: `Merge branch '${sourceBranch}' into ${currentBranch}`,
      x: target.lane,
      y: target.commits[target.commits.length - 1].y + 1,
      branch: currentBranch
    };

    setBranches(prev => prev.map(branch => {
      if (branch.name === currentBranch) {
        return { ...branch, commits: [...branch.commits, mergeCommit] };
      }
      return branch;
    }));

    addCommand(`git merge ${sourceBranch}`, `Merge made by the 'recursive' strategy.`);
  };

  const resetDemo = () => {
    setBranches([
      {
        name: 'main',
        commits: [
          { id: 'c1', message: 'Initial commit', x: 0, y: 0, branch: 'main' },
          { id: 'c2', message: 'Add README', x: 0, y: 1, branch: 'main' },
        ],
        color: '#0099CC',
        active: true,
        lane: 0
      }
    ]);
    setCurrentBranch('main');
    setCommandHistory([]);
  };

  return (
    <section id="git-branching" className="py-20 bg-gradient-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            <GitBranch className="w-4 h-4 mr-2" />
            Interactive Git Learning
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Master <span className="text-gradient-primary">Git Commands</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Learn Git concepts through interactive examples and detailed explanations
          </p>
        </div>

      
        {/* Advanced Topics Section */}
        <div className="mb-12">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                id: "branching",
                icon: GitBranch,
                title: "Branching",
                description: "Create parallel development paths for features or experiments",
                color: "electric-blue"
              },
              {
                id: "merging",
                icon: GitMerge,
                title: "Merging",
                description: "Combine changes from different branches back together",
                color: "neon-green"
              },
              {
                id: "workflow",
                icon: ArrowRight,
                title: "Workflow",
                description: "Organize team collaboration with feature branches",
                color: "warm-orange"
              }
            ].map((concept, idx) => {
              const Icon = concept.icon;
              return (
                <Card 
                  key={idx} 
                  className="card-glow group hover:scale-105 transition-transform"
                >
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
                      onClick={() => handleTopicClick(concept.id)}
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 3D Visualization */}
          <Card className="card-glow glow-blue">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GitBranch className="w-5 h-5" />
                <span>Branch Visualization</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BranchVisualization branches={branches} />
              
              <div className="mt-4 space-y-2">
                <div className="text-sm font-semibold">Current Branch:</div>
                <Badge variant="secondary" className="text-primary">
                  {currentBranch}
                </Badge>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {branches.map(branch => (
                    <div key={branch.name} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: branch.color }}
                      ></div>
                      <span className={`text-sm ${branch.active ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                        {branch.name} ({branch.commits.length} commits)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Controls */}
          <Card className="card-glow glow-green">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Branch Operations</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Command Terminal */}
              <div className="bg-black rounded-lg p-4 font-mono text-sm h-40 overflow-y-auto">
                {/* Terminal Header */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-400 ml-2">Terminal</span>
                </div>
                {commandHistory.map((line, idx) => (
                  <div key={idx} className={line.startsWith('admin@ubuntu:~$') ? 'text-green-400' : 'text-gray-300'}>
                    {line}
                  </div>
                ))}
                <div className="text-green-400">
                  admin@ubuntu:~$ <span className="animate-pulse">_</span>
                </div>
              </div>

              {/* Branch Operations */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Create & Switch Branches</h4>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => createBranch('feature')}
                      disabled={branches.some(b => b.name === 'feature')}
                      className="text-sm"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Create feature
                    </Button>
                    <Button 
                      onClick={() => createBranch('hotfix')}
                      disabled={branches.some(b => b.name === 'hotfix')}
                      className="text-sm"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Create hotfix
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Switch to Branch</h4>
                  <div className="flex gap-2 flex-wrap">
                    {branches.map(branch => (
                      <Button
                        key={branch.name}
                        onClick={() => switchBranch(branch.name)}
                        variant={currentBranch === branch.name ? "default" : "outline"}
                        className="text-sm"
                      >
                        {branch.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Add Commits</h4>
                  <div className="flex gap-2 flex-wrap">
                    <Button 
                      onClick={() => addCommit('Add new feature')}
                      className="text-sm"
                    >
                      Add Feature Commit
                    </Button>
                    <Button 
                      onClick={() => addCommit('Fix bug')}
                      className="text-sm"
                    >
                      Add Bug Fix
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Merge Branches</h4>
                  <div className="flex gap-2 flex-wrap">
                    {branches
                      .filter(b => b.name !== currentBranch)
                      .map(branch => (
                        <Button
                          key={branch.name}
                          onClick={() => mergeBranch(branch.name)}
                          className="text-sm"
                        >
                          <GitMerge className="w-4 h-4 mr-1" />
                          Merge {branch.name}
                        </Button>
                      ))}
                  </div>
                </div>

                <Button onClick={resetDemo} variant="outline" className="w-full">
                  Reset Visualization
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Topic Detail Modal */}
        <GitTopicModal 
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          topicId={selectedTopic}
        />
      </div>
    </section>
  );
};