import * as path from "path";
import { getJavaRuntimeDirectoryPath } from "../handler/file/RuntimeFile";
import { isLinux, isMac, isWindows } from "../handler/property/launcher";
import { JavaRuntimeBuilder } from "./JavaRuntimeBuilder";

interface MinecraftVersionGameSettingRuleSection {
  action: "allow" | "disallow";
  os?: "windows" | "osx" | "linux";
  features?: object;
}

interface MinecraftVersionGameSettingRule {
  rules: MinecraftVersionGameSettingRuleSection[];
  value?: string | string[];
}

interface MinecraftVersionAssetIndex {
  id: string;
  sha1: string;
  size: number;
  totalSize: number;
  url: string;
}

interface MinecraftVersionResource {
  sha1: string;
  size: number;
  url: string;
}

interface MinecraftVersionDownloads {
  client: MinecraftVersionResource;
  server: MinecraftVersionResource;
  client_mappings: MinecraftVersionResource;
  server_mappings: MinecraftVersionResource;
}

interface MinecraftVersionJavaVersion {
  component: string;
  majorVersion: number;
}

interface MinecraftVersionLibraryDownload {
  artifact: {
    path: string;
    sha1: string;
    size: number;
    url: string;
  };
}

interface MinecraftVersionLibraryRule {
  action: "allow" | "disallow";
  os: {
    name: "windows" | "osx" | "linux";
  };
}

interface MinecraftVersionLibrary {
  downloads: MinecraftVersionLibraryDownload;
  name: string;
  rules: MinecraftVersionLibraryRule[];
}

interface MinecraftVersionLogging {
  client: {
    argument: string;
    file: {
      id: string;
      sha1: string;
      size: number;
      url: string;
    };
    type: string;
  };
}

interface MinecraftVersionResponse {
  argument: {
    game: string | object[] | MinecraftVersionGameSettingRuleSection[];
    jvm: string | object[] | MinecraftVersionGameSettingRuleSection[];
  };

  assetIndex: MinecraftVersionAssetIndex;
  assets: string;
  complianceLevel: number;

  downloads: MinecraftVersionDownloads;
  id: string;
  javaVersion: MinecraftVersionJavaVersion;
  libraries: MinecraftVersionLibrary[];
  logging: MinecraftVersionLogging;
  mainClass: string;
  minimumLauncherVersion: number;
  releaseTime: string;
  time: string;
  type: "release" | "snapshot";
}

export {
  MinecraftVersionAssetIndex,
  MinecraftVersionGameSettingRuleSection,
  MinecraftVersionGameSettingRule,
  MinecraftVersionResource,
  MinecraftVersionDownloads,
  MinecraftVersionJavaVersion,
  MinecraftVersionLibraryDownload,
  MinecraftVersionLibraryRule,
  MinecraftVersionLibrary,
  MinecraftVersionLogging,
};

/**
 * Represents a Minecraft version interpreter to handle version response from Mojang API.
 * @class MinecraftVersionInterpreter
 */
class MinecraftVersionInterpreter {
  private response: MinecraftVersionResponse;
  constructor(response: MinecraftVersionResponse) {
    this.response = response;
  }

  /**
   * Create a new instance of MinecraftVersionInterpreter.
   * @param response a version response from Mojang API
   * @returns a new instance of MinecraftVersionInterpreter
   */
  public static getInstance = (
    response: MinecraftVersionResponse
  ): MinecraftVersionInterpreter => {
    return new MinecraftVersionInterpreter(response);
  };

  /**
   * Filters and returns a list of libraries which are allowed to be used on current platform.
   * @returns a list of libraries that match with the current operating system
   */
  public getPlatformLibraries(): MinecraftVersionLibrary[] {
    const _ = this.response.libraries.filter(
      (library: MinecraftVersionLibrary) => {
        if (!library.rules || library.rules.length === 0) {
          return true;
        }
        if (isMac()) {
          return (
            library.rules[0].action === "allow" &&
            library.rules[0].os.name === "osx"
          );
        }
        if (isWindows()) {
          return (
            library.rules[0].action === "allow" &&
            library.rules[0].os.name === "windows"
          );
        }
        if (isLinux()) {
          return (
            library.rules[0].action === "allow" &&
            library.rules[0].os.name === "linux"
          );
        }
      }
    );

    return _;
  }

  public getPlatformJavaRuntime(): JavaRuntimeBuilder {
    const _builder = JavaRuntimeBuilder.create()
      .setArch("x64")
      .setHeapSize("normal")
      .setVersion(this.response.javaVersion.majorVersion)
      .setOs(isMac() ? "mac" : isWindows() ? "windows" : "linux")
      .setVendor("eclipse")
      .setImageType("jre")
      .setReleaseType("ga");
    return _builder;
  }

  public getJavaRuntimeMajorVersion(): number {
    return this.response.javaVersion.majorVersion;
  }

  public getJavaRuntimeDirectory() {
    return getJavaRuntimeDirectoryPath(
      String(this.getJavaRuntimeMajorVersion())
    );
  }
}

export { MinecraftVersionInterpreter, MinecraftVersionResponse };
