import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  getRequestsByUserId,
  updateRequest,
  getAllRequests,
} from "../services/form-request";

const useRequestsStore = create(
  persist(
    (set) => ({
      requests: [],
      fetchRequests: async (userId) => {
        const response = await getRequestsByUserId(userId);
        set({ requests: response });
      },
      fetchAllRequests: async (status) => {
        const response = await getAllRequests(status);
        set({ requests: response });
      },
      addNewRequest: (request) => {
        set((state) => ({
          requests: [request, ...state.requests],
        }));
      },
      updateRequest: async (request) => {
        await updateRequest(request);
        set((state) => ({
          requests: state.requests.map((req) =>
            req.id === request.id ? { ...req, ...request } : req
          ),
        }));
      },
      clear: () => {
        set({ requests: [] });
      },
    }),
    {
      name: "requests", // unique name
    }
  )
);

export { useRequestsStore };
