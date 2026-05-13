import { User } from "../model/User";
import type { CreateUserInput } from "../model/validate.user";
import type {UAParser} from "ua-parser-js";

// create user
export const createUser = async (data: CreateUserInput) => {
  const existingUser = await User.findOne({ email: data.email });
  if(existingUser) {
    throw new Error("User already exists");
  }
  return await User.create(data);
};

export const getUserById = async (id: string) => {
  return await User.findById(id);
};

export const getUserByEmail = async (email: string) => {
  return await User.findOne({ email }).select("+password");
};

export const updateUser = async (id: string, data: Partial<CreateUserInput>) => {
  return await User.findByIdAndUpdate(id, data, { new: true });
};


export const metaDataInfo = async (ip: any, parser: UAParser) => {
  const deviceInfo = parser.getResult();

  const isPrivateIP = (ip: string) =>
  ip.startsWith("127.") ||
  ip.startsWith("192.168.") ||
  ip.startsWith("10.") ||
  ip === "::1";

  let userLocation: any = {};

  if (isPrivateIP(ip)) {
  userLocation = {
    country_name: "Local",
    city: "Local",
  };
  } else {
    try {
      const geoResponse = await fetch(`https://ipapi.co/${ip}/json`, {
        signal: AbortSignal.timeout(3000),
      });
      userLocation = await geoResponse.json();
    } catch {
      userLocation = {};
    }
  }

  return {
  session: {
    ip,
    country: userLocation.country_name || "Unknown",
    city: userLocation.city || "Unknown",
    device: deviceInfo.device?.model || "Unknown",
    deviceType: deviceInfo.device?.type || "Unknown",
    os: deviceInfo.os?.name || "Unknown",
    browser: deviceInfo.browser?.name || "Unknown",
  },
  fingerprint: {
    ua: deviceInfo.ua,
    language: deviceInfo.cpu?.architecture || "Unknown",
  },
};
};

export const deleteFromMetaData = async ( userId: string, dataId: any | string , cat: string ) => {

  return User.findByIdAndUpdate( userId, {
      $pull: {
        [`metadata.${cat}`]: Array.isArray(dataId)
        ? { $in: dataId }
        : dataId
      }
    },
    {
      new: true
    }
  );
};

export const addToMetaData = async ( userId: string, data: any | string , cat: string) => {

  return User.findByIdAndUpdate( userId, {
      $set: {
        [`metadata.${cat}`]: data
      }
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

export const newMetaData = async ( userId: string, data: any | string , cat: string) => {

  return User.findByIdAndUpdate( userId, {
      $addToSet: {
        [`metadata.${cat}`]: data
      }
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

export const deleteAMetaData = async ( userId: string, cat: string ) => {

  return User.findByIdAndUpdate( userId, {
      $unset: {
        [`metadata.${cat}`]: ''
      }
    },
    {
      new: true
    }
  );
};

