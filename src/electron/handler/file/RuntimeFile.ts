import * as path from "path";
import * as fs from "fs";
import { getLauncherDirectoryPath } from "./launcherFile";

/**
 * Returns a runtime directory path, which a combination of launcher directory path and runtime directory name.
 * @returns a runtime directory path to store runtime files
 */
export function getJavaRuntimeDirectoryPath(versionId: string): string {
  return path.join(getLauncherDirectoryPath(), "runtime", versionId);
}

export function hasJavaRuntimeDirectory(versionId: string): boolean {
  return fs.existsSync(getJavaRuntimeDirectoryPath(versionId));
}

