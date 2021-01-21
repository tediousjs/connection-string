import parseConnectionString from "./connection-string";

export enum SchemaTypes {
    BOOL,
    STRING,
    NUMBER,
}

export interface SchemaItem {
    type: SchemaTypes,
    allowedValues?: any[],
    default?: any,
    aliases?: string[],
    canonical?: string,
    coerce?(val: string): any,
    validator?(val: any): boolean,
}

export interface SchemaDefinition {
    [name: string]: SchemaItem,
}

// schema for MSSQL connection strings (https://docs.microsoft.com/en-us/dotnet/api/system.data.sqlclient.sqlconnection.connectionstring)
export const SCHEMA: SchemaDefinition = {
    'Application Name': {
        type: SchemaTypes.STRING,
        aliases: ['App'],
        validator(val: string) {
            return val.length <= 128;
        },
    },
    'ApplicationIntent': {
        type: SchemaTypes.STRING,
        allowedValues: ['ReadOnly', 'ReadWrite'],
        default: 'ReadWrite',
    },
    'Asynchronous Processing': {
        type: SchemaTypes.BOOL,
        default: false,
        aliases: ['Async'],
    },
    'AttachDBFilename': {
        type: SchemaTypes.STRING,
        aliases: ['Extended Properties', 'Initial File Name'],
    },
    'Authentication': {
        type: SchemaTypes.STRING,
        allowedValues: ['Active Directory Integrated', 'Active Directory Password', 'Sql Password'],
    },
    'Column Encryption Setting': {
        type: SchemaTypes.STRING,
    },
    'Connection Timeout': {
        type: SchemaTypes.NUMBER,
        aliases: ['Connect Timeout', 'Timeout'],
        default: 15,
    },
    'Connection Lifetime': {
        type: SchemaTypes.NUMBER,
        aliases: ['Load Balance Timeout'],
        default: 0,
    },
    'ConnectRetryCount': {
        type: SchemaTypes.NUMBER,
        default: 1,
        validator(val: number): boolean {
            return val > 0 && val <= 255;
        },
    },
    'ConnectRetryInterval': {
        type: SchemaTypes.NUMBER,
        default: 10,
    },
    'Context Connection': {
        type: SchemaTypes.BOOL,
        default: false,
    },
    'Current Language': {
        aliases: ['Language'],
        type: SchemaTypes.STRING,
        validator(val: string): boolean {
            return val.length <= 128;
        },
    },
    'Data Source': {
        aliases: ['Addr', 'Address', 'Server', 'Network Address'],
        type: SchemaTypes.STRING,
    },
    'Encrypt': {
        type: SchemaTypes.BOOL,
        default: false,
    },
    'Enlist': {
        type: SchemaTypes.BOOL,
        default: true,
    },
    'Failover Partner': {
        type: SchemaTypes.STRING,
    },
    'Initial Catalog': {
        type: SchemaTypes.STRING,
        aliases: ['Database'],
        validator(val: string): boolean {
            return val.length <= 128;
        },
    },
    'Integrated Security': {
        type: SchemaTypes.BOOL,
        aliases: ['Trusted_Connection'],
        coerce(val: string): any {
            return val === 'sspi' || null;
        },
    },
    'Max Pool Size': {
        type: SchemaTypes.NUMBER,
        default: 100,
        validator(val: number): boolean {
            return val >= 1;
        },
    },
    'Min Pool Size': {
        type: SchemaTypes.NUMBER,
        default: 0,
        validator(val: number): boolean {
            return val >= 0;
        },
    },
    'MultipleActiveResultSets': {
        type: SchemaTypes.BOOL,
        default: false,
    },
    'MultiSubnetFailover': {
        type: SchemaTypes.BOOL,
        default: false,
    },
    'Network Library': {
        type: SchemaTypes.STRING,
        aliases: ['Network', 'Net'],
        allowedValues: ['dbnmpntw', 'dbmsrpcn', 'dbmsadsn', 'dbmsgnet', 'dbmslpcn', 'dbmsspxn', 'dbmssocn', 'Dbmsvinn'],
    },
    'Packet Size': {
        type: SchemaTypes.NUMBER,
        default: 8000,
        validator(val: number): boolean {
            return val >= 512 && val <= 32768;
        },
    },
    'Password': {
        type: SchemaTypes.STRING,
        aliases: ['PWD'],
        validator(val: string): boolean {
            return val.length <= 128;
        },
    },
    'Persist Security Info': {
        type: SchemaTypes.BOOL,
        aliases: ['PersistSecurityInfo'],
        default: false,
    },
    'PoolBlockingPeriod': {
        type: SchemaTypes.NUMBER,
        default: 0,
        coerce(val: string): any {
            switch (val.toLowerCase()) {
                case 'alwaysblock':
                    return 1;
                case 'auto':
                    return 0;
                case 'neverblock':
                    return 2;
            }
            return null;
        },
    },
    'Pooling': {
        type: SchemaTypes.BOOL,
        default: true,
    },
    'Replication': {
        type: SchemaTypes.BOOL,
        default: false,
    },
    'Transaction Binding': {
        type: SchemaTypes.STRING,
        allowedValues: ['Implicit Unbind', 'Explicit Unbind'],
        default: 'Implicit Unbind',
    },
    'TransparentNetworkIPResolution': {
        type: SchemaTypes.BOOL,
        default: true,
    },
    'TrustServerCertificate': {
        type: SchemaTypes.BOOL,
        default: false,
    },
    'Type System Version': {
        type: SchemaTypes.STRING,
        allowedValues: ['SQL Server 2012', 'SQL Server 2008', 'SQL Server 2005', 'Latest'],
    },
    'User ID': {
        type: SchemaTypes.STRING,
        aliases: ['UID'],
        validator(val: string): boolean {
            return val.length <= 128;
        },
    },
    'User Instance': {
        type: SchemaTypes.BOOL,
        default: false,
    },
    'Workstation ID': {
        type: SchemaTypes.STRING,
        aliases: ['WSID'],
        validator(val: string): boolean {
            return val.length <= 128;
        },
    },
};

