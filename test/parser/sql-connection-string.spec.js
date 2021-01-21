const { expect } = require('chai');
const { parseSqlConnectionString } = require('../../lib/');
const fixtures = require('./fixture/sql-strings.json');

describe('parser', () => {
    describe('connection-string', () => {
        fixtures.forEach(({name, connection_string, expected, only, skip, canonical}) => {
            const func = only ? it.only : skip ? it.skip : it;
            func(name, () => {
                expect(parseSqlConnectionString(connection_string, canonical)).to.deep.equal(expected);
            });
        });
    });
});
