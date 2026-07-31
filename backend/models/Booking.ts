import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const BookingSchema = new Schema(
  {
    ticketCode: { type: String, required: true, unique: true, index: true },
    activity: { type: Schema.Types.ObjectId, ref: "Activity", required: true },
    town: { type: Schema.Types.ObjectId, ref: "Town", required: true },
    country: { type: Schema.Types.ObjectId, ref: "Country", required: true },
    // Denormalized copy taken at booking time so the ticket can always be
    // rendered even if the Activity/Town/Country is later edited or deleted.
    snapshot: {
      activityName: { type: String, required: true },
      activitySlug: { type: String, required: true },
      activityDescription: { type: String, default: "" },
      townName: { type: String, required: true },
      townSlug: { type: String, required: true },
      countryName: { type: String, required: true },
      countrySlug: { type: String, required: true },
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
    },
    traveler: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    travelDate: { type: Date, required: true },
    numberOfTravelers: { type: Number, required: true, min: 1 },
    pricePerPerson: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    // Simulated checkout only — never persist full card number, expiry, or CVV.
    payment: {
      cardholderName: { type: String, required: true },
      cardLast4: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
      index: true,
    },
  },
  { timestamps: true }
);

export type BookingDoc = InferSchemaType<typeof BookingSchema>;

const Booking: Model<BookingDoc> =
  (mongoose.models.Booking as Model<BookingDoc>) ||
  mongoose.model<BookingDoc>("Booking", BookingSchema);

export default Booking;
