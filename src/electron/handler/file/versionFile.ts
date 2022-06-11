import * as path from "path";
import * as fs from "fs";

import axios from "axios";
import {
  getVersionManifestFileName,
  getVersionManifestUrl,
} from "../property/launcher";
import { getLauncherDirectoryPath } from "./launcherFile";
import { MinecraftVersionResponse } from "../../interpreter/MinecraftVersionInterpreter";

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

/**
 * Gets the version metadata file path.
 * @param versionId a version id to solve file path
 * @returns a joined file path of the version metadata
 */
export function getVersionMetadataFilePath(versionId: string): string {
  return path.join(
    getVersionsDirectoryPath(),
    `${versionId}`,
    `${versionId}.json`
  );
}

/**
 * Checks if the version metadata file is existed or not.
 * @param versionId a version id to check
 * @returns true if the version metadata file is existed
 */
export function hasVersionMetadata(versionId: string): boolean {
  return fs.existsSync(getVersionMetadataFilePath(versionId));
}

/**
 * Gets the version metadata from local file. If the version metadata file is not existed,
 * throw an error.
 *
 * @param versionId a version id to load
 * @returns a version metadata data from local file
 */
export function loadVersionMetadata(
  versionId: string
): MinecraftVersionResponse {
  if (!hasVersionMetadata(versionId)) {
    throw new Error(`Version metadata file is not found`);
  }

  const versionMetadata = JSON.parse(
    fs.readFileSync(getVersionMetadataFilePath(versionId), "utf8")
  );
  return versionMetadata;
}
/**
 * Saves the version metadata to local file.
 * @param versionId a version id to save
 * @param versionMetadata a version metadata to save
 */
export function saveVersionMetadata(
  versionId: string,
  versionMetadata: MinecraftVersionResponse
): void {
  // Make a directory first
  fs.mkdirSync(path.join(getVersionsDirectoryPath(), versionId), {
    recursive: true,
  });

  // Save the metadata
  fs.writeFileSync(
    getVersionMetadataFilePath(versionId),
    JSON.stringify(versionMetadata),
    "utf8"
  );
}
