import { buildConnectionString } from '../../src/builder';
import { expect } from 'chai';

describe('builder', () => {
    it('builds a connection string', () => {
        const built = buildConnectionString({
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
        expect(built).to.equal('strkey=value;booltrue=Yes;boolfalse=No;numkey=123;needsquote={a}}test};quotedquote={quoted}}value};quoted={regular value};badlyquoted={{no closing quote};badclose={{close}}early};nullkey=;undefinedkey=');
    });
});
