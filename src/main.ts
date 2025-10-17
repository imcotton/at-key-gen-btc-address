import { stdin } from 'node:process';
import { text } from 'node:stream/consumers';

import { HDKey } from '@scure/bip32';
import { mnemonicToSeedWebcrypto } from '@scure/bip39';
import { getAddress } from '@scure/btc-signer/payment.js';

import type { Purpose, Result } from './parse.ts';
import { USAGE } from './help.ts';





export async function main (
// deno-coverage-ignore-start

        {

            format, purpose, account, change,
            sentence, passphrase,
            n, verbose, help,

        }: Result,

        print = console.log,

        text_stdin = (() => text(stdin)) as IO_or_Task<string>,

// deno-coverage-ignore-stop
) {

    if (help) {
        return print(USAGE);
    }

    const coin = '0';

    const mnemonic = sentence ?? await text_stdin();

    const keys = await mnemonicToSeedWebcrypto(mnemonic.trim(), passphrase)

        .then(HDKey.fromMasterSeed)

        .then(make(`m/${ purpose }'/${ coin }'/${ account }'/${ change }`))

    ;

    const entries = keys.map(payment(format));

    for (const { path, address } of entries.take(n)) {

        if (verbose) {

            print(path, address);

        } else {

            print(address);

        }

    }

}





export function payment (type: Purpose) {

    return function ({ key, path, index }: {

            key: HDKey,
            path: string,
            index: number,

    }) {

        if (key.privateKey == null) {
            throw new Error('no private key');
        }

        // deno-lint-ignore no-non-null-assertion
        const address = getAddress(type, key.privateKey)!;

        key.wipePrivateData();

        return { index, path, address };

    };

}





function make (prefix: string) {

    return function * (root: HDKey) {

        let index = 0;

        try {

            while (true) {

                const path = `${ prefix }/${ index }`;

                const key = root.derive(path);

                yield { key, path, index };

                index += 1;

            }

        } finally {

            root.wipePrivateData();

        }

    };

}





type         IO <T> = () => T;
type       Task <T> = () => Promise<T>;
type IO_or_Task <T> = IO<T> | Task<T>;

