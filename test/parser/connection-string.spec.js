const { expect } = require('chai');
const { parseConnectionString } = require('../../lib/');
const fixtures = require('./fixture/connection-strings');

describe('parser', () => {
    describe('connection-string', () => {
        fixtures.forEach(({name, connection_string, expected, only, skip}) => {
            const func = only ? it.only : skip ? it.skip : it;
            func(name, () => {
                expect(parseConnectionString(connection_string)).to.deep.equal(expected);
            });
        });
    });
});
