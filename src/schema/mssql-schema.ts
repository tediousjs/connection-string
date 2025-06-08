import { SchemaDefinition } from '../connection-string';

const mssqlSchema: SchemaDefinition = {
    'application name': {
        type: 'string',
        aliases: ['app'],
    },
    'applicationintent': {
        type: 'string',
        default: 'ReadWrite',
    },
    'asynchronous processing': {
        type: 'boolean',
        default: false,
        aliases: ['Async'],
    },
    'attachdbfilename': {
        type: 'string',
        aliases: ['extended properties', 'initial file name'],
    },
    'authentication': {
        type: 'string',
    },
    'column encryption setting': {
        type: 'string',
    },
    'connection timeout': {
        type: 'number',
        aliases: ['connect timeout', 'timeout'],
        default: 15,
    },
    'connection lifetime': {
        type: 'number',
        aliases: ['load balance timeout'],
        default: 0,
    },
    'connectretrycount': {
        type: 'number',
        default: 1,
    },
    'connectretryinterval': {
        type: 'number',
        default: 10,
    },
    'context connection': {
        type: 'boolean',
        default: false,
    },
    'current language': {
        aliases: ['language'],
        type: 'string',
    },
    'data source': {
        aliases: ['addr', 'address', 'server', 'network address'],
        type: 'string',
    },
    'encrypt': {
        type: 'boolean',
        default: false,
    },
    'enlist': {
        type: 'boolean',
        default: true,
    },
    'failover partner': {
        type: 'string',
    },
    'initial catalog': {
        type: 'string',
        aliases: ['database'],
    },
    'integrated security': {
        type: 'boolean',
        aliases: ['trusted_connection'],
    },
    'max pool size': {
        type: 'number',
        default: 100,
    },
    'min pool size': {
        type: 'number',
        default: 0,
    },
    'multipleactiveresultsets': {
        type: 'boolean',
        default: false,
    },
    'multisubnetfailover': {
        type: 'boolean',
        default: false,
    },
    'network library': {
        type: 'string',
        aliases: ['network', 'net'],
    },
    'packet size': {
        type: 'number',
        default: 8000,
    },
    'password': {
        type: 'string',
        aliases: ['pwd'],
    },
    'persist security info': {
        type: 'boolean',
        aliases: ['persistsecurityinfo'],
        default: false,
    },
    'poolblockingperiod': {
        type: 'number',
        default: 0,
    },
    'pooling': {
        type: 'boolean',
        default: true,
    },
    'replication': {
        type: 'boolean',
        default: false,
    },
    'transaction binding': {
        type: 'string',
        default: 'Implicit Unbind',
    },
    'transparentnetworkipresolution': {
        type: 'boolean',
        default: true,
    },
    'trustservercertificate': {
        type: 'boolean',
        default: false,
    },
    'type system version': {
        type: 'string',
    },
    'user id': {
        type: 'string',
        aliases: ['uid'],
    },
    'user instance': {
        type: 'boolean',
        default: false,
    },
    'workstation id': {
        type: 'string',
        aliases: ['wsid'],
    },
};

export default mssqlSchema;
