import {
    CoerceType,
    ConnectionString,
    SchemaDefinition,
    SchemaItem,
} from './connection-string';
import { build } from './builder';
import MSSQL_SCHEMA from './schema/mssql-schema';

export function parse(connectionString: string) {
    return Object.freeze(new ConnectionString(connectionString));
}

export { build, CoerceType, SchemaDefinition, SchemaItem, MSSQL_SCHEMA };
