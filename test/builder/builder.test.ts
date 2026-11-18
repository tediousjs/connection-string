import * as assert from 'node:assert';
import { describe, it } from 'node:test';
import { build, parse } from '../../src';

describe('builder', () => {
    it('quotes values with leading or trailing whitespace', () => {
        const built = build({
            leading: ' value',
            trailing: 'value ',
            both: ' value ',
            tab: '\tvalue',
            newline: 'value\n',
            inner: 'a value',
        });
        assert.equal(built, 'leading={ value};trailing={value };both={ value };tab={\tvalue};newline={value\n};inner=a value');
    });

    it('quotes values that start with a quote character', () => {
        const built = build({
            single: '\'value',
            double: '"value"',
            inner: 'val\'ue"',
        });
        assert.equal(built, 'single={\'value};double={"value"};inner=val\'ue"');
    });

    it('builds values that parse back to the same value', () => {
        const values = [' secret ', '\'abc', '"x"', '\'', '"', ' ', '\t', 'a value', 'val\'ue"', '{a}}b', 'a;b', 'a=b'];
        values.forEach((value) => {
            assert.equal(parse(build({ key: value })).get('key'), value, `round trip of ${JSON.stringify(value)}`);
        });
    });

    it('escapes `=` in keys', () => {
        const built = build({
            'a=b': '1',
            '=start': '2',
            'end=': '3',
            'a==b': '4',
        });
        assert.equal(built, 'a==b=1;==start=2;end===3;a====b=4');
    });

    it('builds keys that parse back to the same key', () => {
        const keys = ['a=b', '=start', 'end=', 'a==b', '=', 'a;b'];
        keys.forEach((key) => {
            assert.deepEqual([...parse(build({ [key]: 'value' })).entries()], [[key, 'value']], `round trip of ${JSON.stringify(key)}`);
        });
    });

    it('builds a connection string', () => {
        const built = build({
            strkey: 'value',
            booltrue: true,
            boolfalse: false,
            numkey: 123,
            needsquote: 'a}test',
            quotedquote: '{quoted}}value}',
            quoted: '{regular value}',
            badlyquoted: '{no closing quote',
            badclose: '{close}early',
            nullkey: null,
            undefinedkey: undefined,
        });
        assert.equal(built, 'strkey=value;booltrue=Yes;boolfalse=No;numkey=123;needsquote={a}}test};quotedquote={quoted}}value};quoted={regular value};badlyquoted={{no closing quote};badclose={{close}}early};nullkey=;undefinedkey=');
    });
});
