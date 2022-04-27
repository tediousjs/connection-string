import { expect } from 'chai';
import { parseSqlConnectionString } from '../../src';
import { Fixture } from './fixture';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fixtures: Fixture[] = require('./fixture/sql-strings');

describe('parser', () => {
    describe('sql-connection-string', () => {
        fixtures.forEach(({ name, connection_string, expected, only, skip, canonical }) => {
            const func = only ? it.only : skip ? it.skip : it;
            func(name, () => {
                expect(parseSqlConnectionString(connection_string, canonical)).to.deep.equal(expected);
            });
        });
    });
});
