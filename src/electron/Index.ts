console.log(`Current env: ${process.env.NODE_ENV}`);
console.log(`Current platform: ${process.platform}`);

// process.env.NODE_ENV === "production"
//   ? require("./ProductionIndex")
//   : require("./DevelopmentIndex");
require("./DevelopmentIndex");
