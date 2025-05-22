'use client';

import { create } from 'zustand';
import axios from 'axios';

// Define types
export type SWOTItem = {
  id: string;
  content: string;
  impact: number; // 1-5 scale
  priority: 'high' | 'medium' | 'low';
  category: 'strength' | 'weakness' | 'opportunity' | 'threat';
};

export type SWOTAnalysis = {
  strengths: SWOTItem[];
  weaknesses: SWOTItem[];
  opportunities: SWOTItem[];
  threats: SWOTItem[];
};

export type ProjectInfo = {
  id?: string;
  title: string;
  description: string;
  goals: string[];
  industry: string;
  stage: string;
  decisionType: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type SWOTState = {
  project: ProjectInfo;
  analysis: SWOTAnalysis;
  strategies: {
    so: string[];
    wo: string[];
    st: string[];
    wt: string[];
  };
  loading: boolean;
  error: string | null;
};

export type SWOTActions = {
  setProject: (project: Partial<ProjectInfo>) => void;
  setAnalysis: (analysis: SWOTAnalysis) => void;
  addItem: (item: Omit<SWOTItem, 'id'>) => void;
  updateItem: (item: SWOTItem) => void;
  removeItem: (id: string) => void;
  moveItem: (id: string, from: keyof SWOTAnalysis, to: keyof SWOTAnalysis) => void;
  setStrategies: (strategies: { so: string[]; wo: string[]; st: string[]; wt: string[] }) => void;
  generateAnalysis: () => Promise<void>;
  generateStrategies: () => Promise<void>;
  saveProject: () => Promise<void>;
  loadProject: (id: string) => Promise<void>;
  resetState: () => void;
};

// API base URL - we'll configure this properly in Next.js env
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create the store
const useSWOTStore = create<SWOTState & SWOTActions>((set, get) => ({
  project: {
    title: '',
    description: '',
    goals: [],
    industry: '',
    stage: '',
    decisionType: '',
  },
  analysis: {
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: [],
  },
  strategies: {
    so: [],
    wo: [],
    st: [],
    wt: [],
  },
  loading: false,
  error: null,

  setProject: (project) => {
    set((state) => ({
      project: {
        ...state.project,
        ...project,
      },
    }));
  },

  setAnalysis: (analysis) => {
    set({ analysis });
  },

  addItem: (item) => {
    const newItem: SWOTItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 9),
    };
    
    set((state) => {
      const category = item.category;
      return {
        analysis: {
          ...state.analysis,
          [category]: [...state.analysis[category], newItem],
        },
      };
    });
  },

  updateItem: (item) => {
    set((state) => {
      const category = item.category;
      
      // Find which category the item currently belongs to
      let currentCategory: keyof SWOTAnalysis | null = null;
      for (const cat of ['strengths', 'weaknesses', 'opportunities', 'threats'] as const) {
        if (state.analysis[cat].some((i) => i.id === item.id)) {
          currentCategory = cat;
          break;
        }
      }
      
      if (!currentCategory) return state;
      
      // If category changed, remove from old category and add to new one
      if (currentCategory !== category) {
        const updatedAnalysis = { ...state.analysis };
        updatedAnalysis[currentCategory] = updatedAnalysis[currentCategory].filter(
          (i) => i.id !== item.id
        );
        updatedAnalysis[category] = [...updatedAnalysis[category], item];
        
        return { analysis: updatedAnalysis };
      }
      
      // If category is the same, just update the item
      return {
        analysis: {
          ...state.analysis,
          [category]: state.analysis[category].map((i) =>
            i.id === item.id ? item : i
          ),
        },
      };
    });
  },

  removeItem: (id) => {
    set((state) => {
      const updatedAnalysis = { ...state.analysis };
      
      for (const category of ['strengths', 'weaknesses', 'opportunities', 'threats'] as const) {
        updatedAnalysis[category] = updatedAnalysis[category].filter(
          (item) => item.id !== id
        );
      }
      
      return { analysis: updatedAnalysis };
    });
  },

  moveItem: (id, from, to) => {
    set((state) => {
      const itemToMove = state.analysis[from].find((item) => item.id === id);
      if (!itemToMove) return state;
      
      const updatedItem = { ...itemToMove, category: to.slice(0, -1) as 'strength' | 'weakness' | 'opportunity' | 'threat' };
      
      return {
        analysis: {
          ...state.analysis,
          [from]: state.analysis[from].filter((item) => item.id !== id),
          [to]: [...state.analysis[to], updatedItem],
        },
      };
    });
  },

  setStrategies: (strategies) => {
    set({ strategies });
  },

  generateAnalysis: async () => {
    try {
      set({ loading: true, error: null });
      
      const response = await axios.post(`${API_URL}/api/swot/analyze`, {
        project: {
          title: get().project.title,
          description: get().project.description,
          goals: get().project.goals,
          industry: get().project.industry,
          stage: get().project.stage,
          decision_type: get().project.decisionType,
        },
      });
      
      set({
        analysis: response.data,
        loading: false,
      });
    } catch (error) {
      console.error('Error generating SWOT analysis:', error);
      set({
        loading: false,
        error: 'Failed to generate SWOT analysis. Please try again.',
      });
    }
  },

  generateStrategies: async () => {
    try {
      set({ loading: true, error: null });
      
      const response = await axios.post(`${API_URL}/api/swot/strategies`, {
        strengths: get().analysis.strengths,
        weaknesses: get().analysis.weaknesses,
        opportunities: get().analysis.opportunities,
        threats: get().analysis.threats,
      });
      
      set({
        strategies: response.data,
        loading: false,
      });
    } catch (error) {
      console.error('Error generating strategies:', error);
      set({
        loading: false,
        error: 'Failed to generate strategies. Please try again.',
      });
    }
  },

  saveProject: async () => {
    try {
      set({ loading: true, error: null });
      
      const response = await axios.post(`${API_URL}/api/projects`, {
        project: {
          title: get().project.title,
          description: get().project.description,
          goals: get().project.goals,
          industry: get().project.industry,
          stage: get().project.stage,
          decision_type: get().project.decisionType,
        },
        analysis: {
          strengths: get().analysis.strengths,
          weaknesses: get().analysis.weaknesses,
          opportunities: get().analysis.opportunities,
          threats: get().analysis.threats,
        },
        strategies: get().strategies,
      });
      
      set({
        project: {
          ...get().project,
          id: response.data.id,
        },
        loading: false,
      });
      
      return response.data.id;
    } catch (error) {
      console.error('Error saving project:', error);
      set({
        loading: false,
        error: 'Failed to save project. Please try again.',
      });
      throw error;
    }
  },

  loadProject: async (id) => {
    try {
      set({ loading: true, error: null });
      
      const response = await axios.get(`${API_URL}/api/projects/${id}`);
      const { project, analysis, strategies } = response.data;
      
      set({
        project: {
          id: project.id,
          title: project.title,
          description: project.description,
          goals: project.goals,
          industry: project.industry,
          stage: project.stage,
          decisionType: project.decision_type,
          createdAt: new Date(project.created_at),
          updatedAt: new Date(project.updated_at),
        },
        analysis,
        strategies,
        loading: false,
      });
    } catch (error) {
      console.error('Error loading project:', error);
      set({
        loading: false,
        error: 'Failed to load project. Please try again.',
      });
    }
  },

  resetState: () => {
    set({
      project: {
        title: '',
        description: '',
        goals: [],
        industry: '',
        stage: '',
        decisionType: '',
      },
      analysis: {
        strengths: [],
        weaknesses: [],
        opportunities: [],
        threats: [],
      },
      strategies: {
        so: [],
        wo: [],
        st: [],
        wt: [],
      },
      loading: false,
      error: null,
    });
  },
}));

export default useSWOTStore;
