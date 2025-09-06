import React from 'react';
import { Box, Terminal, Users, Zap, Play, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const Features: React.FC = () => {
  const features = [
    {
      icon: Box,
      title: "3D Git Visualizations",
      description: "See your commits, branches, and merges come alive in interactive 3D space",
      details: [
        "Real-time commit tree visualization",
        "Interactive branch manipulation", 
        "Merge conflict resolution in 3D",
        "Timeline and history exploration"
      ],
      color: "electric-blue",
      demo: "View 3D Demo"
    },
    {
      icon: Terminal,
      title: "Command Line Simulator",
      description: "Practice Git commands in a safe, guided environment with instant feedback",
      details: [
        "Full Git command support",
        "Smart error detection & hints",
        "File system visualization",
        "Step-by-step guidance"
      ],
      color: "neon-green", 
      demo: "Try Simulator"
    },
    {
      icon: Users,
      title: "Collaborative Workflows",
      description: "Master team-based Git workflows with simulated collaborative scenarios",
      details: [
        "Multi-developer simulations",
        "Pull request workflows",
        "Code review processes", 
        "Team branching strategies"
      ],
      color: "warm-orange",
      demo: "Practice Collaboration"
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
    <section className="py-20 bg-gradient-secondary relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Revolutionary <span className="text-gradient-primary">Learning Tools</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Experience Git like never before with cutting-edge interactive tools 
            designed to make complex concepts intuitive and engaging.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className={`card-elevated interactive-element group hover:scale-105 ${getGlowClass(feature.color)}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardHeader className="text-center space-y-4">
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-surface flex items-center justify-center ${getGlowClass(feature.color)}`}>
                    <Icon className={`w-8 h-8 ${getColorClass(feature.color)}`} />
                  </div>
                  
                  <div>
                    <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Feature Details */}
                  <ul className="space-y-3">
                    {feature.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center space-x-3 text-sm text-muted-foreground">
                        <div className={`w-2 h-2 rounded-full ${getColorClass(feature.color)} opacity-60`}></div>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Demo Button */}
                  <Button 
                    variant="outline" 
                    className="w-full group btn-secondary-hero"
                  >
                    <Play className="mr-2 w-4 h-4 group-hover:scale-110 transition-transform" />
                    {feature.demo}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center bg-surface-elevated rounded-2xl p-8 lg:p-12 border border-border animate-scale-in">
          <div className="max-w-3xl mx-auto space-y-6">
            <h3 className="text-2xl lg:text-3xl font-bold">
              Ready to Transform Your <span className="text-gradient-primary">Git Skills</span>?
            </h3>
            <p className="text-muted-foreground text-lg">
              Join thousands of developers who have mastered Git through our interactive learning platform. 
              Start your journey today and see the difference visual learning makes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button className="btn-hero text-lg px-8 py-6">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button variant="outline" className="btn-secondary-hero text-lg px-8 py-6">
                Schedule Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex justify-center items-center space-x-6 pt-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-primary" />
                <span>Instant Access</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-accent" />
                <span>10K+ Happy Learners</span>
              </div>
              <div className="flex items-center space-x-2">
                <Box className="w-4 h-4 text-warm-orange" />
                <span>No Credit Card Required</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};