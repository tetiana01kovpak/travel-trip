import { NextResponse } from "next/server";
import { uploadImageFromUrl } from "@/lib/cloudinary";
import { ApiError, wrapHandler } from "@/lib/apiError";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const uploadSchema = z.object({
  imageUrl: z.string().min(1, "imageUrl is required"),
});

export const POST = wrapHandler(async (req: Request) => {
  const body = await req.json();
  const { imageUrl } = uploadSchema.parse(body);

  if (!imageUrl) {
    throw new ApiError(400, "imageUrl is required");
  }

  const uploaded = await uploadImageFromUrl(imageUrl);
  return NextResponse.json(uploaded);
});
