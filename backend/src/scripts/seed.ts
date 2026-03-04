import bcrypt from "bcryptjs";
import { connectToDatabase } from "../config/db.js";
import { ListingModel } from "../models/Listing.js";
import { ReservationModel } from "../models/Reservation.js";
import { UserModel } from "../models/User.js";

type ListingCategory = "salon" | "eatery" | "event";
type ReservationStatus = "pending" | "confirmed" | "cancelled" | "completed";

const AREAS = [
  "Lekki",
  "Yaba",
  "Ikeja",
  "Victoria Island",
  "Surulere",
  "Ajah",
  "Maryland",
  "Ikoyi",
  "Gbagada",
  "Festac",
  "Wuse",
  "Maitama",
  "Gwarinpa",
  "Port Harcourt GRA",
  "Bodija"
];

const OWNER_NAMES = [
  "Aisha Bello",
  "Tunde Akin",
  "Ifeoma Okafor",
  "Musa Danjuma",
  "Amaka Eze",
  "Kemi Lawson",
  "Bolaji Femi",
  "Zainab Ahmed",
  "David Nwosu",
  "Grace Abiola"
];

const CUSTOMER_NAMES = [
  "Kunle Ajayi",
  "Halima Sani",
  "Victor Umeh",
  "Chiamaka Obi",
  "Seyi Thomas",
  "Mary Johnson",
  "Farouk Aliyu",
  "Ebuka Chinedu",
  "Joy Ene",
  "Tosin Ade"
];

const SALON_PREFIXES = ["Glow", "Radiant", "Silk", "Crown", "Velvet", "Luxe", "Prime", "Signature"];
const EATERY_PREFIXES = ["Savanna", "Urban", "Harvest", "Spice", "Coastline", "Fusion", "Palm", "Riverside"];
const EVENT_PREFIXES = ["Pulse", "Coastal", "Midnight", "Sunset", "Skyline", "Vibe", "Live", "Arena"];

const randomItem = <T>(items: T[]) => items[Math.floor(Math.random() * items.length)];
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const buildListingName = (category: ListingCategory) => {
  if (category === "salon") {
    return `${randomItem(SALON_PREFIXES)} ${randomItem(["Salon", "Studio", "Beauty Lounge"])}`;
  }

  if (category === "eatery") {
    return `${randomItem(EATERY_PREFIXES)} ${randomItem(["Bistro", "Kitchen", "Grill", "Restaurant"])}`;
  }

  return `${randomItem(EVENT_PREFIXES)} ${randomItem(["Nights", "Hall", "Experience", "Fest"])}`;
};

const buildDescription = (category: ListingCategory) => {
  if (category === "salon") {
    return "Professional grooming and beauty services with online reservations.";
  }
  if (category === "eatery") {
    return "Curated menu and premium dining experience with easy booking.";
  }
  return "Live entertainment and curated social events for urban audiences.";
};

const buildOpeningHours = (category: ListingCategory) => {
  if (category === "event") {
    return "Fri-Sun 6:00 PM - 2:00 AM";
  }
  if (category === "eatery") {
    return "Daily 10:00 AM - 11:30 PM";
  }
  return "Mon-Sat 9:00 AM - 8:00 PM";
};

const reservationStatuses: ReservationStatus[] = ["pending", "confirmed", "cancelled", "completed"];

const seed = async () => {
  await connectToDatabase();

  const ownerCount = Number(process.env.SEED_OWNERS ?? "60");
  const customerCount = Number(process.env.SEED_CUSTOMERS ?? "450");
  const listingsPerOwner = Number(process.env.SEED_LISTINGS_PER_OWNER ?? "6");
  const reservationCount = Number(process.env.SEED_RESERVATIONS ?? "5000");
  const resetCollections = process.env.SEED_RESET === "true";

  if (resetCollections) {
    await Promise.all([
      ReservationModel.deleteMany({}),
      ListingModel.deleteMany({}),
      UserModel.deleteMany({})
    ]);
  }

  const passwordHash = await bcrypt.hash("Password123!", 12);

  const ownersPayload = Array.from({ length: ownerCount }, (_, index) => ({
    name: `${randomItem(OWNER_NAMES)} ${index + 1}`,
    email: `owner${Date.now()}_${index + 1}@localspot.com`,
    passwordHash,
    role: "owner" as const,
    location: randomItem(AREAS)
  }));

  const customersPayload = Array.from({ length: customerCount }, (_, index) => ({
    name: `${randomItem(CUSTOMER_NAMES)} ${index + 1}`,
    email: `customer${Date.now()}_${index + 1}@localspot.com`,
    passwordHash,
    role: "customer" as const,
    location: randomItem(AREAS)
  }));

  const adminPayload = {
    name: "Admin User",
    email: `admin${Date.now()}@localspot.com`,
    passwordHash,
    role: "admin" as const,
    location: randomItem(AREAS)
  };

  const owners = await UserModel.insertMany(ownersPayload);
  const customers = await UserModel.insertMany(customersPayload);
  await UserModel.create(adminPayload);

  const listingPayload = owners.flatMap((owner, ownerIndex) =>
    Array.from({ length: listingsPerOwner }, (_, listingIndex) => {
      const category = randomItem<ListingCategory>(["salon", "eatery", "event"]);
      const area = randomItem(AREAS);
      const capacity =
        category === "event" ? randomInt(80, 350) : category === "eatery" ? randomInt(8, 60) : randomInt(3, 20);

      return {
        ownerId: owner._id,
        name: `${buildListingName(category)} ${ownerIndex + 1}-${listingIndex + 1}`,
        category,
        area,
        address: `${randomInt(2, 199)} ${randomItem(["Main", "Palm", "Central", "Admiralty", "Commercial"])} Street, ${area}`,
        description: buildDescription(category),
        priceRange: randomItem(["$", "$$", "$$$"] as const),
        openingHours: buildOpeningHours(category),
        capacity,
        active: Math.random() > 0.04
      };
    })
  );

  const listings = await ListingModel.insertMany(listingPayload);
  const activeListings = listings.filter((listing) => listing.active);

  const reservationPayload = Array.from({ length: reservationCount }, (_, index) => {
    const listing = randomItem(activeListings);
    const customer = randomItem(customers);
    const status = randomItem(reservationStatuses);
    const scheduledFor = new Date(Date.now() + randomInt(-20, 45) * 24 * 60 * 60 * 1000);
    const partyMax = Math.max(1, Math.min(listing.capacity, 10));

    return {
      listingId: listing._id,
      customerId: customer._id,
      scheduledFor,
      partySize: randomInt(1, partyMax),
      status,
      note:
        status === "cancelled"
          ? "Rescheduled by customer."
          : status === "completed"
            ? "Completed without incident."
            : `Reservation batch ${index + 1}`
    };
  });

  // Insert reservations in chunks to avoid oversized payloads.
  const chunkSize = 1000;
  for (let i = 0; i < reservationPayload.length; i += chunkSize) {
    await ReservationModel.insertMany(reservationPayload.slice(i, i + chunkSize));
  }

  console.log("Seed completed successfully.");
  console.log(`Owners added: ${owners.length}`);
  console.log(`Customers added: ${customers.length}`);
  console.log(`Listings added: ${listings.length}`);
  console.log(`Reservations added: ${reservationPayload.length}`);
  console.log("Default seed password for generated users: Password123!");
  console.log("Tip: use SEED_RESET=true to wipe existing records before seed.");
  process.exit(0);
};

seed().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});
