import Cookies from "js-cookie";
import { connectSocket, disconnectSocket } from "../ioSocket";

let accessToken = Cookies.get("accessToken") || null;

export const setAccessToken = (token, user) => {
  const value =
    typeof token === "object" && token !== null
      ? token.accessToken
      : token || null;

  accessToken = value;

  if (value) {
    Cookies.set("accessToken", value, { expires: 1 });
    connectSocket(value);
  } else {
    Cookies.remove("accessToken");
    disconnectSocket();
  }

  // Optionally persist user info for later use
  if (user) {
    try {
      localStorage.setItem("user", JSON.stringify(user));
    } catch {
      console.warn("Failed to save user info to localStorage");
    }
  }
};

export const getAccessToken = () => accessToken || Cookies.get("accessToken");