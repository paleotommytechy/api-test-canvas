import React, { useState, useEffect } from 'react';
import { ApiEndpoint } from '@/types/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Play, Send, Plus, Trash2 } from 'lucide-react';
import { useApiStore } from '@/store/useApiStore';
import axios from 'axios';
import { toast } from 'sonner';

interface Props {
  endpoint: ApiEndpoint;
}

export function RequestBuilder({ endpoint }: Props) {
  const { currentDoc, addToHistory } = useApiStore();
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [headers, setHeaders] = useState<Record<string, string>>({
    'Content-Type': 'application/json'
  });
  const [body, setBody] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Reset inputs when endpoint changes
    const initialQuery: Record<string, string> = {};
    endpoint.parameters.filter(p => p.in === 'query').forEach(p => {
      initialQuery[p.name] = p.example || '';
    });
    setQueryParams(initialQuery);

    if (endpoint.requestBody) {
      const example = endpoint.aiGenerated?.sampleRequest || {};
      setBody(JSON.stringify(example, null, 2));
    } else {
      setBody('');
    }
  }, [endpoint]);

  const handleSend = async () => {
    setIsLoading(true);
    const startTime = Date.now();
    
    try {
      let fullUrl = (currentDoc?.baseUrl || '') + endpoint.path;
      
      // Replace path parameters
      endpoint.path.match(/\{([^}]+)\}/g)?.forEach(match => {
        const key = match.slice(1, -1);
        fullUrl = fullUrl.replace(match, queryParams[key] || match);
      });

      const response = await axios({
        method: endpoint.method,
        url: fullUrl,
        params: queryParams,
        headers: headers,
        data: body ? JSON.parse(body) : undefined,
        validateStatus: () => true // Don't throw on error status
      });

      const duration = Date.now() - startTime;
      
      addToHistory({
        id: Math.random().toString(36).substr(2, 9),
        endpointId: endpoint.id,
        timestamp: new Date().toISOString(),
        method: endpoint.method,
        url: fullUrl,
        status: response.status,
        duration,
        response: response.data,
        headers: response.headers,
      });

      toast.success(`Request completed with status ${response.status}`);
    } catch (error: any) {
      toast.error(`Request failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-none bg-muted/30">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-sm font-semibold uppercase tracking-wider">Request</CardTitle>
        <Button size="sm" onClick={handleSend} disabled={isLoading} className="gap-2">
          {isLoading ? <Play className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Send Request
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="params" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-10 px-4">
            <TabsTrigger value="params" className="text-xs">Parameters</TabsTrigger>
            <TabsTrigger value="headers" className="text-xs">Headers</TabsTrigger>
            <TabsTrigger value="body" className="text-xs" disabled={!endpoint.requestBody && endpoint.method === 'GET'}>Body</TabsTrigger>
          </TabsList>

          <TabsContent value="params" className="p-4 m-0 space-y-4">
            {endpoint.parameters.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No parameters defined</p>
            ) : (
              <div className="space-y-4">
                {endpoint.parameters.map(p => (
                  <div key={p.name} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold">
                        {p.name} {p.required && <span className="text-red-500">*</span>}
                      </Label>
                      <span className="text-[10px] text-muted-foreground uppercase">{p.in}</span>
                    </div>
                    <Input 
                      placeholder={p.description || `Enter ${p.name}`}
                      value={queryParams[p.name] || ''}
                      onChange={(e) => setQueryParams({ ...queryParams, [p.name]: e.target.value })}
                      className="h-8 text-xs bg-background"
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="headers" className="p-4 m-0 space-y-4">
            {Object.entries(headers).map(([key, value]) => (
              <div key={key} className="flex gap-2">
                <Input value={key} readOnly className="h-8 text-xs w-1/3 bg-muted/50" />
                <Input 
                  value={value} 
                  onChange={(e) => setHeaders({ ...headers, [key]: e.target.value })}
                  className="h-8 text-xs flex-1 bg-background" 
                />
              </div>
            ))}
            <Button variant="ghost" size="sm" className="w-full h-8 text-xs gap-2">
              <Plus className="w-3 h-3" /> Add Header
            </Button>
          </TabsContent>

          <TabsContent value="body" className="m-0 border-t">
            <Textarea
              className="min-h-[300px] font-mono text-xs rounded-none border-none focus-visible:ring-0 bg-background"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder='{ "key": "value" }'
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
