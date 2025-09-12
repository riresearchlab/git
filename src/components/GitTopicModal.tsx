import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Code, Terminal, FileText, GitBranch, GitMerge, ArrowRight, Settings, Download, FolderOpen, Plus, Upload, RefreshCw } from 'lucide-react';

interface GitTopicData {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  description: string;
  color: string;
  keyCommands: Array<{
    command: string;
    description: string;
    example?: string;
    output?: string;
  }>;
  examples: Array<{
    title: string;
    description: string;
    code: string;
    output?: string;
  }>;
  useCases: string[];
  tips: string[];
}

interface GitTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicId: string | null;
}

const gitTopicsData: Record<string, GitTopicData> = {
  config: {
    id: 'config',
    title: 'Git Config',
    icon: Settings,
    description: 'Set up your Git identity and preferences. Configuration determines how Git behaves and identifies your commits.',
    color: 'electric-blue',
    keyCommands: [
      {
        command: 'git config --global user.name "Your Name"',
        description: 'Set your username globally',
        example: 'git config --global user.name "John Doe"',
        output: 'Username configured globally'
      },
      {
        command: 'git config --global user.email "you@example.com"',
        description: 'Set your email globally',
        example: 'git config --global user.email "john@example.com"',
        output: 'Email configured globally'
      },
      {
        command: 'git config --list',
        description: 'View all configuration settings',
        example: 'git config --list',
        output: 'user.name=John Doe\nuser.email=john@example.com\ncore.editor=vim'
      }
    ],
    examples: [
      {
        title: 'Initial Git Setup',
        description: 'Configure Git for first-time use',
        code: `# Set your identity
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set default editor
git config --global core.editor "code --wait"

# Set default branch name
git config --global init.defaultBranch main`,
        output: 'Git configured successfully'
      }
    ],
    useCases: [
      'Setting up Git on a new machine',
      'Configuring user identity for commits',
      'Setting preferred text editor',
      'Configuring aliases for common commands'
    ],
    tips: [
      'Use --global flag for settings that apply to all repositories',
      'Use --local flag for repository-specific settings',
      'Check your config with git config --list'
    ]
  },
  clone: {
    id: 'clone',
    title: 'Git Clone',
    icon: Download,
    description: 'Download repository from remote server. Cloning creates a local copy of a remote repository.',
    color: 'neon-green',
    keyCommands: [
      {
        command: 'git clone <url>',
        description: 'Clone a repository from URL',
        example: 'git clone https://github.com/user/repo.git',
        output: 'Cloning into \'repo\'...\nremote: Counting objects: 100, done.'
      },
      {
        command: 'git clone <url> <directory>',
        description: 'Clone into specific directory',
        example: 'git clone https://github.com/user/repo.git my-project',
        output: 'Repository cloned into my-project directory'
      }
    ],
    examples: [
      {
        title: 'Clone Public Repository',
        description: 'Download a public repository from GitHub',
        code: `# Clone repository
git clone https://github.com/facebook/react.git

# Navigate to project
cd react

# Check remote origin
git remote -v`,
        output: 'Repository cloned successfully'
      }
    ],
    useCases: [
      'Starting work on existing project',
      'Contributing to open source projects',
      'Creating local backup of repository',
      'Setting up development environment'
    ],
    tips: [
      'Use SSH URLs for repositories you have write access to',
      'Clone with --depth 1 for shallow clone to save space',
      'Check the repository structure after cloning'
    ]
  },
  staging: {
    id: 'staging',
    title: 'Staging Area',
    icon: Plus,
    description: 'Prepared changes ready for commit. The staging area lets you review and organize changes before committing.',
    color: 'warm-orange',
    keyCommands: [
      {
        command: 'git add <file>',
        description: 'Add specific file to staging area',
        example: 'git add index.html',
        output: 'File added to staging area'
      },
      {
        command: 'git add .',
        description: 'Add all changed files to staging area',
        example: 'git add .',
        output: 'All changes added to staging area'
      },
      {
        command: 'git status',
        description: 'View staged and unstaged changes',
        example: 'git status',
        output: 'Changes to be committed:\n  modified: index.html'
      }
    ],
    examples: [
      {
        title: 'Selective Staging',
        description: 'Stage only specific changes for commit',
        code: `# Check what changed
git status

# Add specific files
git add src/components/Header.js
git add styles/main.css

# Review staged changes
git status

# Commit staged changes
git commit -m "Update header component and styles"`,
        output: 'Selective changes committed'
      }
    ],
    useCases: [
      'Reviewing changes before committing',
      'Creating focused, logical commits',
      'Excluding temporary or debug files',
      'Organizing changes into separate commits'
    ],
    tips: [
      'Use git add -p for interactive staging',
      'Review staged changes with git diff --cached',
      'Unstage files with git reset HEAD <file>'
    ]
  },
  push: {
    id: 'push',
    title: 'Git Push',
    icon: Upload,
    description: 'Upload local commits to remote repository. Push shares your changes with others and updates the remote repository.',
    color: 'electric-blue',
    keyCommands: [
      {
        command: 'git push',
        description: 'Push current branch to its upstream',
        example: 'git push',
        output: 'Counting objects: 3, done.\nTo origin/main'
      },
      {
        command: 'git push origin <branch>',
        description: 'Push specific branch to origin',
        example: 'git push origin feature/login',
        output: 'Branch pushed to origin successfully'
      },
      {
        command: 'git push -u origin <branch>',
        description: 'Push and set upstream tracking',
        example: 'git push -u origin main',
        output: 'Branch main set up to track remote origin/main'
      }
    ],
    examples: [
      {
        title: 'First Push to Remote',
        description: 'Push local repository to remote for first time',
        code: `# Add remote origin
git remote add origin https://github.com/user/repo.git

# Push and set upstream
git push -u origin main

# Future pushes can use just
git push`,
        output: 'Repository pushed to remote successfully'
      }
    ],
    useCases: [
      'Sharing code with team members',
      'Backing up work to remote server',
      'Deploying code to production',
      'Contributing to collaborative projects'
    ],
    tips: [
      'Always pull before pushing to avoid conflicts',
      'Use meaningful commit messages before pushing',
      'Push frequently to avoid losing work'
    ]
  },
  pull: {
    id: 'pull',
    title: 'Git Pull',
    icon: Download,
    description: 'Download and merge remote changes. Pull fetches changes from remote repository and merges them into current branch.',
    color: 'neon-green',
    keyCommands: [
      {
        command: 'git pull',
        description: 'Fetch and merge from upstream branch',
        example: 'git pull',
        output: 'Updating abc1234..def5678\nFast-forward'
      },
      {
        command: 'git pull origin <branch>',
        description: 'Pull specific branch from origin',
        example: 'git pull origin main',
        output: 'From origin\n* branch main -> FETCH_HEAD'
      }
    ],
    examples: [
      {
        title: 'Sync with Remote Changes',
        description: 'Get latest changes from team members',
        code: `# Check current status
git status

# Pull latest changes
git pull origin main

# Resolve any merge conflicts if needed
# Continue working with updated code`,
        output: 'Local branch updated with remote changes'
      }
    ],
    useCases: [
      'Getting latest changes from team',
      'Syncing before starting new work',
      'Updating local branch with remote changes',
      'Collaborative development workflow'
    ],
    tips: [
      'Pull before starting new features',
      'Use git pull --rebase for cleaner history',
      'Stash local changes if pull conflicts occur'
    ]
  },
  stash: {
    id: 'stash',
    title: 'Git Stash',
    icon: FolderOpen,
    description: 'Temporarily save changes without committing. Stash lets you quickly switch contexts while preserving work in progress.',
    color: 'warm-orange',
    keyCommands: [
      {
        command: 'git stash',
        description: 'Save current changes to stash',
        example: 'git stash',
        output: 'Saved working directory and index state'
      },
      {
        command: 'git stash pop',
        description: 'Apply and remove latest stash',
        example: 'git stash pop',
        output: 'On branch main: Changes not staged for commit'
      },
      {
        command: 'git stash list',
        description: 'View all stashes',
        example: 'git stash list',
        output: 'stash@{0}: WIP on main: abc1234 Add feature'
      }
    ],
    examples: [
      {
        title: 'Quick Context Switch',
        description: 'Save work to handle urgent bug fix',
        code: `# Working on feature, need to switch to fix bug
git stash push -m "WIP: user authentication feature"

# Switch to main and fix bug
git checkout main
git checkout -b hotfix/critical-bug

# After fixing bug, return to feature work
git checkout feature/auth
git stash pop`,
        output: 'Work preserved and restored successfully'
      }
    ],
    useCases: [
      'Switching branches with uncommitted changes',
      'Handling urgent interruptions',
      'Experimenting without losing current work',
      'Cleaning working directory temporarily'
    ],
    tips: [
      'Use descriptive messages with git stash push -m',
      'Apply specific stash with git stash apply stash@{n}',
      'Clear old stashes regularly with git stash clear'
    ]
  },
  branching: {
    id: 'branching',
    title: 'Git Branching',
    icon: GitBranch,
    description: 'Create parallel development paths for features or experiments. Branches allow you to work on different features simultaneously without affecting the main codebase.',
    color: 'electric-blue',
    keyCommands: [
      {
        command: 'git branch',
        description: 'List all branches in your repository',
        example: 'git branch',
        output: '  feature/login\n* main\n  develop'
      },
      {
        command: 'git checkout -b <branch-name>',
        description: 'Create and switch to a new branch',
        example: 'git checkout -b feature/user-auth',
        output: 'Switched to a new branch \'feature/user-auth\''
      },
      {
        command: 'git checkout <branch-name>',
        description: 'Switch to an existing branch',
        example: 'git checkout main',
        output: 'Switched to branch \'main\''
      },
      {
        command: 'git branch -d <branch-name>',
        description: 'Delete a branch (safe delete)',
        example: 'git branch -d feature/completed',
        output: 'Deleted branch feature/completed'
      }
    ],
    examples: [
      {
        title: 'Feature Branch Workflow',
        description: 'Create a branch for a new feature, work on it, then merge back',
        code: `# Create and switch to feature branch
git checkout -b feature/shopping-cart

# Make your changes and commit
git add .
git commit -m "Add shopping cart functionality"

# Switch back to main and merge
git checkout main
git merge feature/shopping-cart`,
        output: 'Feature successfully merged into main branch'
      },
      {
        title: 'Hotfix Branch',
        description: 'Quickly fix critical bugs in production',
        code: `# Create hotfix branch from main
git checkout -b hotfix/critical-bug main

# Fix the bug and commit
git add .
git commit -m "Fix critical security vulnerability"

# Merge into main and develop
git checkout main
git merge hotfix/critical-bug`,
        output: 'Hotfix applied to production'
      }
    ],
    useCases: [
      'Developing new features in isolation',
      'Experimenting with different implementations',
      'Creating hotfixes for production bugs',
      'Collaborative development without conflicts',
      'Code reviews through pull requests'
    ],
    tips: [
      'Use descriptive branch names like feature/user-login or bugfix/header-style',
      'Keep branches focused on single features or fixes',
      'Regularly sync with main branch to avoid conflicts',
      'Delete merged branches to keep repository clean'
    ]
  },
  merging: {
    id: 'merging',
    title: 'Git Merging',
    icon: GitMerge,
    description: 'Combine changes from different branches back together. Merging integrates the changes from one branch into another, typically into the main branch.',
    color: 'neon-green',
    keyCommands: [
      {
        command: 'git merge <branch-name>',
        description: 'Merge specified branch into current branch',
        example: 'git merge feature/login',
        output: 'Merge made by the \'recursive\' strategy.'
      },
      {
        command: 'git merge --no-ff <branch-name>',
        description: 'Force create a merge commit even for fast-forward merges',
        example: 'git merge --no-ff feature/api',
        output: 'Merge commit created'
      },
      {
        command: 'git merge --squash <branch-name>',
        description: 'Combine all commits from branch into single commit',
        example: 'git merge --squash feature/cleanup',
        output: 'Squash commit created'
      }
    ],
    examples: [
      {
        title: 'Fast-Forward Merge',
        description: 'When target branch has no new commits since branch creation',
        code: `# On main branch
git checkout main

# Merge feature branch (fast-forward)
git merge feature/header-fix`,
        output: 'Fast-forward merge completed'
      },
      {
        title: 'Three-Way Merge',
        description: 'When both branches have new commits',
        code: `# On main branch with new commits
git checkout main

# Merge feature branch (creates merge commit)
git merge feature/new-component`,
        output: 'Merge commit abc1234 created'
      },
      {
        title: 'Resolving Merge Conflicts',
        description: 'Handle conflicts when same lines are modified',
        code: `# Merge with conflicts
git merge feature/conflicting-changes

# Edit conflicted files, then:
git add .
git commit -m "Resolve merge conflicts"`,
        output: 'Merge conflicts resolved successfully'
      }
    ],
    useCases: [
      'Integrating completed features into main branch',
      'Combining multiple developer contributions',
      'Creating release branches from development',
      'Applying hotfixes to multiple branches',
      'Maintaining clean project history'
    ],
    tips: [
      'Always test merged code before pushing to production',
      'Use --no-ff for important feature merges to preserve history',
      'Resolve conflicts carefully, understanding both changes',
      'Consider using rebase for cleaner history in some cases'
    ]
  },
  workflow: {
    id: 'workflow',
    title: 'Git Workflow',
    icon: ArrowRight,
    description: 'Organize team collaboration with structured branching strategies. Workflows define how teams use branches to coordinate development and releases.',
    color: 'warm-orange',
    keyCommands: [
      {
        command: 'git flow init',
        description: 'Initialize Git Flow in repository',
        example: 'git flow init',
        output: 'Git Flow initialized'
      },
      {
        command: 'git flow feature start <name>',
        description: 'Start a new feature branch',
        example: 'git flow feature start user-dashboard',
        output: 'Feature branch created and switched to'
      },
      {
        command: 'git flow feature finish <name>',
        description: 'Finish and merge feature branch',
        example: 'git flow feature finish user-dashboard',
        output: 'Feature merged and branch deleted'
      }
    ],
    examples: [
      {
        title: 'GitHub Flow',
        description: 'Simple workflow with main branch and feature branches',
        code: `# Create feature branch
git checkout -b feature/new-api

# Work and commit changes
git add .
git commit -m "Implement new API endpoint"

# Push and create pull request
git push origin feature/new-api

# After review, merge via GitHub
# Delete feature branch`,
        output: 'Pull request merged successfully'
      },
      {
        title: 'Git Flow',
        description: 'Structured workflow with develop, feature, release, and hotfix branches',
        code: `# Start new feature
git flow feature start user-profile

# Develop feature
git add .
git commit -m "Add user profile component"

# Finish feature (merges to develop)
git flow feature finish user-profile

# Create release branch
git flow release start v1.2.0`,
        output: 'Release branch created for v1.2.0'
      }
    ],
    useCases: [
      'Coordinating work across multiple developers',
      'Managing releases and hotfixes systematically',
      'Ensuring code quality through reviews',
      'Maintaining stable main/production branch',
      'Organizing features for upcoming releases'
    ],
    tips: [
      'Choose workflow that fits your team size and release cycle',
      'Establish clear naming conventions for branches',
      'Use pull/merge requests for code review',
      'Automate testing and deployment where possible',
      'Document your workflow for new team members'
    ]
  }
};

