import React, { useState } from 'react';
import { ApiEndpoint } from '@/types/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Send, Bot, User, Loader2, Lightbulb, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AiService } from '@/services/ai';
import { useApiStore } from '@/store/useApiStore';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Props {
  endpoint: ApiEndpoint;
  isEnriching: boolean;
}

export function AiInsights({ endpoint, isEnriching }: Props) {
  const { openaiKey } = useApiStore();
  const [question, setQuestion] = useState('');
  const [history, setHistory] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [isAsking, setIsAsking] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;

    const userMsg = { role: 'user' as const, content: question };
    setHistory(prev => [...prev, userMsg]);
    setQuestion('');
    setIsAsking(true);

    const ai = new AiService(openaiKey);
    const response = await ai.chatAboutEndpoint(endpoint, question, history);
    
    setHistory(prev => [...prev, { role: 'assistant' as const, content: response }]);
    setIsAsking(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className="border-none shadow-none bg-muted/30">
          <CardHeader>
            <CardTitle className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
              <Bot className="w-4 h-4 text-primary" />
              AI Explanation
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEnriching ? (
              <div className="flex items-center gap-2 text-muted-foreground py-8">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI is analyzing the endpoint...</span>
              </div>
            ) : (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {endpoint.aiGenerated?.explanation || "No explanation available. Provide an OpenAI key to generate one."}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-none bg-muted/30">
          <CardHeader>
            <CardTitle className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              Suggested Improvements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {endpoint.aiGenerated?.suggestedImprovements?.map((imp, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                    {i + 1}
                  </div>
                  {imp}
                </li>
              )) || (
                <p className="text-sm text-muted-foreground italic">No suggestions available yet</p>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-none bg-muted/30 flex flex-col h-[600px]">
        <CardHeader>
          <CardTitle className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            AI Chat
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              <div className="bg-background rounded-lg p-3 text-xs border">
                Hello! I can help you understand this endpoint. What would you like to know?
              </div>
              {history.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-lg p-3 text-xs border ${
                    msg.role === 'user' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isAsking && (
                <div className="flex justify-start">
                  <div className="bg-background rounded-lg p-3 text-xs border flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    AI is typing...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="p-4 border-t bg-background/50">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleAsk(); }}
              className="flex gap-2"
            >
              <Input 
                placeholder="Ask about this API..." 
                className="h-9 text-xs" 
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <Button size="icon" className="h-9 w-9 shrink-0" disabled={isAsking || !question.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
