import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

interface TerminalProps {
  title?: string;
  output: string[];
  onClear?: () => void;
  height?: string;
  className?: string;
}

export const Terminal: React.FC<TerminalProps> = ({ 
  title = "Git Terminal", 
  output, 
  onClear,
  height = "h-[400px]",
  className = ""
}) => {
  const terminalContentRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new output is added
  useEffect(() => {
    if (terminalContentRef.current) {
      terminalContentRef.current.scrollTop = terminalContentRef.current.scrollHeight;
    }
  }, [output]);

  // Format output to include prompt before each command
  const formatOutput = () => {
    const formattedLines: JSX.Element[] = [];
    
    // Add initial prompt if no output
    if (output.length === 0) {
      formattedLines.push(
        <div key="initial-prompt" className="text-green-400">
          admin@ubuntu:~$ <span className="animate-pulse">_</span>
        </div>
      );
      return formattedLines;
    }

    let i = 0;
    while (i < output.length) {
      const line = output[i];
      
      // If line starts with $, it's a command - add prompt before it
      if (line.startsWith('$ ')) {
        formattedLines.push(
          <div key={`prompt-${i}`} className="text-green-400">
            admin@ubuntu:~{line}
          </div>
        );
        i++;
        
        // Add command output lines until next command or end
        while (i < output.length && !output[i].startsWith('$ ')) {
          const outputLine = output[i];
          formattedLines.push(
            <div key={`output-${i}`} className={
              outputLine.startsWith('error:') || outputLine.startsWith('fatal:')
                ? 'text-red-400'
                : 'text-gray-300'
            }>
              {outputLine}
            </div>
          );
          i++;
        }
      } else {
        // Handle lines that don't start with $ (fallback)
        formattedLines.push(
          <div key={`line-${i}`} className={
            line.startsWith('admin@ubuntu:~$') || line.startsWith('$') 
              ? 'text-green-400' 
              : line.startsWith('error:') || line.startsWith('fatal:')
              ? 'text-red-400'
              : 'text-gray-300'
          }>
            {line}
          </div>
        );
        i++;
      }
    }

    // Always add current prompt at the end
    formattedLines.push(
      <div key="current-prompt" className="text-green-400">
        admin@ubuntu:~$ <span className="animate-pulse">_</span>
      </div>
    );

    return formattedLines;
  };

  return (
    <div className={`bg-slate-900 rounded-lg border border-slate-700 ${className}`}>
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 rounded-t-lg border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-300 ml-2 text-sm font-mono">{title}</span>
        </div>
        {onClear && (
          <Button
            onClick={onClear}
            size="sm"
            variant="ghost"
            className="text-gray-400 hover:text-white text-xs px-3 py-1 h-auto"
          >
            Clear
          </Button>
        )}
      </div>
      
      {/* Terminal Content */}
      <div 
        ref={terminalContentRef}
        className={`p-4 font-mono text-sm ${height} overflow-y-auto scroll-smooth`}
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="space-y-1">
          {formatOutput()}
        </div>
      </div>
    </div>
  );
};