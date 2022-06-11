import { AxiosHelper } from "./../../../utils/AxiosHelper";
import { Profile } from "./../../file/profileFile";
import { loadProfile } from "../../file/profileFile";
import { ListenerChannels } from "./../../../Preload";
import { Listener } from "./../ipc";
import { loadConfig } from "../../file/configFile";
import {
  getVersionManifest,
  hasVersionMetadata,
  loadVersionMetadata,
  saveVersionMetadata,
} from "../../file/versionFile";
import {
  MinecraftVersionInterpreter,
  MinecraftVersionResponse,
} from "../../../interpreter/MinecraftVersionInterpreter";
import { hasJavaRuntimeDirectory } from "../../file/RuntimeFile";
import { createDownloadTask } from "../../downloader/downloadQueue";

export class RunMinecraft implements Listener<string> {
  name: ListenerChannels = "run-minecraft";
  processor: (event: Electron.IpcMainEvent, args) => Promise<void> = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event,
    args
  ) => {
    // Execute minecraft here
    console.log(`Starting to launch minecraft`);

    // Get version id from profile
    const _profile: Profile = loadProfile();
    const _config = loadConfig();
    const _versionId: string =
      _profile.profiles[_config.currentProfileIndex].version;
    console.log(`Version id: ${_versionId}`);

    // Load manifest
    const _manifest = getVersionManifest();
    const _loadedVersion = _manifest.versions.find(
      (version) => version.id === _versionId
    );

    console.log(`Loaded version manifest: `);
    console.log(_loadedVersion);

    // If the version is not exist, throw error
    if (!_loadedVersion) {
      throw new Error(`Version ${_versionId} not found`);
    }

    // Get current version
    let _metadata: MinecraftVersionResponse;
    if (hasVersionMetadata(_versionId)) {
      _metadata = loadVersionMetadata(_versionId);
    } else {
      const _ = await AxiosHelper.get(_loadedVersion.url);
      // Save version metadata
      saveVersionMetadata(_versionId, _.data);
      // Assign to _metadata
      _metadata = _.data;
    }

    const _metadataInterpreted =
      MinecraftVersionInterpreter.getInstance(_metadata);

    // console.log(_metadataInterpreted.getPlatformLibraries().length);
    // console.log(

    // );
    // Check for java runtime environment
    if (
      !hasJavaRuntimeDirectory(
        String(_metadataInterpreted.getJavaRuntimeMajorVersion())
      )
    ) {
      console.log(`Java runtime directory not found, installing to...`);
      const _runtimePath = _metadataInterpreted.getJavaRuntimeDirectory();
      console.log(_runtimePath);
      console.log(
        _metadataInterpreted.getPlatformJavaRuntime().requestBinaryUrl()
      );

      // TODO: download java runtime
      createDownloadTask(
        [
          {
            url: _metadataInterpreted
              .getPlatformJavaRuntime()
              .requestBinaryUrl(),
            to: _runtimePath,
            fileName: "jre.tar.gz",
          },
        ],
        {
          onStart: (item) => {
            console.log(`Downloading ${item.url}`);
          },
          onProgress: (item, currentBytes) => {
            process.stdout.write(`${currentBytes} / ${item.totalBytes} `);
          },
        }
      );
    }
  };

  // TODO: Check for asset index file

  // TODO: Check for libraries file
}
