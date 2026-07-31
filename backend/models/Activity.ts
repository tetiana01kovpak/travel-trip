import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const ActivitySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    town: {
      type: Schema.Types.ObjectId,
      ref: "Town",
      required: true,
      index: true,
    },
    // Denormalized for cheap filtering by country without a join.
    country: {
      type: Schema.Types.ObjectId,
      ref: "Country",
      required: true,
      index: true,
    },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "USD" },
    durationMinutes: { type: Number },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

ActivitySchema.index({ name: "text", description: "text", tags: "text" });

export type ActivityDoc = InferSchemaType<typeof ActivitySchema>;

const Activity: Model<ActivityDoc> =
  (mongoose.models.Activity as Model<ActivityDoc>) ||
  mongoose.model<ActivityDoc>("Activity", ActivitySchema);

export default Activity;
