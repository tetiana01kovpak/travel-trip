import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { ApiError, wrapHandler } from "@/lib/apiError";
import { updateBlogPostSchema } from "@/lib/validation/blogPost";
import { ensureUniqueSlug, slugify } from "@/lib/slug";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = wrapHandler(
  async (_req: Request, context: RouteContext<"/api/admin/blog/[id]">) => {
    const { id } = await context.params;
    await connectDB();
    const post = await BlogPost.findById(id).lean();
    if (!post) throw new ApiError(404, "Blog post not found");
    return NextResponse.json(post);
  }
);

export const PATCH = wrapHandler(
  async (req: Request, context: RouteContext<"/api/admin/blog/[id]">) => {
    const { id } = await context.params;
    const body = await req.json();
    const input = updateBlogPostSchema.parse(body);
    await connectDB();

    const post = await BlogPost.findById(id);
    if (!post) throw new ApiError(404, "Blog post not found");

    if (input.title && input.title !== post.title) {
      post.slug = await ensureUniqueSlug(BlogPost, slugify(input.title), id);
    }

    Object.assign(post, input);
    await post.save();

    return NextResponse.json(post);
  }
);

export const DELETE = wrapHandler(
  async (_req: Request, context: RouteContext<"/api/admin/blog/[id]">) => {
    const { id } = await context.params;
    await connectDB();

    const post = await BlogPost.findById(id);
    if (!post) throw new ApiError(404, "Blog post not found");

    await post.deleteOne();
    return NextResponse.json({ ok: true });
  }
);
