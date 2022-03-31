const { getNpmArgs } = require("../lib/narn-lib");

describe("narn exec", () => {
  it("can exec with narn", () => {
    expect(getNpmArgs(["exec", "changeset", "init"])).toEqual([
      "exec",
      "changeset",
      "init",
    ]);
  });

  it("forwards flags", () => {
    expect(
      getNpmArgs(["exec", "sequelize-cli", "seed", "--name", "demo-user"])
    ).toEqual(["exec", "sequelize-cli", "seed", "--name", "demo-user"]);
  });
});
