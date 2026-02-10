import { describe, it } from 'node:test';
import assert_strict from 'node:assert/strict';

import { HDKey } from '@scure/bip32';
import { mnemonicToSeedSync } from '@scure/bip39';

import { get_address } from '#src/lib.ts';





describe('get_address', function () {

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

            assert_strict.equal(get_address(type, key), addr, type);
            assert_strict.equal(get_address(type, piv), addr, type);
            assert_strict.equal(get_address(type, ext), addr, type);
            assert_strict.equal(get_address(type, pub), addr, type);

        });

    }

    it('throws on invalid HDKey', function () {

        assert_strict.throws(function () {

            get_address('tr', {});

        }, Error, 'invalid HDKey');

    });

    it('throws on unknown type', function () {

        assert_strict.throws(function () {

            // @ts-expect-error assert throws
            get_address('wat', key);

        }, Error, 'getAddress: unknown type=wat');

    });

});

