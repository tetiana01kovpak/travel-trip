import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { ApiError, wrapHandler } from "@/lib/apiError";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = wrapHandler(
  async (_req: Request, context: RouteContext<"/api/blog/[slug]">) => {
    const { slug } = await context.params;
    await connectDB();

    const post = await BlogPost.findOne({ slug, published: true }).lean();
    if (!post) {
      throw new ApiError(404, "Blog post not found");
    }

    return NextResponse.json(post);
  }
);
