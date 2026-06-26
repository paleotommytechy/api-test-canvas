import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApiStore } from '@/store/useApiStore';
import { Clock, Database, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ResponseViewer() {
  const { history, selectedEndpointId } = useApiStore();
  
  // Find the latest response for the selected endpoint
  const lastResponse = history.find(h => h.endpointId === selectedEndpointId);

  if (!lastResponse) {
    return (
      <Card className="border-none shadow-none bg-muted/30 flex flex-col items-center justify-center p-12 text-center space-y-4">
        <div className="p-4 bg-background rounded-full">
          <Globe className="w-8 h-8 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold">No response yet</p>
          <p className="text-xs text-muted-foreground">Send a request to see the response here</p>
        </div>
      </Card>
    );
  }

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-500 bg-green-500/10 border-green-500/20';
    if (status >= 400) return 'text-red-500 bg-red-500/10 border-red-500/20';
    return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
  };

  return (
    <Card className="border-none shadow-none bg-muted/30 overflow-hidden flex flex-col h-full min-h-[450px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 shrink-0">
        <CardTitle className="text-sm font-semibold uppercase tracking-wider">Response</CardTitle>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
            <Clock className="w-3 h-3" />
            {lastResponse.duration}ms
          </div>
          <Badge variant="outline" className={cn("px-2 py-0.5 font-bold", getStatusColor(lastResponse.status))}>
            {lastResponse.status} {lastResponse.statusText || (lastResponse.status === 200 ? 'OK' : '')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 border-t">
          <pre className="p-4 font-mono text-xs overflow-auto max-h-[400px] bg-background h-full">
            {JSON.stringify(lastResponse.response, null, 2)}
          </pre>
        </div>
        <div className="p-3 border-t bg-background/50">
          <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2 tracking-widest flex items-center gap-2">
            <Database className="w-3 h-3" /> Headers
          </p>
          <div className="space-y-1 max-h-32 overflow-auto">
            {Object.entries(lastResponse.headers).map(([key, value]) => (
              <div key={key} className="flex text-[10px] font-mono">
                <span className="text-muted-foreground w-1/3 shrink-0">{key}:</span>
                <span className="text-foreground truncate">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
