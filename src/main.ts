import { HDKey } from '@scure/bip32';
import { mnemonicToSeedWebcrypto } from '@scure/bip39';

import type { Purpose, Result } from './parse.ts';
import { get_address } from './lib.ts';
import { USAGE } from './help.ts';





export async function main (

        {

            format, purpose, account, change,
            sentence, passphrase,
            export_xprv, import_xprv,
            export_xpub, import_xpub,
            n, verbose, help,

        }: Result,

        print = console.log,

        text_stdin?: IO_or_Task<string>,

) {

    if (help) {
        return print(USAGE);
    }

    const coin = '0';

    const xprv_OR_xpub = import_xprv || import_xpub;

    const root = await (xprv_OR_xpub

        ? Promise.resolve(xprv_OR_xpub)
            .then(HDKey.fromExtendedKey)

        : Promise.resolve(sentence)
            .then(otherwise(text_stdin))
            .then(seed_with(passphrase))
            .then(HDKey.fromMasterSeed)

    );

    if (export_xprv) {
        print(root.privateExtendedKey);
        root.wipePrivateData();
        return;
    }

    const { extend, derive } = make({
        root,
        purpose, coin, account,
        harden: import_xpub?.startsWith('xpub') === true,
    });

    if (export_xpub) {
        print(extend.publicExtendedKey);
        root.wipePrivateData();
        return;
    }

    const entries = derive(change).take(n).map(payment(format));

    for (const { path, address } of entries) {

        if (verbose) {

            print(path, address);

        } else {

            print(address);

        }

    }

}





function payment (type: Purpose) {

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





function make ({ root, purpose, coin, account, harden = false }: {

        root: HDKey,
        purpose: string,
        coin: string,
        account: string,
        harden?: boolean,

}) {

    const prefix = harden
        ? `m/-/-/-`
        : `m/${ purpose }'/${ coin }'/${ account }'`
    ;

    const extend = harden ? root : root.derive(prefix);

    function * derive (change: number) {

        let index = 0;

        try {

            const extend_change = extend.deriveChild(change);

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

    return { extend, derive };

}





function seed_with (passphrase?: string) {

    return (mnemonic: string) => mnemonicToSeedWebcrypto(
        mnemonic.trim(),
        passphrase,
    );

}





function otherwise <T> (f?: IO_or_Task<T>) {

    return function (x?: T) {

        const res = x ?? f?.();

        if (res == null) {
            throw new Error('no result');
        }

        return res;

    };

}





type         IO <T> = () => T;
type       Task <T> = () => Promise<T>;
type IO_or_Task <T> = IO<T> | Task<T>;

