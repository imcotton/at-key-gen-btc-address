import * as ast from '@std/assert';
import { expect, fn } from '@std/expect';
import { describe, it } from '@std/testing/bdd';

import { main } from '#src/main.ts';
import { parse } from '#src/parse.ts';
import { USAGE } from '#src/help.ts';





describe('main', function () {

    const mnemonic = `

        denial magic satoshi blast forest mixed coffee
        genuine donkey moon sail cave eyebrow burst load

    `.trim().split(/\s+/);

    it('emits derive path in verbose mode', async function () {

        const mock = fn();

        await main(parse([
            '--verbose',
            '--account', '9',
            '--format', 'pkh',
            ...mnemonic,
        ]), mock as never);

        expect(mock).toHaveBeenCalledWith(
            `m/44'/0'/9'/0/0`,
            '16ikowat1deoZjwNnpDvLrPTvJiu3As4xB',
        );

    });

    it('supports -n3 emit', async function () {

        const mock = fn();

        await main(parse([ '-n3', '-f', 'tr', ...mnemonic ]), mock as never);

        [

            'bc1pnc0pk9daxk9a7h5kqfuj24zrxu9ujm9gjwes7mqghvzj26jt9wnqeggy7g',
            'bc1pyf2c9jt7ek0tlaa6js8v43cm9vu540lrpzfk7ynflhcdajgcf3mqk6sgqy',
            'bc1pklla86akkfspsfr5exn3lu29s3ypfatlx33uavx0kal6tueh26jq7tld2a',

        ].forEach((addr, i) => {

            expect(mock).toHaveBeenNthCalledWith(i + 1, addr);

        });

        expect(mock).toHaveBeenCalledTimes(3);

    });

    it('support reading from both args and stdin', async function () {

        const [ args, stdin ] = await Promise.all([

            new Promise<string>(async function (resolve) {
                await main(parse(mnemonic), resolve);
            }),

            new Promise<string>(async function (resolve) {
                await main(parse([]), resolve, () => mnemonic.join(' '));
            }),

        ]);

        const address = 'bc1qetljrh848kv8vyqwsvrptju4ghdxn6w367amma';

        ast.assertStrictEquals(args, address);
        ast.assertStrictEquals(stdin, address);

    });

    {

        const args = [
            [  '-h'    ],
            [ '--help' ],
        ];

        for (const x of args) {

            it(`print help summary for ${ x }`, async function () {

                const res = await new Promise<string>(async resolve => {
                    await main(parse(x), resolve);
                });

                ast.assertStrictEquals(res, USAGE);

            });

        }

    }

});

