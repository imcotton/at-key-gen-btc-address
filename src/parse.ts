import { parseArgs, type ParseArgsOptionsConfig } from 'node:util';





export type Result = ReturnType<typeof parse>;

export function parse (args: Iterable<string>) {

    const { values, positionals } = parseArgs({
        args: Array.from(args),
        allowPositionals: true,
        options,
    });

    const { format, account, num, ...rest } = values;

    assert_purpose(format);

    const purpose = kinds[format];

    if (Number.isSafeInteger(Number(account)) === false) {
        throw new Error('invalid account index', { cause: account });
    }

    const n = Number(num) || 1;

    const sentence = positionals.length > 0
        ? positionals.join(' ')
        : void 0
    ;

    return { format, purpose, account, n, sentence, ...rest };

}





const options = {

    num: {
        short: 'n',
        type: 'string',
    },

    format: {
        short: 'f',
        type: 'string',
        default: 'wpkh',
    },

    account: {
        short: 'a',
        type: 'string',
        default: '0',
    },

    passphrase: {
        short: 'p',
        type: 'string',
    },

    verbose: {
        short: 'v',
        type: 'boolean',
    },

    help: {
        short: 'h',
        type: 'boolean',
    },

} satisfies ParseArgsOptionsConfig;





const kinds = { pkh: '44', wpkh: '84', tr: '86' } as const;

export type Purpose = keyof typeof kinds;





function assert_purpose (type: string): asserts type is Purpose {

    if (type in kinds) {
        return;
    }

    throw new Error('invalid Purpose', { cause: type });

}

