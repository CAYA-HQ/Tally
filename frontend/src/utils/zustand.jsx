import {create} from 'zustand';
import {persist} from "zustand/middleware"
import Cookies from "js-cookie";
import { connectSocket, disconnectSocket } from "./ioSocket";

export const useNotificationStore = create(persist((set) => ({
  notifications: [],

  seenNotification: true,

  setNotifications: (n) => set({ notifications: n }),

  addNotification: (n) =>
    set((state) => ({
      notifications: [...n, ...state.notifications],
  })),

  setSeenNotification: (n) => set({seenNotification: n}),

}),
  { name: 'notifications' }
))


export const useReportStore = create(persist((set)=>({
  reports: [],

  setReport: (n) => set ({reports: n}),

  addReport: (n) => set((state) =>({
    reports: [...state.reports, n]
  })),

}),
  { name: 'reports'}
))


export const useUserStore = create(persist((set)=>({
  user: null,

  setUser: (n) => set ({user: n.payload}),

  logout: (n) => set({user: null}),

}),
  {
    name: 'user'
  }
))

export const useAccessTokenStore = create(persist((set)=>({
  accessToken: Cookies.get("accessToken") || null,

  setAccessToken: (token) => {
    const value =
      typeof token === "object" && token !== null
        ? token.accessToken
        : token || null;

    if (value) {
      Cookies.set("accessToken", value, { expires: 1 });
      connectSocket(value);
    } else {
      Cookies.remove("accessToken");
      disconnectSocket();
    }

    set({
      accessToken: value,
    });
  },

}),
 { name: 'accessToken'}
))