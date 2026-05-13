import { UAParser } from "ua-parser-js";

export const buildMetaData = (req: any) => {
  const ip =
    req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
    req.socket.remoteAddress;

  const userAgent = req.headers["user-agent"] || "";

  const parser = new UAParser(userAgent);

  return {ip, parser};
};