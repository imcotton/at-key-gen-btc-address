import { describe, it } from 'node:test';
import assert_strict from 'node:assert/strict';

import { parse } from '../src/parse.ts';





describe('parse', function () {

    it('throws on invalid format', function () {

        assert_strict.throws(() => parse([       '-f', 'wat' ]));
        assert_strict.throws(() => parse([ '--format', 'wat' ]));

    });

    it('throws on invalid account', function () {

        assert_strict.throws(() => parse([        '-a', 'wat' ]));
        assert_strict.throws(() => parse([ '--account', '4.2' ]));

    });

    it('throws on unknown options', function () {

        assert_strict.throws(() => parse([ '--wat' ]));

    });

});

