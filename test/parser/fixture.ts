import { SchemaDefinition } from '../../src';

export type Fixture = {
    name: string;
    connection_string: string;
    expected: Record<string, string>;
    only?: boolean;
    skip?: boolean;
    additionalSchema: SchemaDefinition;
};
