import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { apiRouter } from "./routes/index.js";

export const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ status: "success", message: "LocalSpot Booker backend is running" });
});

if (process.env.NODE_ENV !== "test") {
  void import("./docs/index.js")
    .then(({ docsMiddleware }) => {
      app.use("/docs", ...docsMiddleware);
    })
    .catch((error) => {
      console.error("Swagger docs unavailable:", error);
    });
}

app.use("/api/v1", apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);
