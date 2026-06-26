import React from 'react';
import { ApiEndpoint } from '@/types/api';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ExternalLink, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  endpoint: ApiEndpoint;
}

export function EndpointDetails({ endpoint }: Props) {
  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'POST': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'PUT': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'DELETE': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'PATCH': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const copyPath = () => {
    navigator.clipboard.writeText(endpoint.path);
    toast.success('Path copied to clipboard');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Badge variant="outline" className={cn("px-2 py-0.5 font-bold uppercase tracking-wider", getMethodColor(endpoint.method))}>
          {endpoint.method}
        </Badge>
        <div className="flex items-center gap-2 font-mono text-lg font-semibold flex-1">
          {endpoint.path}
          <button onClick={copyPath} className="text-muted-foreground hover:text-foreground transition-colors">
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{endpoint.summary}</h1>
        {endpoint.description && (
          <p className="text-muted-foreground text-lg max-w-4xl leading-relaxed">
            {endpoint.description}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {endpoint.tags.map(tag => (
          <Badge key={tag} variant="secondary" className="rounded-full px-3">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
