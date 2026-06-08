import { toast } from "react-toastify";
import { useReportStore, useUserStore, useNotificationStore } from "../utils/zustand";
import api from "../utils/api";
import { socket, connectSocket, disconnectSocket } from "./ioSocket";


// getting notification
export const fetchNotifications = async (cursor = null, data) => {
  const {
    setNotifications,
    addNotification,
    setNextCursor,
    notifications,
    setHasMore,
    hasMore,
    setLoading
  } = data

  try {
    const response = await api.get("/user/notification", {
      params: cursor ? { cursor } : {},
    });
    const fetched = response.data.notifications || [];

    cursor ? addNotification(fetched) : setNotifications(fetched)

    setNextCursor(response.data.nextCursor || null);
    setHasMore(response.data.hasMore ?? false);
    
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
  }
  finally {
    setLoading(false);
  }
};

// setting notifications as read
export const markRead = async ()=>{
  try{

    const res = await api.put("/user/notification")

    const notifs = res.data.notifications
    console.log(notifs)

      useNotificationStore
      .getState()
      .setNotifications(notifs);

  }catch(err){
    console.log(err)
  }
}

// Getting users
export const getReport = async () => {
  try {
    const res = await api.get("/user/reports");

    useReportStore.getState().setReport(res.data);
  } catch (err) {
    if(err.response.status === 404) {
      toast.info(err.response?.data?.message || "Failed to fetch reports")

    }else{
    toast.error(err.response?.data?.message || "Failed to fetch reports");
  }
  }
};

// Getting users
export const getUser = async () => {
   console.log("Fetching user...");
  try {
    const res = await api.get("/user");
    const user = res.data?.payload ?? res.data?.user ?? res.data;
    useUserStore.getState().setUser(user);
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to fetch user");
  }
};
