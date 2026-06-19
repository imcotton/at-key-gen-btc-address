import { describe, it } from 'node:test';
import assert_strict from 'node:assert/strict';

import { HDKey } from '@scure/bip32';
import { mnemonicToSeedSync } from '@scure/bip39';

import { get_address_by } from '../src/lib.ts';





describe('get_address_by', function () {

    const buf = mnemonicToSeedSync(`

        denial magic satoshi blast forest mixed coffee
        genuine donkey moon sail cave eyebrow burst load

    `.trim().replaceAll(/\W+/g, ' '));

    const key = HDKey.fromMasterSeed(buf);
    const piv = HDKey.fromExtendedKey(key.privateExtendedKey);
    const ext = HDKey.fromExtendedKey(key.publicExtendedKey);
    const pub = new HDKey({ publicKey: key.publicKey! });

    for (const [ type, addr ] of [

        [ 'pkh', '167rxpGrrVbePwUo6KfPo3rY3xUWdBWeBu' ],
        [ 'wpkh', 'bc1q8qjdf3dtmzr4gd8zgyhm3dgfuayu7xak4mu8dg' ],
        [ 'tr', 'bc1plsv2cux8mr26a5tgyx673nuvnqlum5zzt69vw8942h3r2ma6fqfqy5dmux' ],

    ] as const) {

        it(`for type: ${ type }`, function () {

            const f = get_address_by(type);

            for (const x of [ key, piv, ext, pub ]) {

                assert_strict.equal(f(x), addr, type);

            }

        });

    }

    it('throws on invalid HDKey', function () {

        const f = get_address_by('tr');

        assert_strict.throws(function () {

            f({});

        }, /invalid HDKey/);

    });

    it('throws on unknown type', function () {

        // @ts-expect-error assert throws
        const f = get_address_by('wat');

        assert_strict.throws(function () {

            f(key);

        }, /getAddress: unknown type=wat/);

    });

});

