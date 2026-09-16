import sourcePackage from "../../package.json";
import type { WorkerEnv } from "./env";
import { AppError } from "./errors";

export function isCustomSourceBuild(): boolean {
  return (sourcePackage.hqbaseRelease as { customSource?: boolean }).customSource === true;
}

export function runningVersion(env: WorkerEnv): string {
  return isCustomSourceBuild()
    ? sourcePackage.version
    : env.HQBASE_APP_VERSION?.trim() || sourcePackage.version;
}

export function assertManagedUpdates(): void {
  if (isCustomSourceBuild()) {
    throw new AppError(
      "UPDATE_CUSTOM_SOURCE",
      "This installation uses custom source. Update it through your source repository and deployment process to keep your customization.",
      409
    );
  }
}

export function compareVersions(left: string, right: string): number {
  const a = (left.split("-")[0] ?? "0").split(".").map(Number);
  const b = (right.split("-")[0] ?? "0").split(".").map(Number);
  for (let index = 0; index < 3; index += 1) {
    const leftPart = a[index] ?? 0;
    const rightPart = b[index] ?? 0;
    if (leftPart !== rightPart) return leftPart - rightPart;
  }
  return left.includes("-") === right.includes("-") ? 0 : left.includes("-") ? -1 : 1;
}
