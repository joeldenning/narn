const { getNpmArgs } = require("../lib/narn-lib");

describe("narn add", () => {
  it("forces packages to be saved", () => {
    expect(getNpmArgs(["add", "lodash"]).slice(0, 2)).toEqual([
      "install",
      "--save"
    ]);
  });

  it("can install multiple packages with their semantic version specified", () => {
    expect(getNpmArgs(["add", "react@16.10.0", "react-dom@^16.10.0"])).toEqual([
      "install",
      "--save",
      "react@16.10.0",
      "react-dom@^16.10.0"
    ]);
  });

  it("forces latest version of package when semantic version is omitted, same as yarn add", () => {
    expect(getNpmArgs(["add", "lodash"])).toEqual([
      "install",
      "--save",
      "lodash@latest"
    ]);
  });

  it("works with scoped packages", () => {
    expect(getNpmArgs(["add", "@openmrs/esm-api"])).toEqual([
      "install",
      "--save",
      "@openmrs/esm-api@latest"
    ]);
    expect(getNpmArgs(["add", "@openmrs/esm-api@~1.0.0"])).toEqual([
      "install",
      "--save",
      "@openmrs/esm-api@~1.0.0"
    ]);
  });

  it("works with devDependencies", () => {
    expect(getNpmArgs(["add", "--dev", "react@16.10.0"])).toEqual([
      "install",
      "--save-dev",
      "react@16.10.0"
    ]);
  });

  it("works with devDependencies and first dep not specifying version", () => {
    expect(getNpmArgs(["add", "--dev", "jest"])).toEqual([
      "install",
      "--save-dev",
      "jest@latest"
    ]);
  });
});
