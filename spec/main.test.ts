import * as ast from '@std/assert';
import { describe, it } from '@std/testing/bdd';

import { main } from '#src/main.ts';
import { parse } from '#src/parse.ts';
import { USAGE } from '#src/help.ts';





describe('main', function () {

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

