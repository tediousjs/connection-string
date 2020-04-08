const { expect } = require('chai');
const { connectionStringParser } = require('../../lib/parser/connection-string');
const fixtures = require('./fixture/connection-strings');

describe('parser', () => {
    describe('connection-string', () => {
        fixtures.forEach(({name, connection_string, expected}) => {
            it(name, () => {
                expect(connectionStringParser(connection_string)).to.deep.equal(expected);
            });
        });
        it('parses a standard connection string', () => {
            // connections string lifted from MS docs
            expect(connectionStringParser("Persist Security Info=False;Integrated Security=true;Initial Catalog=Northwind;server=(local)"))
                .to.deep.equal({
                    'Persist Security Info': 'False',
                    'Integrated Security': 'true',
                    'Initial Catalog': 'Northwind',
                    'server': '(local)',
                });
        });
    });
});
