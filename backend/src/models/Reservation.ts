import mongoose, { type InferSchemaType } from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    listingId: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true, index: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    scheduledFor: { type: Date, required: true, index: true },
    partySize: { type: Number, min: 1, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending"
    },
    note: { type: String, default: "" }
  },
  { timestamps: true }
);

export type ReservationDocument = InferSchemaType<typeof reservationSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const ReservationModel = mongoose.model("Reservation", reservationSchema);
