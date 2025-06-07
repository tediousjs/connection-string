import connectionStringParser from './parser/connection-string';

interface CoerceTypeMap {
    string: string;
    number: number;
    boolean: boolean;
}

type CoerceType = keyof CoerceTypeMap;

type InferSchema<T extends SchemaDefinition> = {
    [K in keyof T]: T[K]['type'] extends CoerceType
        ? CoerceTypeMap[T[K]['type']]
        : string;
};

interface SchemaItem<T extends CoerceType = 'string'> {
    type?: T;
    default?: CoerceTypeMap[T];
    aliases?: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SchemaDefinition = Record<string, SchemaItem<any>>;

class ConnectionString implements ReadonlyMap<string, string> {
    readonly #connectionString: string;
    readonly #parsed: ReadonlyMap<string, string>;
    constructor(connectionString: string) {
        this.#connectionString = connectionString.toString();
        const parsed = connectionStringParser(this.#connectionString);
        this.#parsed = new Map<string, string>(Object.entries(parsed));
    }

    get size(): number {
        return this.#parsed.size;
    }

    // it would be really nice to be able to make this a generice (eg: get<string>) and that would then coerce the value
    // see typia library for an example of something similar
    get<T extends CoerceType = 'string'>(key: string, coerceType?: T): CoerceTypeMap[T] | undefined {
        const val = this.#parsed.get(key);
        const actualType = coerceType ?? 'string';
        if (typeof val === 'undefined' || actualType === 'string') {
            return val as CoerceTypeMap[T];
        }
        switch (actualType) {
            case 'boolean':
                // a really liberal interpretation of "false" - "" "0" and "false" are false, everything else is true
                return (val === '0' || val.toLowerCase() === 'false' ? false : !!val) as CoerceTypeMap[T];
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
    toSchema<T extends SchemaDefinition>(schema: T): InferSchema<T> {
        return Object.fromEntries(Object.entries(schema).map(([key, { type, default: defaultValue, aliases }]) => {
            // try to find the property
            const prop = [key, ...aliases ?? []].find((k) => this.has(k));
            return [key, prop ? this.get(prop, type) : defaultValue];
        })) as InferSchema<T>;
    }
}

export default function parse(connectionString: string) {
    return Object.freeze(new ConnectionString(connectionString));
}
