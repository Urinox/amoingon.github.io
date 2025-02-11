import { create } from "zustand";

const usePageLoaderStore = create((set) => ({
  isPageLoading: false,
  setPageLoading: (loading) => {
    set({ isPageLoading: loading });
  },
}));

export { usePageLoaderStore };
