import React, { useState } from 'react';
import { ApiEndpoint } from '@/types/api';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Props {
  endpoint: ApiEndpoint;
}

export function CodeSnippets({ endpoint }: Props) {
  const [copied, setCopied] = useState(false);
  const [activeLang, setActiveLang] = useState('curl');

  const snippets = endpoint.aiGenerated?.snippets || {
    curl: `curl -X ${endpoint.method} "https://api.example.com${endpoint.path}"`,
    python: `import requests

response = requests.${endpoint.method.toLowerCase()}("https://api.example.com${endpoint.path}")
print(response.json())`,
    typescript: `const response = await fetch("https://api.example.com${endpoint.path}", {
  method: "${endpoint.method}"
});
const data = await response.json();`,
    java: `// Java snippet
HttpRequest request = HttpRequest.newBuilder()
  .uri(URI.create("https://api.example.com${endpoint.path}"))
  .method("${endpoint.method}", HttpRequest.BodyPublishers.noBody())
  .build();`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeLang as keyof typeof snippets] || '');
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-none shadow-none bg-muted/30 overflow-hidden">
      <CardContent className="p-0">
        <Tabs defaultValue="curl" onValueChange={setActiveLang} className="w-full">
          <div className="flex items-center justify-between px-4 border-b bg-background/50">
            <TabsList className="bg-transparent h-10 w-auto justify-start p-0">
              <TabsTrigger value="curl" className="text-xs">cURL</TabsTrigger>
              <TabsTrigger value="python" className="text-xs">Python</TabsTrigger>
              <TabsTrigger value="typescript" className="text-xs">TypeScript</TabsTrigger>
              <TabsTrigger value="java" className="text-xs">Java</TabsTrigger>
            </TabsList>
            <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 gap-2 text-xs">
              {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>

          <div className="h-[500px]">
            {Object.entries(snippets).map(([lang, code]) => (
              <TabsContent key={lang} value={lang} className="h-full m-0">
                <pre className="p-6 font-mono text-sm overflow-auto h-full bg-background text-foreground whitespace-pre-wrap">
                  {code}
                </pre>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
