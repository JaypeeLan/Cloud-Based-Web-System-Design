export const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "LocalSpot Booker API",
    version: "1.0.0",
    description:
      "API documentation for LocalSpot Booker. Authenticated routes require a Bearer JWT token."
  },
  servers: [
    {
      url: "/api/v1",
      description: "Relative API base"
    }
  ],
  tags: [
    { name: "Health" },
    { name: "Auth" },
    { name: "Listings" },
    { name: "Reservations" }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          role: { type: "string", enum: ["customer", "owner", "admin"] },
          location: { type: "string" }
        }
      },
      Listing: {
        type: "object",
        properties: {
          _id: { type: "string" },
          ownerId: { type: "string" },
          name: { type: "string" },
          category: { type: "string", enum: ["salon", "eatery", "event"] },
          area: { type: "string" },
          address: { type: "string" },
          description: { type: "string" },
          priceRange: { type: "string", enum: ["$", "$$", "$$$"] },
          openingHours: { type: "string" },
          capacity: { type: "number" },
          active: { type: "boolean" }
        }
      },
      Reservation: {
        type: "object",
        properties: {
          _id: { type: "string" },
          listingId: { oneOf: [{ type: "string" }, { $ref: "#/components/schemas/Listing" }] },
          customerId: { oneOf: [{ type: "string" }, { $ref: "#/components/schemas/User" }] },
          scheduledFor: { type: "string", format: "date-time" },
          partySize: { type: "number" },
          status: { type: "string", enum: ["pending", "confirmed", "cancelled", "completed"] },
          note: { type: "string" }
        }
      },
      ApiSuccess: {
        type: "object",
        properties: {
          status: { type: "string", example: "success" },
          message: { type: "string", example: "OK" },
          data: {}
        }
      },
      ApiError: {
        type: "object",
        properties: {
          status: { type: "string", example: "error" },
          message: { type: "string" }
        }
      }
    }
  },
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: {
          "200": {
            description: "Service status"
          }
        }
      }
    },
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "location", "email", "password"],
                properties: {
                  name: { type: "string" },
                  location: { type: "string" },
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 8 }
                }
              }
            }
          }
        },
        responses: {
          "201": { description: "User created" },
          "409": { description: "Email conflict", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } }
        }
      }
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 8 }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Authenticated" },
          "401": { description: "Invalid credentials" }
        }
      }
    },
    "/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get current profile",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Current user", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } },
          "401": { description: "Unauthorized" }
        }
      }
    },
    "/auth/profile": {
      patch: {
        tags: ["Auth"],
        summary: "Update profile (name, location, password only)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  location: { type: "string" },
                  password: { type: "string", minLength: 8 }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Profile updated" },
          "403": { description: "Role update forbidden" }
        }
      }
    },
    "/listings": {
      get: {
        tags: ["Listings"],
        summary: "Search listings",
        parameters: [
          { name: "area", in: "query", schema: { type: "string" } },
          { name: "category", in: "query", schema: { type: "string", enum: ["salon", "eatery", "event"] } },
          { name: "q", in: "query", schema: { type: "string" } }
        ],
        responses: {
          "200": { description: "Listing results" }
        }
      },
      post: {
        tags: ["Listings"],
        summary: "Create listing",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "category", "area", "address"],
                properties: {
                  name: { type: "string" },
                  category: { type: "string", enum: ["salon", "eatery", "event"] },
                  area: { type: "string" },
                  address: { type: "string" },
                  description: { type: "string" },
                  priceRange: { type: "string", enum: ["$", "$$", "$$$"] },
                  openingHours: { type: "string" },
                  capacity: { type: "number" }
                }
              }
            }
          }
        },
        responses: {
          "201": { description: "Listing created" }
        }
      }
    },
    "/listings/mine": {
      get: {
        tags: ["Listings"],
        summary: "Get my listings",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Owner listings" }
        }
      }
    },
    "/listings/{listingId}": {
      get: {
        tags: ["Listings"],
        summary: "Get listing by ID",
        parameters: [{ name: "listingId", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Listing details" },
          "404": { description: "Listing not found" }
        }
      },
      patch: {
        tags: ["Listings"],
        summary: "Update listing",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "listingId", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  category: { type: "string", enum: ["salon", "eatery", "event"] },
                  area: { type: "string" },
                  address: { type: "string" },
                  description: { type: "string" },
                  priceRange: { type: "string", enum: ["$", "$$", "$$$"] },
                  openingHours: { type: "string" },
                  capacity: { type: "number" },
                  active: { type: "boolean" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Listing updated" }
        }
      }
    },
    "/reservations": {
      post: {
        tags: ["Reservations"],
        summary: "Create reservation",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["listingId", "scheduledFor", "partySize"],
                properties: {
                  listingId: { type: "string" },
                  scheduledFor: { type: "string", format: "date-time" },
                  partySize: { type: "number" },
                  note: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          "201": { description: "Reservation created" }
        }
      }
    },
    "/reservations/mine": {
      get: {
        tags: ["Reservations"],
        summary: "Get my reservations",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Reservation list" }
        }
      }
    },
    "/reservations/owner": {
      get: {
        tags: ["Reservations"],
        summary: "Get reservations for owner listings",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Owner reservation list" }
        }
      }
    },
    "/reservations/{reservationId}/status": {
      patch: {
        tags: ["Reservations"],
        summary: "Update reservation status",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "reservationId", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: {
                    type: "string",
                    enum: ["pending", "confirmed", "cancelled", "completed"]
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Status updated" }
        }
      }
    }
  }
} as const;

export const swaggerUiOptions = {
  customSiteTitle: "LocalSpot Booker API Docs"
};
