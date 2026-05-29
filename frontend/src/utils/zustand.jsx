import {create} from 'zustand';
import {persist} from "zustand/middleware"

// import { create } from "zustand";
// import api from "../utils/api";

// export const useUserStore = create((set) => ({
//   user: null,
//   loading: false,

//   fetchUser: async () => {
//     set({ loading: true });

//     try {
//       const res = await api.get("/user");
//       set({ user: res.data });
//     } catch (err) {
//       console.error(err);
//     } finally {
//       set({ loading: false });
//     }
//   },
// }));

export const useNotificationStore = create(persist((set) => ({
  notifications: [],

  setNotifications: (n) => set({ notifications: n }),

  addNotification: (n) =>
    set((state) => ({
      notifications: [...state.notifications, n],
    })),
}),
{
  name: 'notifications'
}
))

export const useReportStore = create(persist((set)=>({
  reports: [],

  setReport: (n) => set ({reports: n}),

  addReport: (n) => set((state) =>({
    reports: [...state.reports, n]
  })),

}),
  {
    name: 'reports'
  }
))

export const useUserStore = create(persist((set)=>({
  user: null,

  setUser: (n) => set ({user: n}),

  logout: (n) => set({user: null}),

}),
  {
    name: 'user-storage'
  }
))