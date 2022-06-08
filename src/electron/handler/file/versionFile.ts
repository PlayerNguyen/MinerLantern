import * as path from "path";
import * as fs from "fs";

import axios from "axios";
import {
  getVersionManifestFileName,
  getVersionManifestUrl,
} from "../property/launcher";
import { getLauncherDirectoryPath } from "./launcherFile";

export interface VersionManifestLatestPatch {
  release: string;
  snapshot: string;
}

export interface VersionManifestVersionPatch {
  id: string;
  type: "snapshot" | "release";
  url: string;
  time: string;
  releaseTime: string;
}

export interface VersionManifest {
  latest: VersionManifestLatestPatch;
  versions: VersionManifestVersionPatch[];
}

/**
 *  Represents version directory path to store versions files inside.
 * The version directory is a subdirectory of the launcher directory combine to `versions`.
 *
 * @returns {string} a version directory path to store versions and version metadata files
 */
export function getVersionsDirectoryPath(): string {
  return path.join(getLauncherDirectoryPath(), "versions");
}

/**
 * Returns true if the versions directory exists.
 * @returns {boolean} a boolean value indicates whether the version directory exists
 */
export function hasVersionDirectoryPath(): boolean {
  return fs.existsSync(getVersionsDirectoryPath());
}

/**
 * Returns a version manifest file path, which a combination of
 * version directory path and version manifest file name to store version manifest data.
 * Version manifest is a json file which stores version information of all Minecraft version.
 *
 * <br>
 * Examples for different OS:
 *  - C:\Users\user\AppData\Roaming\Miner Lantern\versions\lantern_version_manifest.json
 *  - ~/Library/Application Support/Miner Lantern/versions/lantern_version_manifest.json
 *  - ~/.local/share/Miner Lantern/versions/lantern_version_manifest.json
 *
 * @returns {string} a version manifest file path to store version manifest data
 */
export function getVersionManifestFilePath(): string {
  return path.join(getVersionsDirectoryPath(), getVersionManifestFileName());
}

/**
 * Returns if the version manifest file is existed or not.
 * @returns {bool} a boolean value indicates whether the version manifest file is exists
 */
export function hasVersionManifestFile(): boolean {
  return fs.existsSync(getVersionManifestFilePath());
}

/**
 * Fetch a version manifest file from Mojang server.
 */
export async function fetchVersionManifestFromServer(
  isOnline: boolean
): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log(`Fetching version manifest from server...`);

    // Network is not available
    if (!isOnline) reject(new Error("network not found"));

    // If the version manifest path is not loaded
    if (!hasVersionManifestFile()) {
      // Create version directory
      fs.mkdirSync(getVersionsDirectoryPath(), { recursive: true });
    }

    // Pull down version manifest file from Mojang server
    //  and put it into version directory
    const stream: fs.WriteStream = fs.createWriteStream(
      getVersionManifestFilePath()
    );
    axios
      .get(getVersionManifestUrl(), { responseType: "stream" })
      .then((response) => {
        response.data.pipe(stream);

        // When the version manifest file is downloaded, resolve the promise
        stream.on("finish", () => {
          console.log(`Version manifest file is downloaded.`);

          // Resolve the promise
          resolve();
        });
      })
      .catch(reject);
  });
}

/**
 * Returns a version manifest data from version manifest file.
 * The file will be fetched if the connection is available.
 * Otherwise, this function will use the local version manifest file.
 *
 * @returns {VersionManifest} a version manifest data from local file
 */
export function getVersionManifest(): VersionManifest {
  if (!hasVersionManifestFile()) {
    throw new Error(`Version manifest file is not found`);
  }

  const versionManifest: VersionManifest = JSON.parse(
    fs.readFileSync(getVersionManifestFilePath(), "utf8")
  );
  return versionManifest;
}
