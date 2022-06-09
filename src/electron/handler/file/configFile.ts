import * as path from "path";
import * as fs from "fs";

import { getLauncherDirectoryPath } from "./launcherFile";
import { getConfigFileName } from "../property/launcher";

interface OfflineUserConfig {
  lastUsername: string;
}
export interface LanternLauncherConfig {
  currentProfileIndex: number;
  offline: OfflineUserConfig;
}

const LanternLauncherConfigDefault: LanternLauncherConfig = {
  currentProfileIndex: 0,
  offline: {
    lastUsername: "",
  },
};

/**
 *  Represents configuration path to store config files inside.
 * @returns {string} a launcher configuration path to store configuration files
 */
export function getConfigPath(): string {
  const _path = path.join(getLauncherDirectoryPath(), "config");
  return _path;
}

/**
 * Checks if the configuration path exists
 * @returns a boolean that indicates if the config file exists
 */
export function hasConfigPath(): boolean {
  return fs.existsSync(getConfigPath());
}

/**
 * Check if the config file is existed or not
 * @returns {boolean} true if the config file is existed
 */
export function hasConfigFile(): boolean {
  return fs.existsSync(getConfigFilePath());
}

/**
 * Loads (creates) configuration path if is not exists
 */
export function loadConfigDirectoryPath(): void {
  console.log(`Loading config directory path: ${getConfigPath()}`);

  try {
    const _path = getConfigPath();

    // Create if the file is not exists
    if (!fs.existsSync(_path)) {
      fs.mkdirSync(_path, { recursive: true });
    }

    console.log(
      `Successfully created config directory path: ${getConfigPath()}`
    );
  } catch {
    throw new Error(
      `Failed to create config directory path: ${getConfigPath()}`
    );
  }
}

/**
 *  Represents a combination of configuration path and name of the file.
 * @returns {string} a config file path
 */
export function getConfigFilePath() {
  return path.join(getConfigPath(), getConfigFileName());
}

/**
 * Saves configuration file to the disk.
 * @param config a configuration object to save
 */
export function saveConfig(config: LanternLauncherConfig): void {
  const _file = getConfigFilePath();

  try {
    fs.writeFileSync(_file, JSON.stringify(config, null, 0));
  } catch {
    throw new Error(`Failed to save config file: ${_file}`);
  }
}

/**
 * Loads configuration file from the disk.
 * @returns {LanternLauncherConfig} a configuration object taken from disk
 */
export function loadConfig(): LanternLauncherConfig {
  const _file = getConfigFilePath();

  try {
    const _config = JSON.parse(fs.readFileSync(_file, "utf8"));
    return _config;
  } catch (e) {
    throw new Error(`Failed to load config file: ${_file}`);
  }
}

/**
 * Gets a default configuration object for the launcher.
 * @returns {LanternLauncherConfig} a default configuration object
 */
export function getDefaultConfig(): LanternLauncherConfig {
  return LanternLauncherConfigDefault;
}

/**
 * Puts all new default values to the configuration object
 * and keep the old values if the key is existed.
 */
export function createDefaultValues(): void {
  // Create a new one if the config file is not exists
  if (!hasConfigFile()) {
    saveConfig(getDefaultConfig());
  }

  const _config = loadConfig();
  const _default = getDefaultConfig();

  for (const _key in _default) {
    if (_config[_key] === undefined) {
      _config[_key] = _default[_key];
    }
  }

  saveConfig(_config);
}

export function getConfig(): LanternLauncherConfig {
  return loadConfig();
}
