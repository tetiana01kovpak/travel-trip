import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const CountrySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    imagePublicId: { type: String, default: "" },
  },
  { timestamps: true }
);

export type CountryDoc = InferSchemaType<typeof CountrySchema>;

const Country: Model<CountryDoc> =
  (mongoose.models.Country as Model<CountryDoc>) ||
  mongoose.model<CountryDoc>("Country", CountrySchema);

export default Country;
