import mongoose, { type InferSchemaType } from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, enum: ["salon", "eatery", "event"], required: true, index: true },
    area: { type: String, required: true, trim: true, index: true },
    address: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    priceRange: { type: String, enum: ["$", "$$", "$$$"], default: "$$" },
    openingHours: { type: String, default: "" },
    capacity: { type: Number, min: 1, default: 20 },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export type ListingDocument = InferSchemaType<typeof listingSchema> & { _id: mongoose.Types.ObjectId };

export const ListingModel = mongoose.model("Listing", listingSchema);
