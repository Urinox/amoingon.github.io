import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  addNewBusiness,
  deleteBusiness,
  getAllBusinesses,
} from "../services/businesses";

const useBusinessesStore = create(
  persist(
    (set, get) => ({
      businesses: [],
      fetchBusinesses: async () => {
        const response = await getAllBusinesses();
        set({ businesses: response });
      },
      addNewBusiness: async (request) => {
        await addNewBusiness(request);
        set((state) => ({
          businesses: [request, ...state.businesses],
        }));
      },
      deleteBusiness: async (id) => {
        await deleteBusiness(id);
        set((state) => ({
          businesses: state.businesses.filter((business) => business.id !== id),
        }));
      },
      clear: () => {
        set({ businesses: [] });
      },
    }),
    {
      name: "requests", // unique name
    }
  )
);

export { useBusinessesStore };
