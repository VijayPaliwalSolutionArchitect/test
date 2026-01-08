import { create } from 'zustand';
import * as api from '../services/api';

export const useAppStore = create((set, get) => ({
  // State
  points: [],
  radarItems: [],
  architectures: [],
  risks: [],
  opportunities: [],
  roadmapItems: [],
  stats: null,
  loading: false,
  error: null,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Emergent Points
  fetchPoints: async (domain, maturity) => {
    set({ loading: true, error: null });
    try {
      const points = await api.getPoints(domain, maturity);
      set({ points, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addBulkPoints: async (points) => {
    set({ loading: true, error: null });
    try {
      const result = await api.createBulkPoints(points);
      const currentPoints = get().points;
      set({ points: [...result.points, ...currentPoints], loading: false });
      return result;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deletePoint: async (pointId) => {
    try {
      await api.deletePoint(pointId);
      const points = get().points.filter(p => p.id !== pointId);
      set({ points });
    } catch (error) {
      set({ error: error.message });
    }
  },

  // Tech Radar
  fetchRadar: async () => {
    set({ loading: true, error: null });
    try {
      const radarItems = await api.getRadar();
      set({ radarItems, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  generateRadar: async () => {
    set({ loading: true, error: null });
    try {
      const result = await api.generateRadar();
      set({ radarItems: result.items, loading: false });
      return result;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Architectures
  fetchArchitectures: async () => {
    set({ loading: true, error: null });
    try {
      const architectures = await api.getArchitectures();
      set({ architectures, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  generateArchitectures: async () => {
    set({ loading: true, error: null });
    try {
      const result = await api.generateArchitectures();
      set({ architectures: result.architectures, loading: false });
      return result;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Risks & Opportunities
  fetchRisks: async () => {
    set({ loading: true, error: null });
    try {
      const result = await api.getRisks();
      set({ risks: result.risks, opportunities: result.opportunities, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  generateRisks: async () => {
    set({ loading: true, error: null });
    try {
      const result = await api.generateRisks();
      set({ risks: result.risks, opportunities: result.opportunities, loading: false });
      return result;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Roadmap
  fetchRoadmap: async () => {
    set({ loading: true, error: null });
    try {
      const roadmapItems = await api.getRoadmap();
      set({ roadmapItems, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  generateRoadmap: async () => {
    set({ loading: true, error: null });
    try {
      const result = await api.generateRoadmap();
      set({ roadmapItems: result.roadmap, loading: false });
      return result;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Dashboard
  fetchStats: async () => {
    try {
      const stats = await api.getDashboardStats();
      set({ stats });
    } catch (error) {
      set({ error: error.message });
    }
  },

  // Generate All
  generateAll: async () => {
    set({ loading: true, error: null });
    try {
      const result = await api.generateAllOutputs();
      // Refresh all data
      await Promise.all([
        get().fetchRadar(),
        get().fetchArchitectures(),
        get().fetchRisks(),
        get().fetchRoadmap(),
        get().fetchStats()
      ]);
      set({ loading: false });
      return result;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));
