let accessToken = null;

export const setAccessToken = (token, user) => {
  accessToken = token;
  if (user?.id) localStorage.setItem("userId", user.id);
};

export const getAccessToken = () => accessToken;

export const getUserId = () => localStorage.getItem("userId");