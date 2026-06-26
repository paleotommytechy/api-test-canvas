export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

export interface ApiParameter {
  name: string;
  in: 'query' | 'header' | 'path' | 'body';
  required: boolean;
  type: string;
  description?: string;
  example?: any;
}

export interface ApiResponse {
  status: number;
  description: string;
  schema?: any;
  example?: any;
}

export interface ApiEndpoint {
  id: string;
  method: HttpMethod;
  path: string;
  summary: string;
  description?: string;
  tags: string[];
  parameters: ApiParameter[];
  requestBody?: {
    content: Record<string, any>;
    description?: string;
  };
  responses: ApiResponse[];
  aiGenerated?: {
    explanation?: string;
    suggestedImprovements?: string[];
    sampleRequest?: any;
    sampleResponse?: any;
    snippets: Record<string, string>;
  };
}

export interface ApiDoc {
  title: string;
  version: string;
  description?: string;
  baseUrl: string;
  endpoints: ApiEndpoint[];
  auth?: {
    type: string;
    details: any;
  };
}

export interface AppState {
  currentDoc: ApiDoc | null;
  selectedEndpointId: string | null;
  history: any[];
  environments: Record<string, any>;
  activeEnvironment: string;
  isLoading: boolean;
  apiKey: string;
}
