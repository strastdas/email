import type { WorkerEnv } from "@worker/lib/env";
import { assertManagedUpdates, isCustomSourceBuild, runningVersion } from "@worker/lib/version";
import { beforeEach, describe, expect, it, vi } from "vitest";
import sourcePackage from "../../../../package.json";

const packageMock = vi.hoisted(() => ({ customSource: true }));

vi.mock("../../../../package.json", async (importOriginal) => {
  const actual = await importOriginal<{ default: typeof import("../../../../package.json") }>();
  return {
    ...actual,
    default: {
      ...actual.default,
      hqbaseRelease: {
        ...actual.default.hqbaseRelease,
        get customSource() {
          return packageMock.customSource;
        }
      }
    }
  };
});

describe("runtime version metadata", () => {
  beforeEach(() => {
    packageMock.customSource = true;
  });

  it("identifies the custom source build marker", () => {
    expect(isCustomSourceBuild()).toBe(true);
  });

  it("uses the package version when a custom source build has a stale binding", () => {
    expect(runningVersion({ HQBASE_APP_VERSION: "0.1.1" } as WorkerEnv)).toBe(
      sourcePackage.version
    );
  });

  it("uses the package version when a custom source build has no binding", () => {
    expect(runningVersion({} as WorkerEnv)).toBe(sourcePackage.version);
  });

  it("rejects managed update actions for custom source builds", () => {
    expect(() => assertManagedUpdates()).toThrow(
      expect.objectContaining({ code: "UPDATE_CUSTOM_SOURCE", status: 409 })
    );
  });

  it("uses a trimmed release binding for managed builds", () => {
    packageMock.customSource = false;

    expect(runningVersion({ HQBASE_APP_VERSION: " 1.3.0 " } as WorkerEnv)).toBe("1.3.0");
  });

  it.each([
    undefined,
    "",
    "   "
  ])("falls back to the package version for a managed build with binding %j", (binding) => {
    packageMock.customSource = false;

    expect(runningVersion({ HQBASE_APP_VERSION: binding } as WorkerEnv)).toBe(
      sourcePackage.version
    );
  });

  it("allows managed update actions when the source marker is false", () => {
    packageMock.customSource = false;

    expect(() => assertManagedUpdates()).not.toThrow();
  });
});
