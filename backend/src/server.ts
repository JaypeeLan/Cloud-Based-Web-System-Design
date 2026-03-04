import { app } from "./app.js";
import { connectToDatabase } from "./config/db.js";
import { env } from "./config/env.js";

const start = async () => {
  try {
    await connectToDatabase();
    app.listen(env.PORT, () => {
      console.log(`LocalSpot Booker API listening on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

void start();
