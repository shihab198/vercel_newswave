import { create } from 'zustand';
import api from '../utils/api';

const useNewsStore = create((set, get) => ({
  news: [],
  topNews: [],
  currentNews: null,
  relatedNews: [],
  myNews: [],
  pagination: null,
  loading: false,
  error: null,
  category: 'All',
  search: '',

  fetchNews: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const { category, search, page = 1 } = params;
      const query = new URLSearchParams({ page, limit: 9 });
      if (category && category !== 'All') query.append('category', category);
      if (search) query.append('search', search);

      const { data } = await api.get(`/news?${query}`);
      set({ news: data.news, pagination: data.pagination, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch news', loading: false });
    }
  },

  fetchTopNews: async () => {
    try {
      const { data } = await api.get('/news/top');
      set({ topNews: data.news });
    } catch (err) {
      console.error('Failed to fetch top news', err);
    }
  },

  fetchSingleNews: async (slug) => {
    set({ loading: true, error: null, currentNews: null });
    try {
      const { data } = await api.get(`/news/${slug}`);
      set({ currentNews: data.news, relatedNews: data.related, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'News not found', loading: false });
    }
  },

  fetchMyNews: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/news/my');
      set({ myNews: data.news, loading: false });
    } catch (err) {
      set({ loading: false });
    }
  },

  createNews: async (newsData) => {
    set({ loading: true });
    try {
      const { data } = await api.post('/news', newsData);
      set((state) => ({ myNews: [data.news, ...state.myNews], loading: false }));
      return { success: true, news: data.news };
    } catch (err) {
      set({ loading: false });
      return { success: false, message: err.response?.data?.message || 'Failed to create news' };
    }
  },

  updateNews: async (id, newsData) => {
    set({ loading: true });
    try {
      const { data } = await api.put(`/news/${id}`, newsData);
      set((state) => ({
        myNews: state.myNews.map(n => n._id === id ? data.news : n),
        loading: false
      }));
      return { success: true, news: data.news };
    } catch (err) {
      set({ loading: false });
      return { success: false, message: err.response?.data?.message || 'Failed to update news' };
    }
  },

  deleteNews: async (id) => {
    try {
      await api.delete(`/news/${id}`);
      set((state) => ({ myNews: state.myNews.filter(n => n._id !== id) }));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to delete news' };
    }
  },
}));

export default useNewsStore;