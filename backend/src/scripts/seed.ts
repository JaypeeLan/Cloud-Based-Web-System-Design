import bcrypt from "bcryptjs";
import { connectToDatabase } from "../config/db.js";
import { ListingModel } from "../models/Listing.js";
import { ReservationModel } from "../models/Reservation.js";
import { UserModel } from "../models/User.js";

const seed = async () => {
  await connectToDatabase();

  await Promise.all([
    ReservationModel.deleteMany({}),
    ListingModel.deleteMany({}),
    UserModel.deleteMany({})
  ]);

  const passwordHash = await bcrypt.hash("Password123!", 12);

  const users = await UserModel.insertMany([
    {
      name: "Aisha Bello",
      email: "owner@localspot.com",
      passwordHash,
      role: "owner",
      location: "Lekki"
    },
    {
      name: "Kunle Ajayi",
      email: "customer@localspot.com",
      passwordHash,
      role: "customer",
      location: "Yaba"
    },
    {
      name: "Admin User",
      email: "admin@localspot.com",
      passwordHash,
      role: "admin",
      location: "Ikeja"
    }
  ]);

  const owner = users.find((user) => user.role === "owner");
  const customer = users.find((user) => user.role === "customer");

  if (!owner || !customer) {
    throw new Error("Seed users not created");
  }

  const listings = await ListingModel.insertMany([
    {
      ownerId: owner._id,
      name: "Glow Lounge Salon",
      category: "salon",
      area: "Lekki",
      address: "12 Admiralty Way, Lekki",
      description: "Premium beauty and grooming services",
      priceRange: "$$",
      openingHours: "Mon-Sat 9:00 AM - 8:00 PM",
      capacity: 12,
      active: true
    },
    {
      ownerId: owner._id,
      name: "Savanna Bistro",
      category: "eatery",
      area: "Yaba",
      address: "43 Herbert Macaulay Road, Yaba",
      description: "Contemporary African dining with reservations",
      priceRange: "$$$",
      openingHours: "Daily 11:00 AM - 11:00 PM",
      capacity: 40,
      active: true
    },
    {
      ownerId: owner._id,
      name: "Coastal Live Nights",
      category: "event",
      area: "Victoria Island",
      address: "8 Ozumba Mbadiwe Avenue, VI",
      description: "Live music and curated city events every weekend",
      priceRange: "$$",
      openingHours: "Fri-Sun 6:00 PM - 1:00 AM",
      capacity: 120,
      active: true
    }
  ]);

  await ReservationModel.insertMany([
    {
      listingId: listings[0]._id,
      customerId: customer._id,
      scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 24),
      partySize: 1,
      status: "confirmed",
      note: "Hair wash + styling"
    },
    {
      listingId: listings[1]._id,
      customerId: customer._id,
      scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 48),
      partySize: 3,
      status: "pending",
      note: "Birthday dinner"
    }
  ]);

  console.log("Seed completed successfully.");
  console.log("Demo login: customer@localspot.com / Password123!");
  process.exit(0);
};

seed().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});
