/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");

// ../dist
const distDirectory = path.join(__dirname, "../dist");
if (fs.existsSync(distDirectory)) {
  console.log(`✔ Detected dist folder, removing...`);
  fs.rmdirSync(distDirectory, { recursive: true });
  console.log(`✔ Removed dist folder`);
}

// ../.parcel-cache
const parcelCache = path.join(__dirname, "../.parcel-cache");
if (fs.existsSync(parcelCache)) {
  console.log(`✔ Detected parcel cache folder, removing...`);
  fs.rmdirSync(parcelCache, { recursive: true });
  console.log(`✔ Removed parcel folder`);
}
