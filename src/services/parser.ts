import yaml from 'yaml';
import { ApiDoc, ApiEndpoint, HttpMethod, ApiParameter } from '../types/api';

export class ParserService {
  static async parse(input: string, type: 'swagger' | 'postman' | 'raw' | 'url'): Promise<ApiDoc> {
    try {
      let source: any;
      
      if (type === 'url') {
        const response = await fetch(input);
        const text = await response.text();
        source = input.endsWith('.json') ? JSON.parse(text) : yaml.parse(text);
      } else if (type === 'swagger') {
        source = input.trim().startsWith('{') ? JSON.parse(input) : yaml.parse(input);
      } else {
        source = JSON.parse(input);
      }

      return this.parseOpenApi(source);
    } catch (error: any) {
      console.error('Parsing error:', error);
      throw new Error(`Failed to parse: ${error.message}`);
    }
  }

  private static parseOpenApi(api: any): ApiDoc {
    const endpoints: ApiEndpoint[] = [];
    
    const paths = api.paths || {};
    Object.entries(paths).forEach(([path, methods]: [string, any]) => {
      Object.entries(methods).forEach(([method, detail]: [string, any]) => {
        if (!['get', 'post', 'put', 'delete', 'patch'].includes(method.toLowerCase())) return;

        const parameters: ApiParameter[] = (detail.parameters || []).map((p: any) => ({
          name: p.name,
          in: p.in || 'query',
          required: p.required || false,
          type: p.schema?.type || 'string',
          description: p.description,
          example: p.example
        }));

        endpoints.push({
          id: `${method}-${path}-${Math.random().toString(36).substr(2, 5)}`,
          method: method.toUpperCase() as HttpMethod,
          path,
          summary: detail.summary || detail.operationId || `${method.toUpperCase()} ${path}`,
          description: detail.description,
          tags: detail.tags || ['Default'],
          parameters,
          requestBody: detail.requestBody ? {
            content: detail.requestBody.content,
            description: detail.requestBody.description
          } : undefined,
          responses: Object.entries(detail.responses || {}).map(([status, res]: [string, any]) => ({
            status: parseInt(status) || 0,
            description: res.description || '',
            schema: res.content?.['application/json']?.schema,
            example: res.content?.['application/json']?.example
          }))
        });
      });
    });

    return {
      title: api.info?.title || 'API Documentation',
      version: api.info?.version || '1.0.0',
      description: api.info?.description,
      baseUrl: (api.servers?.[0]?.url) || '',
      endpoints
    };
  }
}
