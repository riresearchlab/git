import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Code, Terminal, FileText, GitBranch, GitMerge, ArrowRight, Settings, Download, FolderOpen, Plus, Upload, RefreshCw, RotateCcw, Cherry, Archive, Cloud, Tag } from 'lucide-react';

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
        output: 'Updating d6d822b..cbc5e4c\nFast-forward'
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
        output: 'stash@{0}: WIP on main: d6d822b Add feature'
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
        output: 'Merge commit d6d822b created'
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
  'working-directory': {
    id: 'working-directory',
    title: 'Working Directory',
    icon: Terminal,
    description: 'Your project files where you make changes. The working directory contains all your project files and is where you edit, create, and delete files.',
    color: 'warm-orange',
    keyCommands: [
      {
        command: 'git status',
        description: 'Check the status of files in working directory',
        example: 'git status',
        output: 'On branch main\nChanges not staged for commit:\n  modified: README.md'
      },
      {
        command: 'git diff',
        description: 'See changes in working directory',
        example: 'git diff',
        output: 'Shows line-by-line differences between working directory and staging area'
      },
      {
        command: 'git checkout -- <file>',
        description: 'Discard changes in working directory',
        example: 'git checkout -- README.md',
        output: 'Changes to README.md discarded'
      }
    ],
    examples: [
      {
        title: 'Check Working Directory Status',
        description: 'See what files have been modified',
        code: `# Check status of all files
git status

# See specific changes
git diff README.md

# Add changes to staging area
git add README.md`,
        output: 'Working directory changes tracked and staged'
      }
    ],
    useCases: [
      'Making changes to project files',
      'Creating new features or fixing bugs',
      'Experimenting with code modifications',
      'Reviewing changes before committing'
    ],
    tips: [
      'Use git status frequently to see what changes you have',
      'Review changes with git diff before staging',
      'Keep working directory clean by committing regularly'
    ]
  },
  'remote-repository': {
    id: 'remote-repository',
    title: 'Remote Repository',
    icon: Cloud,
    description: 'External repository for collaboration. Remote repositories are hosted versions of your project that enable team collaboration and backup.',
    color: 'neon-green',
    keyCommands: [
      {
        command: 'git remote add origin <url>',
        description: 'Add a remote repository',
        example: 'git remote add origin https://github.com/user/repo.git',
        output: 'Remote origin added successfully'
      },
      {
        command: 'git remote -v',
        description: 'List all remote repositories',
        example: 'git remote -v',
        output: 'origin  https://github.com/user/repo.git (fetch)\norigin  https://github.com/user/repo.git (push)'
      },
      {
        command: 'git fetch origin',
        description: 'Download changes from remote without merging',
        example: 'git fetch origin',
        output: 'remote: Counting objects: 5, done.\nremote: Total 5 (delta 0), reused 0 (delta 0)'
      }
    ],
    examples: [
      {
        title: 'Set Up Remote Repository',
        description: 'Connect local repository to GitHub',
        code: `# Add remote origin
git remote add origin https://github.com/username/repository.git

# Verify remote was added
git remote -v

# Push to remote for first time
git push -u origin main`,
        output: 'Local repository connected to GitHub remote'
      }
    ],
    useCases: [
      'Collaborating with team members',
      'Backing up code to cloud platforms',
      'Sharing code with open source community',
      'Deploying applications from repository'
    ],
    tips: [
      'Use SSH keys for secure authentication',
      'Set up multiple remotes for different environments',
      'Regularly fetch from remote to stay updated'
    ]
  },
  rebase: {
    id: 'rebase',
    title: 'Git Rebase',
    icon: RotateCcw,
    description: 'Rewrite commit history for cleaner timeline. Rebase moves or combines commits to create a linear project history.',
    color: 'warm-orange',
    keyCommands: [
      {
        command: 'git rebase <branch>',
        description: 'Rebase current branch onto another branch',
        example: 'git rebase main',
        output: 'Successfully rebased and updated refs/heads/feature.'
      },
      {
        command: 'git rebase -i HEAD~3',
        description: 'Interactive rebase for last 3 commits',
        example: 'git rebase -i HEAD~3',
        output: 'Opens editor to modify commit history'
      },
      {
        command: 'git rebase --continue',
        description: 'Continue rebase after resolving conflicts',
        example: 'git rebase --continue',
        output: 'Rebase continued successfully'
      }
    ],
    examples: [
      {
        title: 'Feature Branch Rebase',
        description: 'Keep feature branch up to date with main',
        code: `# Switch to feature branch
git checkout feature/new-component

# Rebase onto main branch
git rebase main

# If conflicts occur, resolve them and continue
git add .
git rebase --continue`,
        output: 'Feature branch rebased onto latest main'
      },
      {
        title: 'Interactive Rebase',
        description: 'Clean up commit history before merging',
        code: `# Interactive rebase for last 4 commits
git rebase -i HEAD~4

# In editor, you can:
# pick - use commit as is
# squash - combine with previous commit
# reword - change commit message
# drop - remove commit`,
        output: 'Commit history cleaned and reorganized'
      }
    ],
    useCases: [
      'Maintaining linear project history',
      'Cleaning up commits before merging',
      'Moving feature branch to latest main',
      'Combining multiple small commits into logical units'
    ],
    tips: [
      'Never rebase commits that have been pushed and shared',
      'Use interactive rebase to clean up local commits',
      'Resolve conflicts carefully during rebase process'
    ]
  },
  'cherry-pick': {
    id: 'cherry-pick',
    title: 'Git Cherry Pick',
    icon: Cherry,
    description: 'Apply specific commits to current branch. Cherry-pick allows you to select specific commits from other branches and apply them.',
    color: 'electric-blue',
    keyCommands: [
      {
        command: 'git cherry-pick <commit-hash>',
        description: 'Apply specific commit to current branch',
        example: 'git cherry-pick d6d822b',
        output: '[main 5f2b3c4] Fix critical bug (cherry picked from commit d6d822b)'
      },
      {
        command: 'git cherry-pick <hash1> <hash2>',
        description: 'Cherry-pick multiple commits',
        example: 'git cherry-pick d6d822b cbc5e4c',
        output: 'Multiple commits cherry-picked successfully'
      },
      {
        command: 'git cherry-pick --no-commit <hash>',
        description: 'Cherry-pick without creating commit',
        example: 'git cherry-pick --no-commit d6d822b',
        output: 'Changes applied to working directory without commit'
      }
    ],
    examples: [
      {
        title: 'Hotfix Cherry-pick',
        description: 'Apply critical fix to multiple branches',
        code: `# On main branch, create hotfix
git checkout main
git commit -m "Fix security vulnerability" # commit d6d822b

# Apply same fix to release branch
git checkout release/v1.2
git cherry-pick d6d822b

# Apply to development branch
git checkout develop
git cherry-pick d6d822b`,
        output: 'Hotfix applied to all required branches'
      },
      {
        title: 'Feature Extraction',
        description: 'Extract specific feature from experimental branch',
        code: `# Cherry-pick specific feature commits
git checkout main
git cherry-pick commit1 commit2 commit3

# Or cherry-pick range of commits
git cherry-pick commit1^..commit3`,
        output: 'Selected features extracted to main branch'
      }
    ],
    useCases: [
      'Applying hotfixes to multiple branches',
      'Extracting specific features from experimental branches',
      'Backporting fixes to older versions',
      'Selectively merging changes without full branch merge'
    ],
    tips: [
      'Cherry-pick creates new commits with different hashes',
      'Use for small, independent changes',
      'Avoid cherry-picking if full merge is more appropriate'
    ]
  },
  reset: {
    id: 'reset',
    title: 'Git Reset',
    icon: Settings,
    description: 'Move HEAD and branch pointer to specific commit. Reset allows you to undo commits and changes at different levels.',
    color: 'warm-orange',
    keyCommands: [
      {
        command: 'git reset --soft HEAD~1',
        description: 'Reset to previous commit, keep changes staged',
        example: 'git reset --soft HEAD~1',
        output: 'HEAD moved to previous commit, changes remain staged'
      },
      {
        command: 'git reset --mixed HEAD~1',
        description: 'Reset to previous commit, unstage changes',
        example: 'git reset --mixed HEAD~1',
        output: 'HEAD moved, changes moved to working directory'
      },
      {
        command: 'git reset --hard HEAD~1',
        description: 'Reset to previous commit, discard all changes',
        example: 'git reset --hard HEAD~1',
        output: 'HEAD moved, all changes discarded (destructive)'
      }
    ],
    examples: [
      {
        title: 'Undo Last Commit',
        description: 'Remove the most recent commit while keeping changes',
        code: `# Undo commit but keep changes staged
git reset --soft HEAD~1

# Make additional changes
vim file.txt
git add file.txt

# Create new commit with all changes
git commit -m "Improved commit message"`,
        output: 'Last commit undone, changes preserved and recommitted'
      },
      {
        title: 'Unstage Files',
        description: 'Remove files from staging area',
        code: `# Accidentally staged wrong files
git add .

# Unstage specific file
git reset HEAD unwanted-file.txt

# Or unstage all files
git reset HEAD`,
        output: 'Files removed from staging area'
      }
    ],
    useCases: [
      'Undoing recent commits while preserving work',
      'Unstaging accidentally added files',
      'Moving to previous state in project history',
      'Cleaning up commits before pushing'
    ],
    tips: [
      '--soft keeps changes staged, --mixed unstages them, --hard discards them',
      'Be very careful with --hard as it permanently deletes changes',
      'Use git reflog to recover if you reset too far'
    ]
  },
  'git-log': {
    id: 'git-log',
    title: 'Git Log',
    icon: FileText,
    description: 'View commit history and track changes. Git log shows the chronological history of commits, helping you understand project evolution and track changes over time.',
    color: 'warm-orange',
    keyCommands: [
      {
        command: 'git log',
        description: 'Display commit history',
        example: 'git log',
        output: 'commit d6d822b567890...\nAuthor: John Doe <john@example.com>\nDate: Mon Jan 15 10:30:45 2024 +0000\n\n    Add user authentication feature'
      },
      {
        command: 'git log --oneline',
        description: 'Show condensed commit history',
        example: 'git log --oneline',
        output: 'd6d822b Add user authentication feature\ncbc5e4c Fix login bug\n9f15548 Update README'
      },
      {
        command: 'git log --graph',
        description: 'Display commit history as a graph',
        example: 'git log --graph --oneline',
        output: '* d6d822b Add user authentication\n* cbc5e4c Fix login bug\n* 9f15548 Update README'
      },
      {
        command: 'git log -p',
        description: 'Show changes introduced in each commit',
        example: 'git log -p -2',
        output: 'Shows last 2 commits with their diff patches'
      }
    ],
    examples: [
      {
        title: 'Basic Commit History',
        description: 'View the history of your project',
        code: `# View full commit history
git log

# View last 5 commits
git log -5

# View commits in one line each
git log --oneline

# View commits with graph visualization
git log --graph --oneline --all`,
        output: 'Commit history displayed with various formatting options'
      },
      {
        title: 'Filtered Log History',
        description: 'Find specific commits using filters',
        code: `# View commits by specific author
git log --author="John Doe"

# View commits in date range
git log --since="2024-01-01" --until="2024-01-31"

# View commits that modified specific file
git log -- src/components/Header.js

# Search commits by message content
git log --grep="bug fix"`,
        output: 'Filtered commit history based on specified criteria'
      },
      {
        title: 'Advanced Log Formatting',
        description: 'Customize log output format',
        code: `# Custom format showing hash, date, and message
git log --pretty=format:"%h - %ad - %s" --date=short

# Show commit statistics
git log --stat

# Show commits with changed files
git log --name-only

# Show commits between branches
git log main..feature-branch`,
        output: 'Customized log output with specific formatting and information'
      }
    ],
    useCases: [
      'Reviewing project history and evolution',
      'Finding when specific changes were introduced',
      'Tracking contributions by different team members',
      'Debugging by examining recent changes',
      'Creating release notes from commit messages',
      'Understanding code evolution over time'
    ],
    tips: [
      'Use --oneline for quick overview of recent commits',
      'Combine --graph --oneline --all to visualize branch structure',
      'Use --since and --until to filter commits by date range',
      'Search commit messages with --grep for specific keywords',
      'Use -- <filename> to see commits that modified specific files'
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
  },
  'git-tag': {
    id: 'git-tag',
    title: 'Git Tag',
    icon: Tag,
    description: 'Mark specific commits with version labels and releases. Tags are used to mark important points in your repository history, typically for releases and version milestones.',
    color: 'electric-blue',
    keyCommands: [
      {
        command: 'git tag <tag-name>',
        description: 'Create a lightweight tag at current commit',
        example: 'git tag v1.0.0',
        output: 'Tag v1.0.0 created'
      },
      {
        command: 'git tag -a <tag-name> -m "message"',
        description: 'Create an annotated tag with message',
        example: 'git tag -a v1.0.0 -m "First stable release"',
        output: 'Annotated tag v1.0.0 created'
      },
      {
        command: 'git tag',
        description: 'List all tags in repository',
        example: 'git tag',
        output: 'v1.0.0\nv1.1.0\nv2.0.0'
      },
      {
        command: 'git push origin --tags',
        description: 'Push all tags to remote repository',
        example: 'git push origin --tags',
        output: 'Tags pushed to remote successfully'
      },
      {
        command: 'git tag -d <tag-name>',
        description: 'Delete a tag locally',
        example: 'git tag -d v1.0.0',
        output: 'Deleted tag v1.0.0'
      }
    ],
    examples: [
      {
        title: 'Release Tagging',
        description: 'Tag a release version with semantic versioning',
        code: `# Create annotated tag for release
git tag -a v1.2.0 -m "Release version 1.2.0 - New features and bug fixes"

# Push tag to remote
git push origin v1.2.0

# Or push all tags
git push origin --tags

# View tag information
git show v1.2.0`,
        output: 'Release v1.2.0 tagged and pushed successfully'
      },
      {
        title: 'Hotfix Tagging',
        description: 'Tag hotfix releases for tracking',
        code: `# Tag hotfix release
git tag -a v1.1.1 -m "Hotfix: Critical security patch"

# List tags with pattern
git tag -l "v1.1.*"

# Push hotfix tag
git push origin v1.1.1`,
        output: 'Hotfix v1.1.1 tagged and available'
      },
      {
        title: 'Tag Management',
        description: 'Manage and organize repository tags',
        code: `# List all tags
git tag

# List tags with pattern matching
git tag -l "v2.*"

# Show tag details
git show v2.0.0

# Delete local tag
git tag -d v1.0.0-beta

# Delete remote tag
git push origin --delete v1.0.0-beta`,
        output: 'Tags managed and organized successfully'
      }
    ],
    useCases: [
      'Marking release versions and milestones',
      'Creating stable reference points in history',
      'Facilitating deployment and rollback processes',
      'Organizing software versions and changelogs',
      'Enabling semantic versioning workflows',
      'Marking important commits for future reference'
    ],
    tips: [
      'Use semantic versioning (v1.0.0, v1.1.0, v2.0.0) for consistency',
      'Prefer annotated tags (-a flag) for releases as they store more metadata',
      'Push tags separately with git push origin --tags or git push origin <tag-name>',
      'Use lightweight tags for temporary or local reference points',
      'Include meaningful messages with annotated tags to describe the release',
      'Regularly clean up old or unnecessary tags to keep repository organized'
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