import Cookies from "js-cookie";

let accessToken = Cookies.get("accessToken") || null;

export const setAccessToken = (token, user) => {
  const value =
    typeof token === "object" && token !== null
      ? token.accessToken
      : token || null;

  accessToken = value;

  if (value) {
    Cookies.set("accessToken", value, { expires: 1 });
  } else {
    Cookies.remove("accessToken");
  }

  // Optionally persist user info for later use
  if (user) {
    try {
      localStorage.setItem("user", JSON.stringify(user));
    } catch {
      // ignore storage errors
    }
  }
};

export const getAccessToken = () => accessToken || Cookies.get("accessToken");
