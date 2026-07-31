import { v2 as cloudinary } from "cloudinary";

let configured = false;

function ensureConfigured() {
  if (configured) return;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  configured = true;
}

export interface UploadedImage {
  url: string;
  publicId: string;
  width: number;
  height: number;
}

/**
 * Uploads a remote image (e.g. a Pixabay hit URL) directly to Cloudinary.
 * Cloudinary fetches the remote URL server-side — no manual download/buffer step needed.
 */
export async function uploadImageFromUrl(
  url: string,
  folder: string = process.env.CLOUDINARY_FOLDER || "travel-trip"
): Promise<UploadedImage> {
  ensureConfigured();
  const result = await cloudinary.uploader.upload(url, { folder });
  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
  };
}

export default cloudinary;
