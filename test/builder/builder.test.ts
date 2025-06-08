import * as assert from 'node:assert';
import { describe, it } from 'node:test';
import { build } from '../../src';

describe('builder', () => {
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
