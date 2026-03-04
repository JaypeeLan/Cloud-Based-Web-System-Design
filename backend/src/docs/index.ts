import swaggerUi from "swagger-ui-express";
import { swaggerSpec, swaggerUiOptions } from "./swagger.js";

export const docsMiddleware = [
  (_req: unknown, res: { removeHeader: (name: string) => void }, next: () => void) => {
    // Swagger UI injects inline assets, so remove CSP on this route only.
    res.removeHeader("Content-Security-Policy");
    next();
  },
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUiOptions)
];