export const GitTopicModal: React.FC<GitTopicModalProps> = ({ isOpen, onClose, topicId }) => {
  if (!topicId || !gitTopicsData[topicId]) return null;

  const topic = gitTopicsData[topicId];
  const Icon = topic.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3 text-2xl">
            <div className={`w-10 h-10 rounded-xl bg-surface-elevated flex items-center justify-center glow-${topic.color === 'electric-blue' ? 'blue' : topic.color === 'neon-green' ? 'green' : 'orange'}`}>
              <Icon className={`w-6 h-6 text-${topic.color}`} />
            </div>
            <span>{topic.title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          <div>
            <p className="text-muted-foreground text-lg leading-relaxed">{topic.description}</p>
          </div>

          <Separator />

          {/* Key Commands */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Terminal className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-semibold">Key Commands</h3>
            </div>
            <div className="grid gap-4">
              {topic.keyCommands.map((cmd, idx) => (
                <div key={idx} className="bg-surface-elevated p-4 rounded-lg border">
                  <div className="flex items-start justify-between mb-2">
                    <code className="text-primary font-mono bg-background px-2 py-1 rounded text-sm">
                      {cmd.command}
                    </code>
                  </div>
                  <p className="text-muted-foreground mb-3">{cmd.description}</p>
                  {cmd.example && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Example:</div>
                      <div className="bg-black p-3 rounded font-mono text-sm">
                        <div className="text-green-400">$ {cmd.example}</div>
                        {cmd.output && <div className="text-gray-300 mt-1">{cmd.output}</div>}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Examples */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Code className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-semibold">Practical Examples</h3>
            </div>
            <div className="grid gap-4">
              {topic.examples.map((example, idx) => (
                <div key={idx} className="bg-surface-elevated p-4 rounded-lg border">
                  <h4 className="font-semibold mb-2">{example.title}</h4>
                  <p className="text-muted-foreground mb-3">{example.description}</p>
                  <div className="bg-black p-4 rounded font-mono text-sm overflow-x-auto">
                    <pre className="text-gray-300 whitespace-pre-wrap">{example.code}</pre>
                    {example.output && (
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <div className="text-green-400 text-xs mb-1">Output:</div>
                        <div className="text-gray-400">{example.output}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Use Cases */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-semibold">Common Use Cases</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {topic.useCases.map((useCase, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground">{useCase}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Tips */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Badge variant="secondary" className="px-3 py-1">
                💡 Pro Tips
              </Badge>
            </div>
            <div className="space-y-2">
              {topic.tips.map((tip, idx) => (
                <div key={idx} className="bg-primary/5 border border-primary/20 p-3 rounded-lg">
                  <p className="text-sm">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};