import React from 'react';
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
  height = "h-96",
  className = ""
}) => {
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
      <div className={`p-4 font-mono text-sm ${height} overflow-y-auto`}>
        <div className="space-y-1">
          {
            output.map((line, idx) => (
              <div key={idx} className={
                line.startsWith('admin@ubuntu:~$') || line.startsWith('$') 
                  ? 'text-green-400' 
                  : line.startsWith('error:') || line.startsWith('fatal:')
                  ? 'text-red-400'
                  : 'text-gray-300'
              }>
                {line}
              </div>
            ))
          }
          <div className="text-green-400">
            admin@ubuntu:~$ <span className="animate-pulse">_</span>
          </div>
        </div>
      </div>
    </div>
  );
};