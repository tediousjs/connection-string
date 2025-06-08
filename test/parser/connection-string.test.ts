import * as assert from 'node:assert';
import { describe, it } from 'node:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from '../../src';
import { Fixture } from './fixture';

const fixtures: Fixture[] = JSON.parse(readFileSync(join(__dirname, './fixture/connection-strings.json')).toString());

describe('parser', () => {
    describe('connection-string', () => {
        fixtures.forEach(({ name, connection_string, expected, only, skip }) => {
            it(name, { only, skip }, () => {
                assert.deepEqual(Object.fromEntries(parse(connection_string).entries()), expected);
            });
        });
    });
});
