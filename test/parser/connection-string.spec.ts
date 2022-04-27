import { expect } from 'chai';
import { parseConnectionString } from '../../src';
import { Fixture } from './fixture';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fixtures: Fixture[] = require('./fixture/connection-strings');

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
