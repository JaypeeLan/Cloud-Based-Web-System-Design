import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { z } from "zod";
import { ListingModel } from "../models/Listing.js";
import { success } from "../utils/apiResponse.js";
import { HttpError } from "../utils/httpError.js";
import { paginate, paginationSchema } from "../utils/pagination.js";

const listingSchema = z.object({
  name: z.string().min(2),
  category: z.enum(["salon", "eatery", "event"]),
  area: z.string().min(2),
  address: z.string().min(4),
  description: z.string().optional(),
  priceRange: z.enum(["$", "$$", "$$$"]).optional(),
  openingHours: z.string().optional(),
  capacity: z.coerce.number().min(1).optional(),
  active: z.boolean().optional()
});

const searchSchema = z
  .object({
    area: z.string().optional(),
    category: z.enum(["salon", "eatery", "event"]).optional(),
    q: z.string().optional()
  })
  .merge(paginationSchema);

export const createListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = listingSchema.parse(req.body);
    const listing = await ListingModel.create({
      ...payload,
      description: payload.description ?? "",
      openingHours: payload.openingHours ?? "",
      ownerId: req.auth?.userId
    });
    res.status(201).json(success(listing, "Listing created"));
  } catch (error) {
    next(error);
  }
};

export const listListings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = searchSchema.parse(req.query);
    const filters: Record<string, unknown> = { active: true };

    if (query.area) {
      filters.area = new RegExp(query.area, "i");
    }

    if (query.category) {
      filters.category = query.category;
    }

    if (query.q) {
      filters.$or = [
        { name: new RegExp(query.q, "i") },
        { description: new RegExp(query.q, "i") },
        { address: new RegExp(query.q, "i") }
      ];
    }

    const skip = (query.page - 1) * query.limit;
    const [listings, total] = await Promise.all([
      ListingModel.find(filters).sort({ createdAt: -1 }).skip(skip).limit(query.limit),
      ListingModel.countDocuments(filters)
    ]);

    res.json(success(paginate(listings, total, query.page, query.limit)));
  } catch (error) {
    next(error);
  }
};

export const myListings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    const filters = { ownerId: req.auth?.userId };
    const skip = (page - 1) * limit;

    const [listings, total] = await Promise.all([
      ListingModel.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ListingModel.countDocuments(filters)
    ]);

    res.json(success(paginate(listings, total, page, limit)));
  } catch (error) {
    next(error);
  }
};

export const getListingById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!mongoose.isValidObjectId(req.params.listingId)) {
      throw new HttpError(400, "Invalid listing ID");
    }

    const listing = await ListingModel.findOne({ _id: req.params.listingId, active: true });

    if (!listing) {
      throw new HttpError(404, "Listing not found");
    }

    res.json(success(listing));
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = listingSchema.partial().parse(req.body);
    const listing = await ListingModel.findOneAndUpdate(
      { _id: req.params.listingId, ownerId: req.auth?.userId },
      payload,
      { new: true }
    );

    if (!listing) {
      throw new HttpError(404, "Listing not found");
    }

    res.json(success(listing, "Listing updated"));
  } catch (error) {
    next(error);
  }
};
