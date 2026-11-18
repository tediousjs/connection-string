# Connection String Parser

[![npm version](https://badge.fury.io/js/@tediousjs%2Fconnection-string.svg)](https://www.npmjs.com/package/@tediousjs/connection-string)
[![Lint, Test & Release](https://github.com/tediousjs/connection-string/actions/workflows/nodejs.yml/badge.svg)](https://github.com/tediousjs/connection-string/actions/workflows/nodejs.yml)

This node library is designed to allow the parsing of Connection Strings see https://docs.microsoft.com/en-us/dotnet/api/system.data.sqlclient.sqlconnection.connectionstring

The library also provides the ability to parse SQL Connection Strings.

# Usage

## Parsing connection strings

The library comes with a generic connection string parser that will parse through valid connection strings and produce a key-value
readonly Map of the entries in that string. No additional validation is performed.

```js
const { parse } = require('@tediousjs/connection-string');

const connectionString = 'User ID=user;Password=password;Initial Catalog=AdventureWorks;Server=MySqlServer';

const parsed = parse(connectionString);

console.log(parsed);
```

Output to the console will be:

```
Map(4) {
  'user id' => 'user',
  'password' => 'password',
  'initial catalog' => 'AdventureWorks',
  'server' => 'MySqlServer'
}
```

## Parsing SQL connection strings

SQL connection strings can be parsed to a JSON object using the `toSchema()` method and the provided
`MSSQL_SCHEMA`.

```js
const { parse, MSSQL_SCHEMA } = require('@tediousjs/connection-string');

const connectionString = 'User ID=user;Password=password;Initial Catalog=AdventureWorks;Server=MySqlServer';

const parsed = parse(connectionString);

console.log(parsed.toSchema(MSSQL_SCHEMA));
```

Output to console will be:

```json
{
  "data source": "MySqlServer",
  "initial catalog": "AdventureWorks",
  "password": "password",
  "user id":"user"
}
```

NB: The `Server` property from the connection string has been re-written to the value `Data Source`

## Custom schemas

If you need to parse a connection string into a custom schema, the format is as follows:

```ts
import { parse } from '@tediousjs/connection-string';

// a keyed map of name => config
const schema = {
    'a string': {
        type: 'string',
        default: 'a default value',
        aliases: ['other', 'allowed', 'names'],
    },
    'a number': {
        type: 'number',
        default: 123,
    },
    'a boolean': {
        type: 'boolean',
        default: true,
    },
};

const parsed = parse('a string=test;a number=987;a boolean=false;other value=missing');
console.log(parsed.toSchema(schema));
```

Output:

```json
{
  "a string": "test",
  "a number": 987,
  "a boolean": false
}
```

Keys that are not in the connection string are left out. To include them with their `default` value, use `toSchema(schema, { includeMissing: true })`.

An empty value for a `boolean` or `number` key, such as `a number=;`, means that the value is not set. The key is included with its `default` value (or `undefined` if it has no default). An empty value for a `string` key stays an empty string.

## Accessing properties

The parsed connection string object is a readonly `Map` with an overloadded `get()` method allowing
coercion of the value:

```ts
import { parse } from '@tediousjs/connection-string';
const parsed = parse('a string=test;a number=987;a boolean=false;other value=missing');
// all values are strings by default
console.log(parsed.get('a number')); // "987"
// values can be coersed to an expected type
console.log(parsed.get('a number', 'number')); // 987
// coersion will be permissive in its type coersion
console.log(parsed.get('a number', 'boolean')); // true
```

`get(key, 'boolean')` gives `false` for `false`, `no` and `0`, in any case and with any surrounding whitespace, and for an empty value. Any other value gives `true`. `get(key, 'number')` uses `parseInt()`. For an empty value, `toSchema()` uses the schema default instead (see [Custom schemas](#custom-schemas)).
