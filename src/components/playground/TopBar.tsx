import React from 'react';
import { useApiStore } from '@/store/useApiStore';
import { Share2, Download, Save, Play, Globe, Settings, Key, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export function TopBar() {
  const { currentDoc, openaiKey, setOpenAIKey, reset, activeEnvironment, environments } = useApiStore();

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentDoc));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", `${currentDoc?.title.toLowerCase().replace(/\s/g, '_')}_playground.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast.success('Documentation exported');
  };

  return (
    <header className="h-16 border-b flex items-center justify-between px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <Badge variant="outline" className="h-7 px-2 font-mono text-[10px] bg-muted/50">
          <Globe className="w-3 h-3 mr-1" />
          {currentDoc?.baseUrl || 'localhost'}
        </Badge>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              Env: <span className="font-bold ml-1">{activeEnvironment}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Environments</DropdownMenuLabel>
            {Object.keys(environments).map(env => (
              <DropdownMenuItem key={env}>
                {env}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-primary">Manage Environments...</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 relative">
              <Key className="w-4 h-4" />
              {!openaiKey && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">OpenAI API Key</h4>
                <p className="text-xs text-muted-foreground">Required for AI explanations and code generation.</p>
                <Input 
                  type="password" 
                  placeholder="sk-..." 
                  value={openaiKey}
                  onChange={(e) => setOpenAIKey(e.target.value)}
                  className="h-8"
                />
              </div>
              <p className="text-[10px] text-muted-foreground">Your key is stored locally in your browser.</p>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleExport}>
          <Download className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Share2 className="w-4 h-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Settings className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={reset} className="text-destructive">
              Reset Session
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="h-6 w-px bg-border mx-2" />
        
        <Button size="sm" className="h-9">
          <Play className="w-4 h-4 mr-2" />
          Run Suite
        </Button>
      </div>
    </header>
  );
}
