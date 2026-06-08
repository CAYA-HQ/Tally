export const getUserId = (req: any) => {
  if (!req.user?.id) {
    const error = new Error("Unauthorized") as any;
    error.statusCode = 401;
    throw error;
  }

  return req.user.id;
};