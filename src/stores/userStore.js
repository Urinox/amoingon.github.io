import { create } from "zustand";

const checkSixMonthsResidency = (startDateOfResidency) => {
  const startDate = new Date(startDateOfResidency);
  const currentDate = new Date();

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(currentDate.getMonth() - 6);

  return startDate <= sixMonthsAgo;
};

const defaultUser = {
  id: "",
  fullname: "",
  birthdate: null,
  birthplace: "",
  startDateOfResidency: null,
  email: "",
  role: null,
  isValidResident: false,
};

const useUserStore = create((set) => ({
  isLoading: true,
  isAuthenticated: false,
  ...defaultUser,
  onLogin: (user) => {
    const isValidResident = checkSixMonthsResidency(user.startDateOfResidency);
    console.log("isValidResident", isValidResident, user.startDateOfResidency);
    set((state) => ({
      ...state,
      ...user,
      isLoading: false,
      isAuthenticated: true,
      isValidResident,
    }));
  },
  onLogout: () => {
    set(() => ({
      ...defaultUser,
      isLoading: false,
      isAuthenticated: false,
    }));
  },
  setLoading: (loading) => {
    set({ isLoading: loading });
  },
}));

export { useUserStore };
