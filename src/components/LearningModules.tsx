import React from 'react';
import { BookOpen, Users, Zap, ArrowRight, CheckCircle, Clock, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const LearningModules: React.FC = () => {
  const modules = [
    {
      id: 1,
      level: "Basic",
      title: "Git Fundamentals",
      description: "Master the core concepts with interactive visualizations",
      icon: BookOpen,
      color: "electric-blue",
      lessons: 8,
      duration: "2 hours",
      rating: 4.9,
      features: [
        "What is Version Control?",
        "Git Installation & Setup",
        "Repository Initialization",
        "The Three States Workflow",
        "Remote Repository Basics"
      ],
      interactive: ["3D Timeline Visualization", "Command Line Simulator"],
      difficulty: "Beginner"
    },
    {
      id: 2,
      level: "Intermediate", 
      title: "Branching & Collaboration",
      description: "Visualize branching strategies and team workflows",
      icon: Users,
      color: "neon-green",
      lessons: 12,
      duration: "4 hours",
      rating: 4.8,
      features: [
        "Creating & Managing Branches",
        "Merge vs Rebase Strategies", 
        "Pull Request Workflows",
        "Conflict Resolution",
        "Team Collaboration Patterns"
      ],
      interactive: ["3D Branch Visualization", "Collaborative Simulator"],
      difficulty: "Intermediate"
    },
    {
      id: 3,
      level: "Advanced",
      title: "Git Mastery & Automation", 
      description: "Advanced techniques and workflow automation",
      icon: Zap,
      color: "warm-orange",
      lessons: 15,
      duration: "6 hours", 
      rating: 4.9,
      features: [
        "Interactive Rebase",
        "Cherry-picking & Stashing",
        "Git Hooks & Automation",
        "Submodules & Subtrees",
        "Advanced History Manipulation"
      ],
      interactive: ["Advanced 3D Visualizer", "Hook Configuration Tool"],
      difficulty: "Advanced"
    }
  ];

  const getGlowClass = (color: string) => {
    switch (color) {
      case 'electric-blue': return 'glow-blue';
      case 'neon-green': return 'glow-green';
      case 'warm-orange': return 'glow-orange';
      default: return '';
    }
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'electric-blue': return 'text-electric-blue';
      case 'neon-green': return 'text-neon-green';
      case 'warm-orange': return 'text-warm-orange';
      default: return 'text-primary';
    }
  };

  return (
    <section id="learn" className="py-20 bg-surface relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-secondary opacity-50"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            Interactive Learning Paths
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Choose Your <span className="text-gradient-primary">Learning Journey</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Progress through carefully crafted modules with hands-on practice, 
            3D visualizations, and real-world scenarios.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module, index) => {
            const Icon = module.icon;
            return (
              <Card 
                key={module.id}
                className={`card-glow interactive-element group hover:scale-105 ${getGlowClass(module.color)}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="secondary" 
                      className={`${getColorClass(module.color)} bg-opacity-20`}
                    >
                      {module.level}
                    </Badge>
                    <div className={`w-12 h-12 rounded-xl bg-surface-elevated flex items-center justify-center ${getGlowClass(module.color)}`}>
                      <Icon className={`w-6 h-6 ${getColorClass(module.color)}`} />
                    </div>
                  </div>
                  
                  <div>
                    <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                      {module.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {module.description}
                    </CardDescription>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{module.lessons} lessons</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{module.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span>{module.rating}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-foreground/80">What You'll Learn:</h4>
                    <ul className="space-y-2">
                      {module.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                      {module.features.length > 3 && (
                        <li className="text-sm text-muted-foreground/60">
                          + {module.features.length - 3} more topics
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Interactive Features */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-foreground/80">Interactive Tools:</h4>
                    <div className="flex flex-wrap gap-2">
                      {module.interactive.map((tool, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button 
                    className={`w-full group ${module.level === 'Basic' ? 'btn-hero' : 'btn-secondary-hero'}`}
                  >
                    Start {module.level} Course
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-6">
            Not sure where to start? Take our quick assessment.
          </p>
          <Button variant="outline" className="btn-secondary-hero">
            Find My Perfect Path
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};