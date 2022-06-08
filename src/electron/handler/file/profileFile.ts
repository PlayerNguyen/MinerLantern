import * as path from "path";
import * as fs from "fs";

export interface ProfileNode {
  name: string;
  version: string;
}

export interface Profile {
  profiles: ProfileNode[];
}

export const DefaultProfile: Profile = {
  profiles: [
    {
      name: "Latest",
      version: "latest",
    },
  ],
};

import { getProfileFileName } from "../property/launcher";
import { getConfigPath, hasConfigPath } from "./configFile";
/**
 * Returns profile file path for the launcher
 *
 * @returns a profile file path
 */
export function getProfileFilePath(): string {
  return path.join(getConfigPath(), getProfileFileName());
}

/**
 * Checks if the profile file exists
 * @returns profile file is exists or not
 */
export function hasProfileFile(): boolean {
  return fs.existsSync(getProfileFilePath());
}

/**
 * Saves a profile to the profile file. If the profile file does not exist, it will be created.
 * This method will override the existing profile file.
 *
 * @param profile profile to be written
 */
export function saveProfile(profile: Profile): void {
  fs.writeFileSync(getProfileFilePath(), JSON.stringify(profile, null, 0));
}

/**
 * Loads and returns the profile from the profile file.
 * If the profile is not existed, throw an error.
 * @throws if the profile is not existed
 * @returns a profile object which loaded from existed file
 */
export function loadProfile(): Profile {
  if (!hasProfileFile()) {
    throw new Error("Profile file does not exist");
  }
  return JSON.parse(fs.readFileSync(getProfileFilePath(), "utf8"));
}

/**
 * Creates a profile file if it does not exist.
 */
export function loadDefaultProfile(latestVersion: string): void {
  // If the config path is not found, mkdir first
  if (!hasConfigPath()) {
    fs.mkdirSync(getConfigPath(), { recursive: true });
  }

  if (!hasProfileFile()) {
    const _default = DefaultProfile;
    _default.profiles[0].version = latestVersion;
    saveProfile(_default);
  }
}
