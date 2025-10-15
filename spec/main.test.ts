import * as ast from '@std/assert';
import { describe, it } from '@std/testing/bdd';

import { main } from '#src/main.ts';
import { parse } from '#src/parse.ts';
import { USAGE } from '#src/help.ts';





describe('main', function () {

    const mnemonic = `

        denial magic satoshi blast forest mixed coffee
        genuine donkey moon sail cave eyebrow burst load

    `.trim().split(/\s+/);

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

