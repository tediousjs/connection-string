type ValidDataTypes = string | boolean | number | null | undefined | { toString(): string };

function isQuoted(val: string): boolean {
    if (val[0] !== '{') {
        return false;
    }
    for (let i = 1; i < val.length; i++) {
        if (val[i] === '}') {
            if (i + 1 === val.length) {
                // if last char, then it's quoted properly
                return true;
            } else if (val[i + 1] !== '}') {
                // the next char is no a `}` so there is no valid escaping here
                return false;
            } else {
                // we are seeing an escaped `}`, so skip ahead
                i++;
            }
        }
    }
    return false;
}

function needsQuotes(val: string): boolean {
    return !isQuoted(val) && !!val.match(/\[|]|{|}|\|\(|\)|,|;|\?|\*|=|!|@/)?.length;
}

function encodeTuple(key: string, value: ValidDataTypes): [string, string] {
    if (value === null || value === undefined) {
        return [key, ''];
    }
    switch (typeof value) {
        case 'boolean':
            return [key, value ? 'Yes' : 'No'];
        default: {
            const strVal = (value as { toString(): string }).toString();
            if (needsQuotes(strVal)) {
                return [key, `{${strVal.replace(/}/g, '}}')}}`];
            }
            return [key, strVal];
        }
    }
}

export function build(data: Record<string, ValidDataTypes>): string {
    return Object.entries(data).map(([key, value]) => {
        return encodeTuple(key.trim(), value).join('=');
    }).join(';');
}
