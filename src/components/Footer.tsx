import React from 'react';
import { GitBranch, Twitter, Github, Linkedin, Mail, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const footerLinks = {
    product: [
      { name: 'Features', href: 'https://mdrakibtrofder.github.io/' },
      { name: 'Our Journey', href: 'https://github.com/riresearchlab' },
      { name: 'Changelog', href: 'https://github.com/riresearchlab/git/blob/main/README.md' },
      { name: 'Roadmap', href: 'https://roadmap.sh/git-github' }
    ],
    learning: [
      { name: 'Basic', href: '#git-core-architecture' },
      { name: 'Intermediate', href: '#git-integrating-changes' },
      { name: 'Advanced', href: '#git-advanced-commands' },
      { name: 'Tutorials', href: 'https://www.w3schools.com/git/' }
    ],
    community: [
      { name: 'Medium', href: 'https://discord.gg/bmU9UeAy' },
      { name: 'Forums', href: 'https://rakib3004.medium.com/' },
      { name: 'Blog', href: 'https://programming-with-rakib.blogspot.com/' },
      { name: 'Support', href: 'https://riresearchlab.github.io/' }
    ],
    company: [
      { name: 'About', href: 'https://riresearchlab.github.io/' },
      { name: 'Careers', href: 'https://www.google.com/about/careers/applications/' },
      { name: 'Privacy', href: 'https://policies.google.com/privacy?hl=en-US' },
      { name: 'Terms', href: 'https://opensource.org/license/mit' }
    ]
  };

  const socialLinks = [
    { icon: Twitter, href: 'https://x.com/mdrakibtrofder', label: 'Twitter' },
    { icon: Github, href: 'https://github.com/riresearchlab', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/mdrakibtrofder/', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:mdrakibtrofder@gmail.com', label: 'Email' }
  ];

  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="col-span-2 space-y-4">
              <div className="flex items-center space-x-2">
                <GitBranch className="w-8 h-8 text-primary animate-pulse-glow" />
                <span className="text-xl font-bold text-gradient-primary">Git Bioscope</span>
              </div>
              <p className="text-muted-foreground max-w-md">
                The ultimate interactive platform for mastering Git through 3D visualizations, 
                hands-on practice, and real-world scenarios.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      className="w-10 h-10 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-200 interactive-element"
                      aria-label={social.label}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Product Links */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Product</h3>
              <ul className="space-y-2">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Learning Links */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Learning</h3>
              <ul className="space-y-2">
                {footerLinks.learning.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Community Links */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Community</h3>
              <ul className="space-y-2">
                {footerLinks.community.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Company</h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>© 2025 Git Bioscope. All rights reserved.</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 animate-pulse" />
            <span>for developers worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
};