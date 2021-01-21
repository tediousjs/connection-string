export interface CollectionConfig {
    terminator: string,
    quotes: {[index: string]: string},
}

export interface ParserConfig {
    key: CollectionConfig,
    value: CollectionConfig,
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
            "'": "'",
            '{': '}',
        },
    },
});

export default function connectionStringParser(connectionString: string, parserConfig: ParserConfig = CONFIG): object {
    const parsed: {[index: string]: string} = {};
    let collectionMode = CollectionMode.key;
    let started: boolean = false;
    let finished: boolean = false;
    let quoted: boolean = false;
    let quote: string = '';
    let buffer: string = '';
    let currentKey: string = '';
    let pointer: number = 0;

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
        return collectionMode === CollectionMode.key ? parserConfig.key : parserConfig.value
    }

    function isTerminator(char: string): boolean {
        return config().terminator === char;
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
                currentKey = buffer;
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
            if (!started) {
                if (current.trim()) {
                    start();
                    if (isStartQuote(current)) {
                        quoted = true;
                        quote = current;
                    } else {
                        push(current);
                    }
                }
            } else {
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
                    if (current === next) {
                        push(current);
                        pointer++;
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
