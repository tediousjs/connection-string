import { inspect } from 'node:util';
import connectionStringParser from './parser/connection-string-parser';

interface CoerceTypeMap {
    string: string;
    number: number;
    boolean: boolean;
}

export type CoerceType = keyof CoerceTypeMap;

type InferSchema<T extends SchemaDefinition> = {
    [K in keyof T]: T[K]['type'] extends CoerceType
        ? CoerceTypeMap[T[K]['type']]
        : string;
};

export interface SchemaItem<T extends CoerceType = 'string'> {
    type?: T;
    default?: CoerceTypeMap[T];
    aliases?: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SchemaDefinition = Record<string, SchemaItem<any>>;

export class ConnectionString implements ReadonlyMap<string, string> {
    readonly #connectionString: string;
    readonly #parsed: ReadonlyMap<string, string>;
    constructor(connectionString: string) {
        this.#connectionString = connectionString.toString();
        const parsed = connectionStringParser(this.#connectionString);
        this.#parsed = new Map<string, string>(Object.entries(parsed));
    }

    [inspect.custom]() {
        return this.#parsed;
    }

    get size(): number {
        return this.#parsed.size;
    }

    // it would be really nice to be able to make this a generice (eg: get<string>) and that would then coerce the value
    // see typia library for an example of something similar
    get<T extends CoerceType = 'string'>(key: string, coerceType?: T): CoerceTypeMap[T] | undefined {
        const val = this.#parsed.get(key.toLowerCase());
        const actualType = coerceType ?? 'string';
        if (typeof val === 'undefined' || actualType === 'string') {
            return val as CoerceTypeMap[T];
        }
        switch (actualType) {
            case 'boolean':
                return (['false', 'no', '0'].includes(val.toLowerCase()) ? false : !!val) as CoerceTypeMap[T];
            case 'number':
                return parseInt(val, 10) as CoerceTypeMap[T];
            default:
                throw new TypeError('Coerce type not supported');
        }
    }

    keys(): MapIterator<string> {
        return this.#parsed.keys();
    }

    values(): MapIterator<string> {
        return this.#parsed.values();
    }

    [Symbol.iterator](): MapIterator<[string, string]> {
        return this.#parsed[Symbol.iterator]();
    }

    entries() {
        return this.#parsed.entries();
    }

    toString() {
        return this.#connectionString;
    }

    has(key: string) {
        return this.#parsed.has(key.toLowerCase());
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    forEach(callbackfn: (value: string, key: string, map: ReadonlyMap<string, string>) => void, thisArg?: any): void {
        this.#parsed.forEach((value, key) => {
            callbackfn.call(thisArg ?? this, value, key, this);
        });
    }

    // a way to extract a formatted object from the connection string
    toSchema<T extends SchemaDefinition>(schema: T, { includeMissing }: { includeMissing?: boolean } = {}): InferSchema<T> {
        return Object.fromEntries(Object.entries(schema).reduce((props, [key, { type, default: defaultValue, aliases }]) => {
            // try to find the property
            const prop = [key, ...aliases ?? []].find((k) => this.has(k));
            if (prop || includeMissing) {
                props.push([key, prop ? this.get(prop.toLowerCase(), type) : defaultValue] as [keyof T, CoerceType]);
            }
            return props;
        }, [] as [keyof T, CoerceType][])) as InferSchema<T>;
    }
}
