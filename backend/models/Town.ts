import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const TownSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    country: {
      type: Schema.Types.ObjectId,
      ref: "Country",
      required: true,
      index: true,
    },
    description: { type: String, default: "" },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    imageUrl: { type: String, default: "" },
    imagePublicId: { type: String, default: "" },
  },
  { timestamps: true }
);

export type TownDoc = InferSchemaType<typeof TownSchema>;

const Town: Model<TownDoc> =
  (mongoose.models.Town as Model<TownDoc>) ||
  mongoose.model<TownDoc>("Town", TownSchema);

export default Town;
