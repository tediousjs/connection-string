import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect } from 'chai';
import { parseConnectionString } from '../../src';
import { Fixture } from './fixture';

const fixtures: Fixture[] = JSON.parse(readFileSync(join(__dirname, './fixture/connection-strings.json')).toString());

describe('parser', () => {
    describe('connection-string', () => {
        fixtures.forEach(({ name, connection_string, expected, only, skip }) => {
            const func = only ? it.only : skip ? it.skip : it;
            func(name, () => {
                expect(parseConnectionString(connection_string)).to.deep.equal(expected);
            });
        });
    });
});
