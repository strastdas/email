import type * as React from "react";

export function SourceInstallation({ version }: { version: string }): React.ReactElement {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-border/80 bg-muted/25 p-4">
        <h3 className="text-sm font-medium">Current version</h3>
        <p className="mt-2 font-mono text-sm text-foreground">{version}</p>
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          This installation uses custom source. Update it through your source repository and
          deployment process to keep your customization.
        </p>
      </div>
    </div>
  );
}
