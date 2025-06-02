'use client';

import { create } from 'zustand';
import axios from 'axios';
import { useToast } from '@/app/components/ui/use-toast';

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
  errorType: 'api' | 'validation' | 'connection' | 'unknown' | null;
  lastAction: string | null;
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

// Helper function to handle errors and show toast
const handleError = (error: any, defaultMessage: string) => {
  let errorMessage = defaultMessage;
  let errorType: 'api' | 'validation' | 'connection' | 'unknown' = 'unknown';
      
  if (error.response) {
    // Backend returned an error response
    errorMessage = error.response.data?.error || errorMessage;
    errorType = 'api';
  } else if (error.request) {
    // Request was made but no response received
    errorMessage = 'Không thể kết nối với máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.';
    errorType = 'connection';
  }

  const { toast } = useToast();
  toast(errorMessage, "destructive");

  return { errorMessage, errorType };
};

// Create the store
const useSWOTStore = create<SWOTState & SWOTActions>((set, get) => ({
  project: {
    title: 'Bán xôi ',
    description: 'bán xôi buổi sáng ở Ngã Tư Hòa Xuân',
    goals: ["Có thu nhập 10 triệu 1 tháng", "Linh hoạt trong việc làm"],
    industry: 'Bán lẻ',
    stage: 'Ý tưởng',
    decisionType: "Chiến lược",
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
  errorType: null,
  lastAction: null,

  setProject: (project) => {
    set((state) => ({
      project: {
        ...state.project,
        ...project,
      },
      error: null,
      errorType: null,
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
      // Map singular to plural
      const categoryMap = {
        strength: 'strengths',
        weakness: 'weaknesses',
        opportunity: 'opportunities',
        threat: 'threats',
      } as const;
      const pluralCategory = categoryMap[item.category];
      return {
        analysis: {
          ...state.analysis,
          [pluralCategory]: [...state.analysis[pluralCategory], newItem],
        },
      };
    });
  },

  updateItem: (item) => {
    set((state) => {
      // Map singular to plural
      const categoryMap = {
        strength: 'strengths',
        weakness: 'weaknesses',
        opportunity: 'opportunities',
        threat: 'threats',
      } as const;
      const pluralCategory = categoryMap[item.category];
      // Find which plural category the item currently belongs to
      let currentCategory: keyof SWOTAnalysis | null = null;
      for (const cat of ['strengths', 'weaknesses', 'opportunities', 'threats'] as const) {
        if (state.analysis[cat].some((i) => i.id === item.id)) {
          currentCategory = cat;
          break;
        }
      }
      if (!currentCategory) return state;
      // If category changed, remove from old category and add to new one
      if (currentCategory !== pluralCategory) {
        const updatedAnalysis = { ...state.analysis };
        updatedAnalysis[currentCategory] = updatedAnalysis[currentCategory].filter(
          (i) => i.id !== item.id
        );
        updatedAnalysis[pluralCategory] = [...updatedAnalysis[pluralCategory], item];
        return { analysis: updatedAnalysis };
      }
      // If category is the same, just update the item
      return {
        analysis: {
          ...state.analysis,
          [pluralCategory]: state.analysis[pluralCategory].map((i: SWOTItem) =>
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
      set({ 
        loading: true, 
        error: null, 
        errorType: null,
        lastAction: 'analyze'
      });
      
      // Validate project data
      const projectData = get().project;
      if (!projectData.title || !projectData.description || !projectData.industry || !projectData.stage) {
        set({
          loading: false,
          error: 'Vui lòng điền đầy đủ thông tin dự án trước khi phân tích.',
          errorType: 'validation'
        });
        return;
      }
      
      // Use the Next.js API route instead of directly calling Python backend
      const response = await axios.post('/api/swot-analyze', {
        project: {
          title: projectData.title,
          description: projectData.description,
          goals: projectData.goals,
          industry: projectData.industry,
          stage: projectData.stage,
          decisionType: projectData.decisionType,
        },
      });
      
      console.log("SWOT analysis response:", response.data);
      set({
        analysis: response.data,
        loading: false,
      });
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      console.error('Error generating SWOT analysis:', err);
      // Extract meaningful error message
      let errorMessage = 'Không thể tạo phân tích SWOT. Vui lòng thử lại.';
      let errorType: 'api' | 'validation' | 'connection' | 'unknown' = 'unknown';
      if (err.response) {
        // Backend returned an error response
        errorMessage = err.response.data?.error || errorMessage;
        errorType = 'api';
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'Không thể kết nối với máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.';
        errorType = 'connection';
      }
      set({
        loading: false,
        error: errorMessage,
        errorType
      });
    }
  },

  generateStrategies: async () => {
    try {
      set({ 
        loading: true, 
        error: null,
        errorType: null,
        lastAction: 'strategies'
      });
      
      // Check if we have SWOT analysis data
      const analysis = get().analysis;
      const hasData = Object.values(analysis).some(items => items.length > 0);
      
      if (!hasData) {
        set({
          loading: false,
          error: 'Cần có dữ liệu phân tích SWOT trước khi tạo chiến lược.',
          errorType: 'validation'
        });
        return;
      }
      
      // Use the Next.js API route instead of directly calling Python backend
      const response = await axios.post('/api/swot-strategies', {
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        opportunities: analysis.opportunities,
        threats: analysis.threats,
      });
      console.log('Generated strategies:', response.data);
      set({
        strategies: response.data,
        loading: false,
      });
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      console.error('Error generating strategies:', err);
      // Extract meaningful error message
      let errorMessage = 'Không thể tạo chiến lược. Vui lòng thử lại.';
      let errorType: 'api' | 'validation' | 'connection' | 'unknown' = 'unknown';
      if (err.response) {
        // Backend returned an error response
        errorMessage = err.response.data?.error || errorMessage;
        errorType = 'api';
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'Không thể kết nối với máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.';
        errorType = 'connection';
      }
      set({
        loading: false,
        error: errorMessage,
        errorType
      });
    }
  },

  saveProject: async () => {
    try {
      set({ 
        loading: true, 
        error: null,
        errorType: null,
        lastAction: 'save'
      });
      
      const { project, analysis, strategies } = get();

      // Check for required fields
      if (!project.title || !project.description || !project.industry || !project.stage || !project.decisionType) {
        set({
          loading: false,
          error: 'Vui lòng điền đầy đủ thông tin dự án trước khi lưu.',
          errorType: 'validation'
        });
        
        handleError(new Error(), 'Vui lòng điền đầy đủ thông tin dự án trước khi lưu.');
        return null;
      }
      
      // Use the Next.js API route instead of directly calling Python backend
      const response = await axios.post('/api/projects', {
        project: {
          title: project.title,
          description: project.description,
          goals: project.goals,
          industry: project.industry,
          stage: project.stage,
          decision_type: project.decisionType,
        },
        analysis: {
          strengths: analysis.strengths,
          weaknesses: analysis.weaknesses,
          opportunities: analysis.opportunities,
          threats: analysis.threats,
        },
        strategies: strategies,
      });
      
      set({
        project: {
          ...project,
          id: response.data.id,
        },
        loading: false,
      });
      
      return response.data.id;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      console.error('Error saving project:', err);
      const { errorMessage, errorType } = handleError(err, 'Không thể lưu dự án. Vui lòng thử lại.');
      set({
        loading: false,
        error: errorMessage,
        errorType
      });
      return null;
    }
  },

  loadProject: async (id) => {
    try {
      set({ 
        loading: true, 
        error: null,
        errorType: null,
        lastAction: 'load'
      });
      
      // Use the Next.js API route instead of directly calling Python backend
      const response = await axios.get(`/api/projects/${id}`);
      const { project, analysis, strategies } = response.data;
      
      set({
        project: {
          id: project.id,
          title: project.title,
          description: project.description,
          goals: Array.isArray(project.goals) ? project.goals : [],
          industry: project.industry || '',
          stage: project.stage || '',
          decisionType: project.decision_type || '',
          createdAt: project.created_at ? new Date(project.created_at) : undefined,
          updatedAt: project.updated_at ? new Date(project.updated_at) : undefined,
        },
        analysis: {
          strengths: Array.isArray(analysis?.strengths) ? analysis.strengths : [],
          weaknesses: Array.isArray(analysis?.weaknesses) ? analysis.weaknesses : [],
          opportunities: Array.isArray(analysis?.opportunities) ? analysis.opportunities : [],
          threats: Array.isArray(analysis?.threats) ? analysis.threats : [],
        },
        strategies: {
          so: Array.isArray(strategies?.so) ? strategies.so : [],
          wo: Array.isArray(strategies?.wo) ? strategies.wo : [],
          st: Array.isArray(strategies?.st) ? strategies.st : [],
          wt: Array.isArray(strategies?.wt) ? strategies.wt : [],
        },
        loading: false,
      });
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      console.error('Error loading project:', err);
      // Extract meaningful error message
      let errorMessage = 'Không thể tải dự án. Vui lòng thử lại.';
      let errorType: 'api' | 'validation' | 'connection' | 'unknown' = 'unknown';
      if (err.response) {
        // Handle 404 specifically
        if (err.response.status === 404) {
          errorMessage = 'Không tìm thấy dự án. Dự án có thể đã bị xóa.';
        } else {
          // Other API errors
          errorMessage = err.response.data?.error || errorMessage;
        }
        errorType = 'api';
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'Không thể kết nối với máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.';
        errorType = 'connection';
      }
      set({
        loading: false,
        error: errorMessage,
        errorType
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
      errorType: null,
      lastAction: null,
    });
  },
}));

export default useSWOTStore;
