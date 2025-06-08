import * as assert from 'node:assert';
import { describe, it } from 'node:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { MSSQL_SCHEMA, parse } from '../../src';
import { Fixture } from './fixture';

const fixtures: Fixture[] = JSON.parse(readFileSync(join(__dirname, './fixture/sql-strings.json')).toString());

describe('parser', () => {
    describe('sql-connection-string', () => {
        fixtures.forEach(({ name, connection_string, expected, only, skip, additionalSchema }) => {
            it(name, { skip, only }, () => {
                const parsed = parse(connection_string).toSchema({
                    ...MSSQL_SCHEMA,
                    ...additionalSchema ?? {},
                });
                assert.deepEqual(parsed, expected);
            });
        });
    });
});
