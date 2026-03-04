import { Router } from "express";
import {
  createListing,
  getListingById,
  listListings,
  myListings,
  updateListing
} from "../controllers/listingController.js";
import { requireAuth } from "../middleware/auth.js";

export const listingRouter = Router();

listingRouter.get("/", listListings);
listingRouter.get("/mine", requireAuth, myListings);
listingRouter.get("/:listingId", getListingById);
listingRouter.post("/", requireAuth, createListing);
listingRouter.patch("/:listingId", requireAuth, updateListing);
