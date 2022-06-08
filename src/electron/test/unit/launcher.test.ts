import { expect } from "chai";
import {
  getLauncherName,
  getLauncherShortName,
} from "../../handler/property/launcher";

describe(`launcher property`, () => {
  it(`should full name  be Miner Lantern`, () => {
    expect(getLauncherName()).to.be.a.string;
    expect(getLauncherName()).to.eq(`Miner Lantern`);
  });
  // short name must be lantern
  it(`should short name be lantern`, () => {
    expect(getLauncherShortName()).to.be.a.string;
    expect(getLauncherShortName()).to.eq(`lantern`);
  });
});
