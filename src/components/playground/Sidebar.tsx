import React, { useState } from 'react';
import { useApiStore } from '@/store/useApiStore';
import { Search, ChevronRight, Hash, Box, FolderOpen, History, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

export function Sidebar() {
  const { currentDoc, selectedEndpointId, selectEndpoint } = useApiStore();
  const [search, setSearch] = useState('');

  const filteredEndpoints = currentDoc?.endpoints.filter(e => 
    e.path.toLowerCase().includes(search.toLowerCase()) || 
    e.summary.toLowerCase().includes(search.toLowerCase()) ||
    e.method.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const groupedEndpoints = filteredEndpoints.reduce((acc, e) => {
    const tag = e.tags[0] || 'Default';
    if (!acc[tag]) acc[tag] = [];
    acc[tag].push(e);
    return acc;
  }, {} as Record<string, typeof filteredEndpoints>);

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET': return 'text-blue-500';
      case 'POST': return 'text-green-500';
      case 'PUT': return 'text-orange-500';
      case 'DELETE': return 'text-red-500';
      case 'PATCH': return 'text-purple-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <aside className="w-80 border-r bg-card flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
            PG
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold truncate text-sm">{currentDoc?.title}</h2>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Version {currentDoc?.version}</p>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Filter endpoints..." 
            className="pl-9 h-9" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-6">
          {Object.entries(groupedEndpoints).map(([tag, endpoints]) => (
            <div key={tag} className="space-y-1">
              <div className="px-3 py-1 flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <FolderOpen className="w-3 h-3" />
                {tag}
              </div>
              {endpoints.map((e) => (
                <button
                  key={e.id}
                  onClick={() => selectEndpoint(e.id)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-md text-left transition-all group",
                    selectedEndpointId === e.id 
                      ? "bg-primary/10 text-primary" 
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className={cn("text-[10px] font-bold w-10 shrink-0", getMethodColor(e.method))}>
                    {e.method}
                  </span>
                  <span className="text-xs font-medium truncate flex-1">{e.summary}</span>
                  <ChevronRight className={cn(
                    "w-3 h-3 transition-transform",
                    selectedEndpointId === e.id ? "rotate-90" : "opacity-0 group-hover:opacity-100"
                  )} />
                </button>
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t space-y-2 bg-muted/30">
        <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-full px-2 py-1.5">
          <History className="w-4 h-4" />
          Request History
        </button>
        <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-full px-2 py-1.5">
          <Box className="w-4 h-4" />
          Environments
        </button>
        <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-full px-2 py-1.5">
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>
    </aside>
  );
}
