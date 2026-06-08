import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAccessTokenStore, useNotificationStore }
from "../utils/zustand";
import { getUser } from "../utils/fetchBackend";


export const UserProvider = () => {
  const token = useAccessTokenStore(
    (state) => state.accessToken
  );

  useEffect(() => {
    if (!token) return;

    getUser();
  }, [token]);

  return <Outlet />;
};