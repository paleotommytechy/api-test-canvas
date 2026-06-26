import React, { useEffect, useState } from 'react';
import { useApiStore } from '@/store/useApiStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { EndpointDetails } from './EndpointDetails';
import { RequestBuilder } from './RequestBuilder';
import { ResponseViewer } from './ResponseViewer';
import { AiInsights } from './AiInsights';
import { CodeSnippets } from './CodeSnippets';
import { FlowDiagram } from './FlowDiagram';
import { AiService } from '@/services/ai';
import { ApiEndpoint } from '@/types/api';
import { Loader2, Sparkles, Terminal, Share2, Code2, Network } from 'lucide-react';

export function MainContent() {
  const { currentDoc, selectedEndpointId, openaiKey } = useApiStore();
  const [endpoint, setEndpoint] = useState<ApiEndpoint | null>(null);
  const [isEnriching, setIsEnriching] = useState(false);

  useEffect(() => {
    if (selectedEndpointId && currentDoc) {
      const found = currentDoc.endpoints.find(e => e.id === selectedEndpointId);
      if (found) {
        setEndpoint(found);
        
        // Enrich with AI if not already enriched
        if (!found.aiGenerated && !isEnriching) {
          enrichWithAi(found);
        }
      }
    }
  }, [selectedEndpointId, currentDoc]);

  const enrichWithAi = async (e: ApiEndpoint) => {
    setIsEnriching(true);
    const ai = new AiService(openaiKey);
    const enrichment = await ai.enrichEndpoint(e);
    
    // Update the endpoint in the store (simplified for now)
    e.aiGenerated = enrichment as any;
    setEndpoint({ ...e });
    setIsEnriching(false);
  };

  if (!endpoint) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Select an endpoint to get started
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <EndpointDetails endpoint={endpoint} />

      <Tabs defaultValue="playground" className="w-full">
        <div className="flex items-center justify-between mb-4 border-b">
          <TabsList className="bg-transparent h-12 w-auto justify-start p-0">
            <TabsTrigger 
              value="playground" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-6"
            >
              <Terminal className="w-4 h-4 mr-2" />
              Playground
            </TabsTrigger>
            <TabsTrigger 
              value="snippets" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-6"
            >
              <Code2 className="w-4 h-4 mr-2" />
              Code Snippets
            </TabsTrigger>
            <TabsTrigger 
              value="insights" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-6"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI Insights
              {isEnriching && <Loader2 className="w-3 h-3 ml-2 animate-spin" />}
            </TabsTrigger>
            <TabsTrigger 
              value="flow" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-6"
            >
              <Network className="w-4 h-4 mr-2" />
              Flow Diagram
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="playground" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RequestBuilder endpoint={endpoint} />
            <ResponseViewer />
          </div>
        </TabsContent>

        <TabsContent value="snippets" className="mt-0">
          <CodeSnippets endpoint={endpoint} />
        </TabsContent>

        <TabsContent value="insights" className="mt-0">
          <AiInsights endpoint={endpoint} isEnriching={isEnriching} />
        </TabsContent>

        <TabsContent value="flow" className="mt-0">
          <FlowDiagram currentDoc={currentDoc!} selectedEndpoint={endpoint} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
