import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Link as LinkIcon, FileText, Sparkles, Terminal, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useApiStore } from '@/store/useApiStore';
import { ParserService } from '@/services/parser';
import { toast } from 'sonner';
import { PETSTORE_SWAGGER } from '@/lib/samples';

export function WelcomeHero() {
  const [url, setUrl] = useState('');
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const setDoc = useApiStore((state) => state.setDoc);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const type = file.name.endsWith('.postman_collection.json') ? 'postman' : 'swagger';
        const doc = await ParserService.parse(content, type);
        setDoc(doc);
        toast.success('Documentation loaded successfully');
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  const handleUrlSubmit = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const doc = await ParserService.parse(url, 'url');
      setDoc(doc);
      toast.success('Documentation loaded from URL');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRawSubmit = async () => {
    if (!rawText) return;
    setLoading(true);
    try {
      const doc = await ParserService.parse(rawText, 'swagger'); // Try swagger/yaml first
      setDoc(doc);
      toast.success('Documentation loaded');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSample = async () => {
    setLoading(true);
    try {
      const doc = await ParserService.parse(JSON.stringify(PETSTORE_SWAGGER), 'swagger');
      setDoc(doc);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-linear-to-b from-background to-muted/30 bg-grid-slate-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full text-center space-y-8"
      >
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 text-primary rounded-full mb-4">
            <Sparkles className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">AI-Powered API Playground</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            API Playground <span className="text-primary">Generator</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Instantly convert your Swagger, OpenAPI, or Postman collections into a production-ready interactive playground with AI insights.
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={handleSample} disabled={loading}>Try with Sample API</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
          {[
            { icon: Terminal, title: 'Instant Testing', desc: 'Execute requests directly from your browser' },
            { icon: Shield, title: 'AI Validation', desc: 'Detect parameters and auth methods automatically' },
            { icon: Zap, title: 'Code Generation', desc: 'Multi-language snippets generated on the fly' }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center p-4 space-y-2">
              <div className="p-3 bg-background rounded-xl border shadow-sm">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>

        <Card className="w-full max-w-2xl mx-auto border-dashed border-2">
          <CardContent className="pt-6">
            <Tabs defaultValue="file" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="file">Upload File</TabsTrigger>
                <TabsTrigger value="url">URL</TabsTrigger>
                <TabsTrigger value="raw">Raw Text</TabsTrigger>
              </TabsList>
              
              <TabsContent value="file" className="space-y-4">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-lg p-12 hover:border-primary/50 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept=".json,.yaml,.yml"
                    onChange={handleFileUpload}
                    disabled={loading}
                  />
                  <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Click or drag & drop Swagger/OpenAPI JSON or YAML
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Supports .json, .yaml, .yml and Postman collections
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="url" className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    placeholder="https://api.example.com/swagger.json" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <Button onClick={handleUrlSubmit} disabled={loading}>
                    {loading ? 'Loading...' : 'Import'}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="raw" className="space-y-4 text-left">
                <Textarea 
                  placeholder="Paste your OpenAPI JSON/YAML or plain documentation text here..." 
                  className="min-h-[200px] font-mono text-sm"
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                />
                <Button className="w-full" onClick={handleRawSubmit} disabled={loading}>
                  {loading ? 'Processing...' : 'Generate Playground'}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
