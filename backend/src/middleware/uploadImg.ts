import multer from "multer";
import cloudinary from "../config/cloudinary";
import { UploadApiResponse } from "cloudinary";

export const uploadToCloudinary = (
  buffer: Buffer, folder: string = "avatars"
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });
};
export const upload = multer({
  storage: multer.memoryStorage(),
});