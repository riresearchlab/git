import React from 'react';
import { ArrowRight, Play, Star, GitBranch, Code, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GitLogo3D } from './GitLogo3D';

export const Hero: React.FC = () => {

  return (
    <section className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-glow opacity-30"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
          {/* Content Side */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-primary font-semibold">
                <Star className="w-5 h-5 animate-pulse-glow" />
                <span>Your Journey to Git Mastery</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="text-gradient-primary">Visualize</span>
                <br />
                Your Version
                <br />
                <span className="text-glow">Control</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                Master Git with interactive 3D visualizations, real-time command simulators, 
                and hands-on tutorials that make complex concepts crystal clear.
              </p>
            </div>
          </div>

          {/* 3D Logo Side */}
          <div className="flex justify-center items-center animate-scale-in">
            <div className="relative">
              <GitLogo3D className="animate-float" />
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary/30 rounded-full animate-pulse-glow"></div>
              <div className="absolute -bottom-8 -left-8 w-6 h-6 bg-accent/40 rounded-full animate-pulse-glow" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute top-1/2 -left-12 w-4 h-4 bg-warm-orange/50 rounded-full animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};