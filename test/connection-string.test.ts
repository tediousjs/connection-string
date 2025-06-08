import * as assert from 'node:assert';
import { describe, it } from 'node:test';
import { ConnectionString } from '../src/connection-string';

describe('connection-string', () => {
    const connectionString = 'keyword=value;isTrue=true;isYes=yes;isFalse=false;isNo=no;is0=0;is1=1';
    describe('.has()', () => {
        it('returns true for existing keys', () => {
            const parsed = new ConnectionString(connectionString);
            assert.equal(parsed.has('keyword'), true);
            assert.equal(parsed.has('isTrue'), true);
            assert.equal(parsed.has('isYes'), true);
            assert.equal(parsed.has('isFalse'), true);
            assert.equal(parsed.has('isNo'), true);
            assert.equal(parsed.has('is0'), true);
            assert.equal(parsed.has('is1'), true);
        });
        it('returns false for missing keys', () => {
            const parsed = new ConnectionString(connectionString);
            assert.equal(parsed.has('missing'), false);
        });
    });
    describe('.get()', () => {
        it('coerces a string', () => {
            const parsed = new ConnectionString(connectionString);
            assert.equal(parsed.get('keyword'), 'value');
            assert.equal(parsed.get('keyword', 'string'), 'value');
        });
        it('coerces a string to a number', () => {
            const parsed = new ConnectionString(connectionString);
            assert.equal(parsed.get('keyword', 'number'), Number.NaN);
            assert.equal(parsed.get('is0', 'number'), 0);
            assert.equal(parsed.get('is1', 'number'), 1);
        });
        it('coerces a string to a boolean', () => {
            const parsed = new ConnectionString(connectionString);
            assert.equal(parsed.get('keyword', 'boolean'), true);
        });
        it('coerces a boolean', () => {
            const parsed = new ConnectionString(connectionString);
            assert.equal(parsed.get('isTrue', 'boolean'), true);
            assert.equal(parsed.get('isFalse', 'boolean'), false);
            assert.equal(parsed.get('isYes', 'boolean'), true);
            assert.equal(parsed.get('isNo', 'boolean'), false);
            assert.equal(parsed.get('is0', 'boolean'), false);
            assert.equal(parsed.get('is1', 'boolean'), true);
        });
        it('returns undefined for missing value', () => {
            const parsed = new ConnectionString(connectionString);
            assert.equal(parsed.get('missing'), undefined);
        });
    });
    describe('.size', () => {
        it('returns the number of properties', () => {
            const parsed = new ConnectionString(connectionString);
            assert.equal(parsed.size, 7);
        });
    });
    describe('.keys()', () => {
        it('returns the keys', () => {
            const parsed = new ConnectionString(connectionString);
            assert.deepEqual(Array.from(parsed.keys()), [
                'keyword',
                'istrue',
                'isyes',
                'isfalse',
                'isno',
                'is0',
                'is1',
            ]);
        });
    });
    describe('.values()', () => {
        it('returns the values', () => {
            const parsed = new ConnectionString(connectionString);
            assert.deepEqual(Array.from(parsed.values()), [
                'value',
                'true',
                'yes',
                'false',
                'no',
                '0',
                '1',
            ]);
        });
    });
    describe('.entries()', () => {
        it('returns the entries', () => {
            const parsed = new ConnectionString(connectionString);
            assert.deepEqual(Array.from(parsed.entries()), [
                ['keyword', 'value'],
                ['istrue', 'true'],
                ['isyes', 'yes'],
                ['isfalse', 'false'],
                ['isno', 'no'],
                ['is0', '0'],
                ['is1', '1'],
            ]);
        });
    });
    describe('.toString()', () => {
        it('returns the connection string', () => {
            const parsed = new ConnectionString(connectionString);
            assert.equal(parsed.toString(), connectionString);
        });
    });
});
