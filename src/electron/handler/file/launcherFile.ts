import * as path from "path";
import { getLauncherShortName } from "../property/launcher";
import * as fs from "fs";
/**
 *  Represents launcher path to store data files inside.
 *
 * @returns {string} a launcher directory path to store files
 */
export function getLauncherDirectoryPath(): string {
  const _path = path.join(
    process.env.APPDATA ||
      (process.platform == "darwin"
        ? process.env.HOME + "/Library/Application Support"
        : process.env.HOME + "/.local/share"),
    getLauncherShortName()
  );

  return _path;
}

/**
 * Creates directory if the file is not exists.
 */
export function loadLauncherDirectoryPath(): void {
  console.log(`Loading launcher directory path: ${getLauncherDirectoryPath()}`);

  try {
    const _path = getLauncherDirectoryPath();

    // Create if the file is not exists
    if (!fs.existsSync(_path)) {
      fs.mkdirSync(_path, { recursive: true });
    }

    console.log(
      `Successfully created launcher directory path: ${getLauncherDirectoryPath()}`
    );
  } catch {
    throw new Error(
      `Failed to create launcher directory path: ${getLauncherDirectoryPath()}`
    );
  }
}
