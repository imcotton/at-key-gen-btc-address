import { parseArgs, type ParseArgsOptionsConfig } from 'node:util';





export type Result = ReturnType<typeof parse>;

export function parse (args: Iterable<string>) {

    const { values, positionals } = parseArgs({
        args: Array.from(args),
        allowPositionals: true,
        options,
    });

    const {

        format, account, internal, num,

        'root-xprv': root_xprv,
        'extend-xpub': extend_xpub,

        ...rest

    } = values;

    assert_purpose(format);

    const purpose = kinds[format];

    if (Number.isSafeInteger(Number(account)) === false) {
        throw new Error('invalid account index', { cause: account });
    }

    const change = internal ? 1 : 0;

    const n = Number(num) || 1;

    const sentence = positionals.length > 0
        ? positionals.join(' ')
        : positionals.at(0)
    ;

    return {

        format, purpose, account, change, n, sentence,

        root_xprv, extend_xpub,

        ...rest

    };

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

    internal: {
        short: 'i',
        type: 'boolean',
    },

    passphrase: {
        short: 'p',
        type: 'string',
    },

    'root-xprv': {
        type: 'boolean',
    },

    'extend-xpub': {
        type: 'boolean',
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

