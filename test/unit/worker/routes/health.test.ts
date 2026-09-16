import type { WorkerEnv } from "@worker/lib/env";
import { healthRoutes } from "@worker/routes/health";
import { describe, expect, it } from "vitest";
import sourcePackage from "../../../../package.json";

describe("health routes", () => {
  it("reports the release version that served the request", async () => {
    const response = await healthRoutes.request("/", undefined, {
      HQBASE_APP_VERSION: "1.2.0"
    } as WorkerEnv);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      service: "hqbase",
      version: sourcePackage.version
    });
  });

  it("reports the package version when the deployment has no release binding", async () => {
    const response = await healthRoutes.request("/", undefined, {} as WorkerEnv);

    await expect(response.json()).resolves.toMatchObject({ version: sourcePackage.version });
  });
});
