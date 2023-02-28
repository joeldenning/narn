const {getNpmArgs} = require('../lib/narn-lib');

// https://github.com/joeldenning/narn/issues/21
describe('narn run', () => {
  it('lists all available commands with npm run', () => {
    expect(getNpmArgs(['run'])).toEqual(['run']);
  });

  it("doesnt repeat 'run'", () => {
    expect(getNpmArgs(['run', 'build'])).toEqual(['run', 'build']);
  });
});
