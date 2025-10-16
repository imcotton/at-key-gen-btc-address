import * as ast from '@std/assert';
import { describe, it } from '@std/testing/bdd';

import { parse } from '#src/parse.ts';





describe('parse', function () {

    it('throws on invalid account', function () {

        ast.assertThrows(() => parse([        '-a', 'wat' ]));
        ast.assertThrows(() => parse([ '--account', '4.2' ]));

    });

    it('throws on unknown options', function () {

        ast.assertThrows(() => parse([ '--wat' ]));

    });

});

