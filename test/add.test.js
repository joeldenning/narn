const { getNpmArgs } = require("../lib/narn-lib");

describe("narn add", () => {
  it("forces packages to be saved", () => {
    expect(getNpmArgs(["add", "lodash"]).slice(0, 2)).toEqual([
      "install",
      "--save"
    ]);
    expect(getNpmArgs(["add", "--dev", "lodash"]).slice(0, 2)).toEqual([
      "install",
      "--save-dev"
    ]);
    expect(getNpmArgs(["add", "-D", "lodash"]).slice(0, 2)).toEqual([
      "install",
      "--save-dev"
    ]);
    expect(getNpmArgs(["add", "lodash", "--dev"]).slice(0, 2)).toEqual([
      "install",
      "--save-dev"
    ]);
    expect(getNpmArgs(["add", "lodash", "-D"]).slice(0, 2)).toEqual([
      "install",
      "--save-dev"
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

  it("supports installing from https urls", () => {
    expect(
      getNpmArgs(["add", "https://github.com/joeldenning/narn#master"])
    ).toEqual([
      "install",
      "--save",
      "https://github.com/joeldenning/narn#master"
    ]);
  });

  it("supports installing from git urls", () => {
    expect(
      getNpmArgs(["add", "git@github.com:joeldenning/narn.git#master"])
    ).toEqual([
      "install",
      "--save",
      "git@github.com:joeldenning/narn.git#master"
    ]);
  });
});
