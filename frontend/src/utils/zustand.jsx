import {create} from 'zustand';

export const useNotificationStore = create((set) => ({
  notifications: [],

  setNotifications: (n) => set({ notifications: n }),

  addNotification: (n) =>
    set((state) => ({
      notifications: [n, ...state.notifications],
    })),
}));