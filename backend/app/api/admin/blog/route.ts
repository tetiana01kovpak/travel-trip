import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { wrapHandler } from "@/lib/apiError";
import { createBlogPostSchema } from "@/lib/validation/blogPost";
import { ensureUniqueSlug, slugify } from "@/lib/slug";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = wrapHandler(async () => {
  await connectDB();
  const items = await BlogPost.find().sort({ publishedAt: -1 }).lean();
  return NextResponse.json({ items });
});

export const POST = wrapHandler(async (req: Request) => {
  const body = await req.json();
  const input = createBlogPostSchema.parse(body);
  await connectDB();

  const slug = await ensureUniqueSlug(BlogPost, slugify(input.title));
  const post = await BlogPost.create({ ...input, slug });

  return NextResponse.json(post, { status: 201 });
});
