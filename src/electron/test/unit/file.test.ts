import * as path from "path";
import * as fs from "fs";

import { expect } from "chai";

import { getLauncherShortName } from "../../handler/property/launcher";
import {
  getLauncherDirectoryPath,
  loadLauncherDirectoryPath,
} from "../../handler/file/launcherFile";
import { getConfigPath } from "../../handler/file/configFile";

describe(`launcher data directory addressing`, () => {
  after("rm dir after file test", () => {
    const _path = getLauncherDirectoryPath();
    if (fs.existsSync(_path)) {
      fs.rmdirSync(_path);
    }
  });

  it(`should be valid directory for each `, () => {
    const _home = process.env.HOME;

    const _path = getLauncherDirectoryPath();

    expect(_path).to.be.a("string");
    // expect(_path).to.be.equal(pathAssertBuilder);
    // With darwin contains /Library/Application Support
    expect(_path).to.contain("/Library/Application Support");
    expect(_path).to.contain(getLauncherShortName());

    // Contains home on darwin and others which not Windows
    if (process.platform !== "win32") {
      expect(_path).to.contain(_home);
    } else {
      expect(_path).to.contain("AppData");
    }
  });

  // loadLauncherDirectoryPath();
  it(`should load and init the directory`, () => {
    // Allow to load launcher
    expect(() => {
      loadLauncherDirectoryPath();
    }).to.not.throw();
    // Exists the directory
    expect(fs.existsSync(getLauncherDirectoryPath())).to.be.true;
  });
});

describe(`config directory and file`, () => {
  it(`should contains config in path`, () => {
    const _path = getConfigPath();
    expect(_path).to.contain(getLauncherDirectoryPath());
  });
  
});
