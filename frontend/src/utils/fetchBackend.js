import { toast } from "react-toastify";
import { useReportStore, useUserStore } from "../utils/zustand";
import api from '../utils/api'


// getting notification
export const fetchNotifications = async (setNotification, setCursor, setHasMore, setLoading)=>{
    setLoading(true)
    const res = await api.get('/user/notification', {
        params: {
            cursor
        }
    })
    
    const notification = res.data.notification
    const nextCursor = res.data.nextCursor
    const hasMore = res.data.hasMore
    setNotification((prev)=>[
        ...prev, ...notification
    ])
    setCursor(nextCursor)
    setHasMore(hasMore)
    setLoading(false)
}

// Getting users
export const getReport = async () => {
  try {
    const res = await api.get("/user/reports");

    useReportStore.getState().setReport(res.data);
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to fetch reports");
  }
};

// Getting users
export const getUser = async () => {
    console.log("FETCH USER");
  try {
    const res = await api.get("/user");
    const user = res.data;

    useUserStore.getState().setUser(user);
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to fetch user");
  }
};

