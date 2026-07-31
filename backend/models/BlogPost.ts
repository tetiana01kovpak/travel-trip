import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const BlogPostSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    excerpt: { type: String, default: "" },
    content: { type: String, required: true },
    coverImageUrl: { type: String, default: "" },
    coverImagePublicId: { type: String, default: "" },
    relatedCountry: { type: Schema.Types.ObjectId, ref: "Country" },
    relatedTown: { type: Schema.Types.ObjectId, ref: "Town" },
    author: { type: String, default: "Admin" },
    published: { type: Boolean, default: true, index: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export type BlogPostDoc = InferSchemaType<typeof BlogPostSchema>;

const BlogPost: Model<BlogPostDoc> =
  (mongoose.models.BlogPost as Model<BlogPostDoc>) ||
  mongoose.model<BlogPostDoc>("BlogPost", BlogPostSchema);

export default BlogPost;
