# Connection String Parser

This node library is designed to allow the parsing of Connection Strings see https://docs.microsoft.com/en-us/dotnet/api/system.data.sqlclient.sqlconnection.connectionstring

The library also provides the ability to pares SQL Connection Strings.

# Usage

## Parsing connection strings

The library comes with a generic connection string parser that will parse through valid connections strings and produce a key-value
map of the entries in that string. No additional validation is performed.

```js
const { parseConnectionString } = require('@tediousjs/connection-string');

const connectionString = 'User ID=user;Password=password;Initial Catalog=AdventureWorks;Server=MySqlServer';

const parsed = parseConnectionString(connectionString);

console.log(parsed);
```

Output to the console will be:

```json
{
  "User ID": "user",
  "Password": "password",
  "Initial Catalog": "AdventureWorks",
  "Server": "MySqlServer"
}
```

## Parsing SQL connection strings

There is a specific helper for parsing SQL connection strings and this comes with a value normaliser and validation. It also has an
option to "canonicalise" the properties. For many properties in an SQL connections string, there are aliases, when canoncical properties
are being used, these aliases will be returned as the canonical property.

```js
const { parseMssqlConnectionString } = require('@tediousjs/connection-string');

const connectionString = 'User ID=user;Password=password;Initial Catalog=AdventureWorks;Server=MySqlServer';

const parsed = parseConnectionString(connectionString, true);

console.log(parsed);
```

Output to console will be:

```json
{
  "User ID": "user",
  "Password": "password",
  "Initial Catalog": "AdventureWorks",
  "Data Source": "MySqlServer"
}
```

NB: The `Server` property from the connection string has been re-written to the value `Data Source`
