import React, { useState, useRef } from 'react';
import { GitBranch, GitMerge, Plus, ArrowRight, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface Branch {
  name: string;
  commits: { id: string; message: string; position: [number, number, number] }[];
  color: string;
  active: boolean;
}

function BranchVisualization({ branches }: { branches: Branch[] }) {
  return (
    <div className="h-64 w-full bg-black/20 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        {branches.map((branch, branchIdx) => (
          <group key={branch.name}>
            {/* Branch commits */}
            {branch.commits.map((commit, commitIdx) => (
              <mesh key={commit.id} position={commit.position}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial 
                  color={branch.color}
                  emissive={branch.active ? branch.color : '#000000'}
                  emissiveIntensity={branch.active ? 0.2 : 0}
                />
              </mesh>
            ))}
            
            {/* Branch lines */}
            {branch.commits.length > 1 && branch.commits.map((commit, idx) => {
              if (idx === branch.commits.length - 1) return null;
              const start = commit.position;
              const end = branch.commits[idx + 1].position;
              const midpoint = [
                (start[0] + end[0]) / 2,
                (start[1] + end[1]) / 2,
                (start[2] + end[2]) / 2
              ] as [number, number, number];
              
              return (
                <mesh key={`line-${idx}`} position={midpoint}>
                  <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
                  <meshStandardMaterial color={branch.color} />
                </mesh>
              );
            })}
          </group>
        ))}
        
        <OrbitControls enableZoom={true} enablePan={false} />
      </Canvas>
    </div>
  );
}

export const GitBranching: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([
    {
      name: 'main',
      commits: [
        { id: 'c1', message: 'Initial commit', position: [-2, 0, 0] },
        { id: 'c2', message: 'Add README', position: [-1, 0, 0] },
      ],
      color: '#0099CC',
      active: true
    }
  ]);
  const [currentBranch, setCurrentBranch] = useState('main');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);

  const addCommand = (cmd: string, output: string) => {
    setCommandHistory(prev => [...prev, `$ ${cmd}`, output]);
  };

  const createBranch = (branchName: string) => {
    const activeBranch = branches.find(b => b.name === currentBranch);
    if (!activeBranch || branches.some(b => b.name === branchName)) return;

    const lastCommit = activeBranch.commits[activeBranch.commits.length - 1];
    const newBranch: Branch = {
      name: branchName,
      commits: [{ 
        id: `${branchName}-start`, 
        message: `Branch point from ${currentBranch}`, 
        position: [lastCommit.position[0], lastCommit.position[1] + 1, lastCommit.position[2]] 
      }],
      color: branchName === 'feature' ? '#00FF7F' : '#FF6600',
      active: false
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
        const newCommit = {
          id: `${branch.name}-${Date.now()}`,
          message,
          position: [
            lastCommit.position[0] + 1,
            lastCommit.position[1],
            lastCommit.position[2]
          ] as [number, number, number]
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

    const mergeCommit = {
      id: `merge-${Date.now()}`,
      message: `Merge branch '${sourceBranch}' into ${currentBranch}`,
      position: [
        target.commits[target.commits.length - 1].position[0] + 1,
        target.commits[target.commits.length - 1].position[1],
        target.commits[target.commits.length - 1].position[2]
      ] as [number, number, number]
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
          { id: 'c1', message: 'Initial commit', position: [-2, 0, 0] },
          { id: 'c2', message: 'Add README', position: [-1, 0, 0] },
        ],
        color: '#0099CC',
        active: true
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
            Interactive Branching & Merging
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Visualize <span className="text-gradient-primary">Git Branches</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how branches and merges work with live 3D visualization
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 3D Visualization */}
          <Card className="card-glow glow-blue">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GitBranch className="w-5 h-5" />
                <span>3D Branch Visualization</span>
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
              <div className="bg-black rounded-lg p-4 font-mono text-sm max-h-32 overflow-y-auto">
                {commandHistory.map((line, idx) => (
                  <div key={idx} className={line.startsWith('$') ? 'text-green-400' : 'text-gray-300'}>
                    {line}
                  </div>
                ))}
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

        {/* Concept Explanation */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {[
            {
              icon: GitBranch,
              title: "Branching",
              description: "Create parallel development paths for features or experiments",
              color: "electric-blue"
            },
            {
              icon: GitMerge,
              title: "Merging",
              description: "Combine changes from different branches back together",
              color: "neon-green"
            },
            {
              icon: ArrowRight,
              title: "Workflow",
              description: "Organize team collaboration with feature branches",
              color: "warm-orange"
            }
          ].map((concept, idx) => {
            const Icon = concept.icon;
            return (
              <Card key={idx} className="card-glow group hover:scale-105 transition-transform">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-xl bg-surface-elevated mx-auto mb-4 flex items-center justify-center glow-${concept.color === 'electric-blue' ? 'blue' : concept.color === 'neon-green' ? 'green' : 'orange'}`}>
                    <Icon className={`w-8 h-8 text-${concept.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{concept.title}</h3>
                  <p className="text-muted-foreground">{concept.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};