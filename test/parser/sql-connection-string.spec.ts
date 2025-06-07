import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect } from 'chai';
import { parseSqlConnectionString } from '../../src';
import { Fixture } from './fixture';

const fixtures: Fixture[] = JSON.parse(readFileSync(join(__dirname, './fixture/sql-strings.json')).toString());

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
