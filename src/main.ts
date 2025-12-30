import { stdin } from 'node:process';
import { text } from 'node:stream/consumers';

import { HDKey } from '@scure/bip32';
import { mnemonicToSeedWebcrypto } from '@scure/bip39';

import type { Purpose, Result } from './parse.ts';
import { get_address } from './lib.ts';
import { USAGE } from './help.ts';





export async function main (
// deno-coverage-ignore-start

        {

            format, purpose, account, change,
            sentence, passphrase,
            root_xprv, extend_xpub,
            xprv, xpub,
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

    const xprv_OR_xpub = xprv || xpub;

    const key = xprv_OR_xpub

        ? Promise.resolve(xprv_OR_xpub)
            .then(HDKey.fromExtendedKey)

        : Promise.resolve(sentence)
            .then(otherwise(text_stdin))
            .then(seed_with(passphrase))
            .then(HDKey.fromMasterSeed)

    ;

    const { root, extend, derive } = await key.then(make({

        purpose, coin, account,

        harden: xpub?.startsWith('xpub') === true,

    }));

    if (root_xprv) {
        print(root.privateExtendedKey);
        root.wipePrivateData();
        return;
    }

    if (extend_xpub) {
        print(extend.publicExtendedKey);
        root.wipePrivateData();
        return;
    }

    const entries = derive(change).map(payment(format));

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

        const address = get_address(type, key);

        key.wipePrivateData();

        return { index, path, address };

    };

}





function make ({ purpose, coin, account, harden = false }: {

        purpose: string,
        coin: string,
        account: string,
        harden?: boolean,

}) {

    const prefix = harden
        ? `m/-/-/-`
        : `m/${ purpose }'/${ coin }'/${ account }'`
    ;

    return function (root: HDKey) {

        const extend = harden ? root : root.derive(prefix);

        function * derive (change: number) {

            const extend_change = extend.deriveChild(change);

            let index = 0;

            try {

                while (true) {

                    const path = [ prefix, change, index ].join('/');

                    const key = extend_change.deriveChild(index);

                    yield { key, path, index };

                    index += 1;

                }

            } finally {

                root.wipePrivateData();

            }

        }

        return { root, extend, derive };

    };

}





function seed_with (passphrase?: string) {

    return (mnemonic: string) => mnemonicToSeedWebcrypto(
        mnemonic.trim(),
        passphrase,
    );

}





function otherwise <T> (f: IO_or_Task<T>) {

    return (x?: T) => x ?? f();

}





type         IO <T> = () => T;
type       Task <T> = () => Promise<T>;
type IO_or_Task <T> = IO<T> | Task<T>;

