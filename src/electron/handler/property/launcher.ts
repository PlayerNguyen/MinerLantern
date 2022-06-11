/**
 * Represents a full launcher name.
 * @returns {string} a full launcher name with spaces
 */
export function getLauncherName(): string {
  return "Miner Lantern";
}

/**
 * Represents a uniquely short name of the launcher.
 *
 * @returns {string} a launcher short name
 */
export function getLauncherShortName(): string {
  return "lantern";
}

/**
 * Represents config file name
 * @returns {string} a config file name
 */
export function getConfigFileName(): string {
  return "config.json";
}

/**
 * Returns a version manifest url to get manifest file from Mojang server.
 *
 * @returns {string} a version manifest url to receive
 */
export function getVersionManifestUrl(): string {
  return "https://launchermeta.mojang.com/mc/game/version_manifest.json";
}

/**
 * Returns a version manifest file name, which stores version manifest data.
 * Version manifest is a json file which stores version information of all Minecraft version.
 * @returns {string} a version manifest file name
 */
export function getVersionManifestFileName(): string {
  return "lantern_version_manifest.json";
}
/**
 * Returns a profile file name, which stores profile data.
 * @returns {string} a profile file name
 */
export function getProfileFileName(): string {
  return "profile.json";
}

/**
 * Checks if the current platform is MacOS.
 * @returns {boolean} true if the current platform is MacOS (OSX)
 */
export function isMac(): boolean {
  return process.platform === "darwin";
}
/**
 * Checks if the current platform is Windows.
 * @returns {boolean} true if the current platform is Windows
 */
export function isWindows(): boolean {
  return process.platform === "win32";
}

/**
 * Checks if the current platform is Linux.
 * @returns {boolean} true if the current platform is Linux
 */
export function isLinux(): boolean {
  return process.platform === "linux";
}
/**
 * Returns an Adoptium base url. Adoptium is a free Prebuilt OpenJDK Binaries
 * to download JRE for this launcher.
 * @returns {string} return an adoptium url
 */
export function getAdoptiumVersion3Url(): string {
  return "https://api.adoptium.net/v3/";
}
