import { Hono } from "hono";

import type { HonoApp } from "../lib/env";
import { runningVersion } from "../lib/version";

export const healthRoutes = new Hono<HonoApp>();

healthRoutes.get("/", (c) => {
  return c.json({
    ok: true,
    service: "hqbase",
    version: runningVersion(c.env),
    time: new Date().toISOString()
  });
});
