import { describe, expect, it } from "vitest";
import { health } from "../src/controllers/healthController.js";

describe("health controller", () => {
  it("returns service status payload", () => {
    const responseBody: { status?: string; message?: string; timestamp?: string } = {};
    const res = {
      json: (payload: typeof responseBody) => {
        Object.assign(responseBody, payload);
      }
    };

    health({} as never, res as never);

    expect(responseBody.status).toBe("success");
    expect(responseBody.message).toBe("LocalSpot Booker API is healthy");
    expect(typeof responseBody.timestamp).toBe("string");
  });
});
