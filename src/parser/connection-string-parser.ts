export interface CollectionConfig {
    terminator: string;
    quotes: Record<string, string>;
}

export interface ParserConfig {
    key: CollectionConfig;
    value: CollectionConfig;
}

enum CollectionMode {
    key,
    value,
}

const CONFIG: ParserConfig = Object.freeze({
    key: {
        terminator: '=',
        quotes: {},
    },
    value: {
        terminator: ';',
        quotes: {
            '"': '"',
            '\'': '\'',
            '{': '}',
        },
    },
});

export default function connectionStringParser(connectionString: string, parserConfig: ParserConfig = CONFIG): Record<string, string> {
    const parsed: Record<string, string> = {};
    let collectionMode = CollectionMode.key;
    let started = false;
    let finished = false;
    let quoted = false;
    let quote = '';
    let buffer = '';
    let currentKey = '';
    let pointer = 0;

    function start(): void {
        started = true;
    }

    function finish(): void {
        finished = true;
    }

    function reset(): void {
        started = false;
        finished = false;
        quoted = false;
        quote = '';
        buffer = '';
    }

    function config(): CollectionConfig {
        return collectionMode === CollectionMode.key ? parserConfig.key : parserConfig.value;
    }

    function isTerminator(char: string): boolean {
        return config().terminator === char;
    }

    function isSkippable(char: string): boolean {
        // whitespace before a key or value, or an extra `;` before a key
        return !char.trim() || (collectionMode === CollectionMode.key && char === parserConfig.value.terminator);
    }

    function isStartQuote(char: string): boolean {
        return Object.keys(config().quotes).some((val: string) => char === val);
    }

    function isEndQuote(char: string): boolean {
        return quoted && char === config().quotes[quote];
    }

    function push(char: string): void {
        buffer += char;
    }

    function collect(): void {
        if (!quoted) {
            buffer = buffer.trim();
        }
        switch (collectionMode) {
            case CollectionMode.key:
                currentKey = buffer.toLowerCase();
                collectionMode = CollectionMode.value;
                break;
            case CollectionMode.value:
                collectionMode = CollectionMode.key;
                parsed[currentKey] = buffer;
                currentKey = '';
                break;
        }
        reset();
    }

    while (pointer < connectionString.length) {
        const current = connectionString.charAt(pointer);
        if (!finished) {
            if (!started && isSkippable(current)) {
                // nothing to collect yet
            } else if (!started && isStartQuote(current)) {
                start();
                quoted = true;
                quote = current;
            } else {
                // the first character can also be a terminator, for example in an
                // empty value (`Key=;`) or in a key that starts with `==`
                start();
                if (quoted && isEndQuote(current)) {
                    const next = connectionString.charAt(pointer + 1);
                    if (current === next) {
                        push(current);
                        pointer++;
                    } else {
                        finish();
                    }
                } else if (!quoted && isTerminator(current)) {
                    const next = connectionString.charAt(pointer + 1);
                    // `==` is an escaped `=` in a key; a `;` always ends an unquoted value
                    if (collectionMode === CollectionMode.key && current === next) {
                        push(current);
                        pointer++;
                    } else if (collectionMode === CollectionMode.key && buffer === '') {
                        throw new Error('Malformed connection string');
                    } else {
                        collect();
                    }
                } else {
                    push(current);
                }
            }
        } else if (isTerminator(current)) {
            collect();
        } else if (current.trim()) {
            throw new Error('Malformed connection string');
        }
        pointer++;
    }
    if (quoted && !finished) {
        throw new Error('Connection string terminated unexpectedly');
    } else {
        collect();
    }

    return parsed;
}
