import React, { useState } from 'react';
import { Zap, RotateCcw, Cherry, Archive, Settings, Upload, Download, RefreshCw, Globe, Terminal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Commit {
  id: string;
  message: string;
  author: string;
  date: string;
  hash: string;
}

interface StashEntry {
  id: string;
  message: string;
  branch: string;
  files: string[];
}

export const GitAdvanced: React.FC = () => {
  const [commits, setCommits] = useState<Commit[]>([
    { id: '1', message: 'Initial commit', author: 'You', date: '2024-01-01', hash: 'abc1234' },
    { id: '2', message: 'Add feature A', author: 'You', date: '2024-01-02', hash: 'def5678' },
    { id: '3', message: 'Fix typo', author: 'You', date: '2024-01-03', hash: 'ghi9012' },
    { id: '4', message: 'Add feature B', author: 'You', date: '2024-01-04', hash: 'jkl3456' },
    { id: '5', message: 'Update README', author: 'You', date: '2024-01-05', hash: 'mno7890' },
  ]);

  const [stash, setStash] = useState<StashEntry[]>([]);
  const [rebaseResult, setRebaseResult] = useState<Commit[]>([]);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [workingChanges, setWorkingChanges] = useState(['index.html', 'style.css']);
  const [localCommits, setLocalCommits] = useState(2);
  const [remoteCommits, setRemoteCommits] = useState(3);
  const [hasUnpushedChanges, setHasUnpushedChanges] = useState(true);
  const [hasUnpulledChanges, setHasUnpulledChanges] = useState(true);

  const addOutput = (command: string, output: string) => {
    setTerminalOutput(prev => [...prev, `$ ${command}`, output]);
  };

  const performRebase = (targetCommit: string) => {
    const targetIndex = commits.findIndex(c => c.hash === targetCommit);
    if (targetIndex === -1) return;

    const rebasedCommits = commits.slice(targetIndex + 1).map((commit, idx) => ({
      ...commit,
      hash: `reb${Math.random().toString(36).substr(2, 6)}`,
      id: `rebased-${idx}`
    }));

    setRebaseResult([...commits.slice(0, targetIndex + 1), ...rebasedCommits]);
    addOutput(
      `git rebase ${targetCommit}`,
      `Successfully rebased ${rebasedCommits.length} commits onto ${targetCommit}`
    );
  };

  const cherryPick = (commitHash: string) => {
    const commit = commits.find(c => c.hash === commitHash);
    if (!commit) return;

    const newCommit = {
      ...commit,
      id: `cherry-${Date.now()}`,
      hash: `chr${Math.random().toString(36).substr(2, 6)}`,
      message: `${commit.message} (cherry-picked)`
    };

    setCommits(prev => [...prev, newCommit]);
    addOutput(
      `git cherry-pick ${commitHash}`,
      `[main ${newCommit.hash}] ${newCommit.message}`
    );
  };

  const stashChanges = (message: string = 'WIP: work in progress') => {
    if (workingChanges.length === 0) return;

    const newStash: StashEntry = {
      id: `stash-${Date.now()}`,
      message,
      branch: 'main',
      files: [...workingChanges]
    };

    setStash(prev => [newStash, ...prev]);
    setWorkingChanges([]);
    addOutput(
      `git stash push -m "${message}"`,
      `Saved working directory and index state On main: ${message}`
    );
  };

  const applyStash = (stashId: string) => {
    const stashEntry = stash.find(s => s.id === stashId);
    if (!stashEntry) return;

    setWorkingChanges(prev => [...prev, ...stashEntry.files]);
    setStash(prev => prev.filter(s => s.id !== stashId));
    addOutput(
      `git stash apply stash@{0}`,
      `On branch main: ${stashEntry.message}\nChanges applied successfully`
    );
  };

  const performPush = () => {
    if (localCommits > 0) {
      setLocalCommits(0);
      setHasUnpushedChanges(false);
      addOutput(
        'git push origin main',
        `Enumerating objects: ${localCommits * 3}, done.\nCounting objects: 100% (${localCommits * 3}/${localCommits * 3}), done.\nWriting objects: 100% (${localCommits}/${localCommits}), done.\nTotal ${localCommits} (delta 0), reused 0 (delta 0)\nTo https://github.com/riresearchlab/git\n   abc1234..def5678  main -> main`
      );
    } else {
      addOutput('git push origin main', 'Everything up-to-date');
    }
  };

  const performPull = () => {
    if (remoteCommits > 0) {
      setRemoteCommits(0);
      setHasUnpulledChanges(false);
      setCommits(prev => [
        ...prev,
        { id: 'remote-1', message: 'Update documentation', author: 'Collaborator', date: '2024-01-06', hash: 'xyz1234' },
        { id: 'remote-2', message: 'Fix merge conflict', author: 'Collaborator', date: '2024-01-07', hash: 'xyz5678' }
      ]);
      addOutput(
        'git pull origin main',
        `remote: Enumerating objects: ${remoteCommits * 2}, done.\nremote: Counting objects: 100% (${remoteCommits * 2}/${remoteCommits * 2}), done.\nremote: Compressing objects: 100% (${remoteCommits}/${remoteCommits}), done.\nremote: Total ${remoteCommits} (delta 1), reused ${remoteCommits} (delta 1)\nUnpacking objects: 100% (${remoteCommits}/${remoteCommits}), done.\nFrom https://github.com/riresearchlab/git\n * branch            main       -> FETCH_HEAD\n   def5678..xyz5678  main       -> origin/main\nUpdating def5678..xyz5678\nFast-forward\n README.md | 2 ++\n 1 file changed, 2 insertions(+)`
      );
    } else {
      addOutput('git pull origin main', 'Already up to date.');
    }
  };

  const resetDemo = () => {
    setCommits([
      { id: '1', message: 'Initial commit', author: 'You', date: '2024-01-01', hash: 'abc1234' },
      { id: '2', message: 'Add feature A', author: 'You', date: '2024-01-02', hash: 'def5678' },
      { id: '3', message: 'Fix typo', author: 'You', date: '2024-01-03', hash: 'ghi9012' },
      { id: '4', message: 'Add feature B', author: 'You', date: '2024-01-04', hash: 'jkl3456' },
      { id: '5', message: 'Update README', author: 'You', date: '2024-01-05', hash: 'mno7890' },
    ]);
    setStash([]);
    setRebaseResult([]);
    setTerminalOutput([]);
    setWorkingChanges(['index.html', 'style.css']);
    setLocalCommits(2);
    setRemoteCommits(3);
    setHasUnpushedChanges(true);
    setHasUnpulledChanges(true);
  };

  return (
    <section id="git-advanced" className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            <Zap className="w-4 h-4 mr-2" />
            Advanced Git Techniques
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Master <span className="text-gradient-primary">Advanced Git</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Interactive demonstrations of rebase, cherry-pick, stash, and more advanced Git operations
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Terminal Output */}
          <Card className="card-glow glow-blue lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Terminal</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-black rounded-lg p-4 font-mono text-sm max-h-64 overflow-y-auto">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                {terminalOutput.map((line, idx) => (
                  <div key={idx} className={line.startsWith('$') ? 'text-green-400' : 'text-gray-300'}>
                    {line}
                  </div>
                ))}
                <div className="text-green-400">
                  $ <span className="animate-pulse">_</span>
                </div>
              </div>
              <Button onClick={resetDemo} variant="outline" className="w-full mt-4">
                Reset Demo
              </Button>
            </CardContent>
          </Card>

          {/* Interactive Operations */}
          <Card className="card-glow glow-green lg:col-span-2">
            <CardHeader>
              <CardTitle>Advanced Operations</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="remote" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="remote">Push/Pull</TabsTrigger>
                  <TabsTrigger value="rebase">Rebase</TabsTrigger>
                  <TabsTrigger value="cherry-pick">Cherry Pick</TabsTrigger>
                  <TabsTrigger value="stash">Stash</TabsTrigger>
                  <TabsTrigger value="reset">Reset</TabsTrigger>
                </TabsList>

                <TabsContent value="remote" className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Remote Operations</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Synchronize your local repository with remote GitHub repository
                    </p>
                    
                    {/* Remote Status Visualization */}
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <Card className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-medium flex items-center space-x-2">
                            <Terminal className="w-4 h-4" />
                            <span>Local Repository</span>
                          </h5>
                          <Badge variant={hasUnpushedChanges ? "destructive" : "secondary"}>
                            {localCommits} unpushed commits
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
                            git push origin main
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
                            {remoteCommits} unpulled commits
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
                            git pull origin main
                          </Button>
                        </div>
                      </Card>
                    </div>

                    {/* Sync Status */}
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
                  </div>
                </TabsContent>

                <TabsContent value="rebase" className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Interactive Rebase</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Rewrite commit history by moving commits to a new base
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="text-sm font-medium">Commit History:</div>
                      {commits.slice().reverse().map((commit) => (
                        <div key={commit.id} className="flex items-center justify-between p-2 bg-surface-elevated rounded">
                          <div className="flex items-center space-x-2">
                            <code className="text-xs bg-primary/20 px-2 py-1 rounded">{commit.hash}</code>
                            <span className="text-sm">{commit.message}</span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => performRebase(commit.hash)}
                            className="text-xs"
                          >
                            Rebase onto this
                          </Button>
                        </div>
                      ))}
                    </div>

                    {rebaseResult.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Rebased Result:</div>
                        {rebaseResult.slice().reverse().map((commit) => (
                          <div key={commit.id} className="flex items-center space-x-2 p-2 bg-accent/20 rounded">
                            <code className="text-xs bg-accent/30 px-2 py-1 rounded">{commit.hash}</code>
                            <span className="text-sm">{commit.message}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="cherry-pick" className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Cherry Pick Commits</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Apply specific commits from other branches
                    </p>
                    
                    <div className="grid gap-2">
                      {commits.map((commit) => (
                        <div key={commit.id} className="flex items-center justify-between p-2 bg-surface-elevated rounded">
                          <div className="flex items-center space-x-2">
                            <Cherry className="w-4 h-4 text-red-400" />
                            <code className="text-xs bg-primary/20 px-2 py-1 rounded">{commit.hash}</code>
                            <span className="text-sm">{commit.message}</span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => cherryPick(commit.hash)}
                            className="text-xs"
                          >
                            Cherry Pick
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="stash" className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Working Directory</h4>
                      <div className="space-y-2">
                        {workingChanges.length > 0 ? (
                          <>
                            {workingChanges.map((file, idx) => (
                              <div key={idx} className="flex items-center space-x-2 p-2 bg-yellow-500/20 rounded">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                <span className="text-sm">{file}</span>
                                <Badge variant="outline" className="text-xs">modified</Badge>
                              </div>
                            ))}
                            <Button
                              onClick={() => stashChanges()}
                              className="w-full text-sm"
                            >
                              <Archive className="w-4 h-4 mr-2" />
                              Stash Changes
                            </Button>
                          </>
                        ) : (
                          <p className="text-muted-foreground text-sm">No changes in working directory</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Stash Entries</h4>
                      <div className="space-y-2">
                        {stash.length > 0 ? (
                          stash.map((entry, idx) => (
                            <div key={entry.id} className="p-2 bg-surface-elevated rounded">
                              <div className="flex items-center justify-between mb-1">
                                <code className="text-xs">stash@{idx}</code>
                                <Button
                                  size="sm"
                                  onClick={() => applyStash(entry.id)}
                                  className="text-xs"
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
                </TabsContent>

                <TabsContent value="reset" className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Git Reset Operations</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Reset your repository to a specific state
                    </p>
                    
                    <div className="grid gap-3">
                      {['--soft', '--mixed', '--hard'].map((mode) => (
                        <Card key={mode} className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium">git reset {mode}</h5>
                              <p className="text-sm text-muted-foreground">
                                {mode === '--soft' && 'Keep changes in staging area'}
                                {mode === '--mixed' && 'Keep changes in working directory'}
                                {mode === '--hard' && 'Discard all changes (destructive)'}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addOutput(`git reset ${mode} HEAD~1`, `HEAD is now at ${commits[commits.length - 2]?.hash} ${commits[commits.length - 2]?.message}`)}
                            >
                              <RotateCcw className="w-4 h-4 mr-1" />
                              Reset
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Concept Cards */}
        <div className="grid md:grid-cols-6 gap-6 mt-12">
          {[
            {
              icon: Upload,
              title: "Git Push",
              description: "Upload local commits to remote repository",
              color: "electric-blue"
            },
            {
              icon: Download,
              title: "Git Pull",
              description: "Download and merge remote changes",
              color: "neon-green"
            },
            {
              icon: RotateCcw,
              title: "Rebase",
              description: "Rewrite commit history for cleaner timeline",
              color: "warm-orange"
            },
            {
              icon: Cherry,
              title: "Cherry Pick",
              description: "Apply specific commits to current branch",
              color: "electric-blue"
            },
            {
              icon: Archive,
              title: "Stash",
              description: "Temporarily save changes without committing",
              color: "neon-green"
            },
            {
              icon: Settings,
              title: "Reset",
              description: "Move HEAD and branch pointer to specific commit",
              color: "warm-orange"
            }
          ].map((concept, idx) => {
            const Icon = concept.icon;
            return (
              <Card key={idx} className="card-glow group hover:scale-105 transition-transform">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 rounded-xl bg-surface-elevated mx-auto mb-4 flex items-center justify-center glow-${concept.color === 'electric-blue' ? 'blue' : concept.color === 'neon-green' ? 'green' : 'orange'}`}>
                    <Icon className={`w-6 h-6 text-${concept.color}`} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{concept.title}</h3>
                  <p className="text-sm text-muted-foreground">{concept.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};