function guessType(value: string): SchemaTypes {
    if (value.trim() === '') {
        return SchemaTypes.STRING;
    }
    if (!Number.isNaN(parseInt(value, 10))) {
        return SchemaTypes.NUMBER;
    }
    if (['true', 'false', 'yes', 'no'].includes(value.toLowerCase())) {
        return SchemaTypes.BOOL;
    }
    return SchemaTypes.STRING;
}

function coerce(value: string, type: SchemaTypes, coercer?: (val: string) => any) {
    if (coercer) {
        const coerced = coercer(value);
        if (coerced !== null) {
            return coerced;
        }
    }
    switch (type) {
        case SchemaTypes.BOOL:
            if (['true', 'yes', '1'].includes(value.toLowerCase())) {
                return true;
            }
            if (['false', 'no', '0'].includes(value.toLowerCase())) {
                return false;
            }
            return value;
        case SchemaTypes.NUMBER:
            return parseInt(value, 10);
    }

    return value;
}

function validate(value: any, allowedValues?: any[], validator?: (val: any) => boolean) {
    let valid = true;
    if (validator) {
        valid = validator(value);
    }
    if (valid) {
        valid = allowedValues?.includes(value) || false;
    }
    return valid;
}

export default function parseSqlConnectionString(connectionString: string, canonicalProps: boolean = false, allowUnknown: boolean = false, strict: boolean = false, schema: SchemaDefinition = SCHEMA) {
    const flattenedSchema = Object.entries(schema).reduce((flattened: SchemaDefinition, [key, item]) => {
        Object.assign(flattened, {
            [key.toLowerCase()]: item,
        });
        return item.aliases?.reduce((accum, alias: string) => {
            return Object.assign(accum, {
                [alias.toLowerCase()]: {
                    ...item,
                    canonical: key.toLowerCase(),
                },
            });
        }, flattened) || flattened;
    }, {});
    return Object.entries(parseConnectionString(connectionString)).reduce((config, [prop, value]) => {
        if (!Object.prototype.hasOwnProperty.call(flattenedSchema, prop)) {
            return Object.assign(config, {
                [prop]: coerce(value, guessType(value)),
            });
        }
        let coercedValue = coerce(value, flattenedSchema[prop].type, flattenedSchema[prop].coerce);
        if (strict && !validate(coercedValue, flattenedSchema[prop].allowedValues, flattenedSchema[prop].validator)) {
            coercedValue = flattenedSchema[prop].default;
        }
        const propName = canonicalProps ? flattenedSchema[prop].canonical || prop : prop;
        return Object.assign(config, {
            [propName]: coercedValue,
        });
    }, {});
}
