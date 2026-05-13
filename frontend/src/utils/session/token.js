let accessToken = null;

export const setAccessToken = (token) => {
  if (typeof token === "object" && token !== null) {
    accessToken = token.accessToken;
  } else {
    accessToken = token;
  }
};

export const getAccessToken = () => accessToken;