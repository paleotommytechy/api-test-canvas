import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ApiDoc, HttpMethod } from '../types/api';

interface ApiStore {
  currentDoc: ApiDoc | null;
  selectedEndpointId: string | null;
  history: any[];
  environments: Record<string, Record<string, string>>;
  activeEnvironment: string;
  isLoading: boolean;
  openaiKey: string;
  
  setDoc: (doc: ApiDoc) => void;
  selectEndpoint: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  setOpenAIKey: (key: string) => void;
  addToHistory: (entry: any) => void;
  updateEnvironment: (name: string, values: Record<string, string>) => void;
  setActiveEnvironment: (name: string) => void;
  reset: () => void;
}

export const useApiStore = create<ApiStore>()(
  persist(
    (set) => ({
      currentDoc: null,
      selectedEndpointId: null,
      history: [],
      environments: { default: {} },
      activeEnvironment: 'default',
      isLoading: false,
      openaiKey: '',

      setDoc: (doc) => set({ currentDoc: doc, selectedEndpointId: doc.endpoints[0]?.id || null }),
      selectEndpoint: (id) => set({ selectedEndpointId: id }),
      setLoading: (loading) => set({ isLoading: loading }),
      setOpenAIKey: (key) => set({ openaiKey: key }),
      addToHistory: (entry) => set((state) => ({ history: [entry, ...state.history].slice(0, 50) })),
      updateEnvironment: (name, values) => 
        set((state) => ({ 
          environments: { ...state.environments, [name]: values } 
        })),
      setActiveEnvironment: (name) => set({ activeEnvironment: name }),
      reset: () => set({ currentDoc: null, selectedEndpointId: null, history: [] }),
    }),
    {
      name: 'api-playground-storage',
      partialize: (state) => ({ 
        history: state.history, 
        environments: state.environments, 
        activeEnvironment: state.activeEnvironment,
        openaiKey: state.openaiKey
      }),
    }
  )
);
