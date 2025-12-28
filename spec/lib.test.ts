import * as ast from '@std/assert';
import { describe, it } from '@std/testing/bdd';

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

            ast.assertEquals(get_address(type, key), addr, type);
            ast.assertEquals(get_address(type, piv), addr, type);
            ast.assertEquals(get_address(type, ext), addr, type);
            ast.assertEquals(get_address(type, pub), addr, type);

        });

    }

    it('throws on invalid HDKey', function () {

        ast.assertThrows(function () {

            get_address('tr', {});

        }, Error, 'invalid HDKey');

    });

    it('throws on unknown type', function () {

        ast.assertThrows(function () {

            // @ts-expect-error assert throws
            get_address('wat', key);

        }, Error, 'getAddress: unknown type=wat');

    });

});

