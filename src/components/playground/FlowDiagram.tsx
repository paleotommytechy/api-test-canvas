import React from 'react';
import { ApiDoc, ApiEndpoint } from '@/types/api';
import { Network, Info } from 'lucide-react';

interface Props {
  currentDoc: ApiDoc;
  selectedEndpoint: ApiEndpoint;
}

export function FlowDiagram({ currentDoc, selectedEndpoint }: Props) {
  return (
    <div className="h-[600px] w-full border rounded-xl bg-muted/10 flex flex-col items-center justify-center p-12 text-center space-y-4">
      <div className="p-6 bg-background rounded-full border shadow-sm">
        <Network className="w-12 h-12 text-primary" />
      </div>
      <div className="space-y-2 max-w-md">
        <h3 className="text-xl font-bold">API Flow Visualization</h3>
        <p className="text-muted-foreground text-sm">
          Visualization is currently simplified for performance. In a full production environment, this would show interactive nodes for each endpoint and their dependencies.
        </p>
      </div>
      <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20 text-left max-w-lg mt-8">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider">Current API Structure</p>
          <p className="text-sm font-medium">{currentDoc.endpoints.length} endpoints detected across {Array.from(new Set(currentDoc.endpoints.flatMap(e => e.tags))).length} categories.</p>
        </div>
      </div>
    </div>
  );
}
