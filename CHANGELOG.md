# Changelog

## [1.0.0](https://github.com/tediousjs/connection-string/compare/v0.6.0...v1.0.0) (2025-06-08)


### ⚠ BREAKING CHANGES

* Replace `connectionStringParser()` with `parse()` method. Rename
`buildConnectionString()` to `build()`. Remove `parseSqlConnectionString` and
replace with a way to transform parsed connection strings into a specific
object schema (see ConnectionString.toSchema()`).
* Drop support for non-LTS Node.js versions and upgrade
the typescript version to support the newer JS features.

### Features

* bump minimum node support to v20 & update typescript ([5d8e090](https://github.com/tediousjs/connection-string/commit/5d8e09060d45cb2270b7d641cec10794ea2005f1))
* create new parser to return readonly map when parsing connecton strings ([b8ee936](https://github.com/tediousjs/connection-string/commit/b8ee936021bb64c3afaacf87f7373db66dbb27cb))
* refactor parsing interface ([41dbc3d](https://github.com/tediousjs/connection-string/commit/41dbc3d2da1dab9fd8d60e278e882eaee7a1c372))

## [0.6.0](https://github.com/tediousjs/connection-string/compare/v0.5.0...v0.6.0) (2024-09-11)


### Features

* add more authentication options ([cae1d20](https://github.com/tediousjs/connection-string/commit/cae1d2054c622dbd5e707e54bbaccccccd171f01))

## [0.5.0](https://github.com/tediousjs/connection-string/compare/v0.4.4...v0.5.0) (2023-08-09)


### Features

* add connection string builder ([369a63f](https://github.com/tediousjs/connection-string/commit/369a63f03f263d81f576fb9f38afd80cf3b95f96))

## [0.4.4](https://github.com/tediousjs/connection-string/compare/v0.4.3...v0.4.4) (2023-08-02)


### Bug Fixes

* update typings ([bbd7ddc](https://github.com/tediousjs/connection-string/commit/bbd7ddcc9c3fe848e31267c40176eb337855d5c4))

## [0.4.3](https://github.com/tediousjs/connection-string/compare/v0.4.2...v0.4.3) (2023-08-01)


### Bug Fixes

* add readme badges ([787da44](https://github.com/tediousjs/connection-string/commit/787da44258a40111527ecd4a145577e0319d7cb1))

## [0.4.2](https://github.com/tediousjs/connection-string/compare/v0.4.1...v0.4.2) (2023-08-01)


### Bug Fixes

* update return types for parsers ([bb6393a](https://github.com/tediousjs/connection-string/commit/bb6393a7456afd5cb5759e63c3f9ec2a9e0b8f48))

## v0.4.2 (2023-01-19)

- Fix bug with parsing string values that start with numbers

## v0.4.1 (2022-06-07)

- Add missing type declarations

## v0.4.0 (2022-04-27)

- Add LICENSE file (MIT) #17
- Improve library code / TS definitions #18
- Dependency updates

## v0.3.0 (2021-01-21)

- Allow parsed SQL connection strings to return unrecognised properties #4

## v0.2.0 (2021-01-21)

- Parsed query strings return lowercase keys #3

## v0.1.0 (2021-01-21)

Initial release
