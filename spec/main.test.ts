import { describe, it, mock } from 'node:test';
import assert_strict from 'node:assert/strict';

import { main } from '#src/main.ts';
import { parse } from '#src/parse.ts';
import { USAGE } from '#src/help.ts';





describe('main', function () {

    const mnemonic = `

        denial magic satoshi blast forest mixed coffee
        genuine donkey moon sail cave eyebrow burst load

    `.trim().split(/\s+/);

    it('supports --export-xprv --format wpkh', async function () {

        const res = await new Promise<string>(async function (resolve) {

            await main(parse([
                '--export-xprv', '--format=wpkh',
                ...mnemonic,
            ]), resolve);

        });

        assert_strict.equal(res, `

            xprv9s21ZrQH143K32FdKprpNdL2SiDEnnd7qaZUWj4rchuFCRgkK4J
            ZfJYxgn64Yq89TYGXBmhc9Xf6ihrkfYrgNipAfGxr7bpMjyWZ6tKFZEn

        `.replace(/\W+/g, ''));

    });

    it('supports --export-xpub --format pkh', async function () {

        const res = await new Promise<string>(async function (resolve) {

            await main(parse([
                '--export-xpub', '--format=pkh',
                ...mnemonic,
            ]), resolve);

        });

        assert_strict.equal(res, `

            xpub6D8mSepz3yq3Pwfrqy1wppYcXPXgLWZAG7dXss4AgpuzgpC1TB2
            c1G8m7ZNFhM5nTDfgcaHPSzgQwTQHzFJDDR7VqEsBjREeyfkfFLna2Tz

        `.replace(/\W+/g, ''));

    });

    it('supports --export-xpub --format tr', async function () {

        const res = await new Promise<string>(async function (resolve) {

            await main(parse([
                '--export-xpub', '--format=tr',
                ...mnemonic,
            ]), resolve);

        });

        assert_strict.equal(res, `

            xpub6DMhkbAoDSmHLg79EB62G3hevgNgA6mdJDzRrhpZjALkbZygPW9
            PycSLpYMxQfsoRqYL817pfVUF5rmP1CjhvVW1gT28FcG4LfNXcDHfjqS

        `.replace(/\W+/g, ''));

    });

    it('supports set --internal flag', async function () {

        const res = mock.fn();

        await main(parse([ '-v', '--internal', ...mnemonic ]), res);

        assert_strict.deepEqual(res.mock.calls.at(0)?.arguments, [
            `m/84'/0'/0'/1/0`,
            'bc1q6lrmdkjjzh83qhfm4jknadsey8nep8nukauhc8',
        ]);

    });

    it('emits derive path in verbose mode', async function () {

        const res = mock.fn();

        await main(parse([
            '--verbose',
            '--account', '9',
            '--format', 'pkh',
            ...mnemonic,
        ]), res);

        assert_strict.deepEqual(res.mock.calls.at(0)?.arguments, [
            `m/44'/0'/9'/0/0`,
            '16ikowat1deoZjwNnpDvLrPTvJiu3As4xB',
        ]);

    });

    it('supports --passphrase', async function () {

        const res = await new Promise<string>(async function (resolve) {

            await main(parse([
                '--passphrase', '01189998819991197253',
                '--format', 'wpkh',
                ...mnemonic,
            ]), resolve);

        });

        assert_strict.equal(res, 'bc1qf7vr7lxxeh40sknwx4a5wdm8cmgl03j5r7dfq8');

    });

    it('supports -n3 emit', async function () {

        const res = mock.fn();

        await main(parse([ '-n3', '-f', 'tr', ...mnemonic ]), res);

        assert_strict.deepEqual(res.mock.calls.flatMap(c => c.arguments), [
            'bc1pnc0pk9daxk9a7h5kqfuj24zrxu9ujm9gjwes7mqghvzj26jt9wnqeggy7g',
            'bc1pyf2c9jt7ek0tlaa6js8v43cm9vu540lrpzfk7ynflhcdajgcf3mqk6sgqy',
            'bc1pklla86akkfspsfr5exn3lu29s3ypfatlx33uavx0kal6tueh26jq7tld2a',
        ]);

        assert_strict.equal(res.mock.callCount(), 3);

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

        assert_strict.equal(args, address);
        assert_strict.equal(stdin, address);

    });

    it('throws when no args nor stdin', async function () {

        await assert_strict.rejects(() => main(parse([])));

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

                assert_strict.equal(res, USAGE);

            });

        }

    }

});





describe('xprv or xpub', function () {

    const mnemonic = `

        denial magic satoshi blast forest mixed coffee
        genuine donkey moon sail cave eyebrow burst load

    `.trim().split(/\s+/);

    for (const [ type, account ] of [

        [ 'wpkh', 0 ],
        [  'pkh', 5 ],
        [   'tr', 9 ],

    ] as const) {

        it(`same on   -f ${ type }   -a ${ account }`, async function () {

            const init = [
                '--format', type,
                '--account', account.toString(),
            ];

            const address = await new Promise<string>(async function (res) {

                await main(parse(init.concat([
                    ...mnemonic,
                ])), res);

            });

            const [ xprv, xpub ] = await Promise.all([

                new Promise<string>(async function (res) {

                    await main(parse(init.concat([
                        '--export-xprv',
                        ...mnemonic,
                    ])), res);

                }),

                new Promise<string>(async function (res) {

                    await main(parse(init.concat([
                        '--export-xpub',
                        ...mnemonic,
                    ])), res);

                }),

            ]);

            const arr = await Promise.all([

                new Promise<string>(async function (res, rej) {

                    await main(parse(init.concat([
                        '--import-xprv', xprv,
                    ])), res).catch(rej);

                }),

                new Promise<string>(async function (res, rej) {

                    await main(parse(init.concat([
                        '--import-xpub', xpub,
                    ])), res).catch(rej);

                }),

            ]);

            assert_strict(arr.every(res => res === address));

        });

    }

});

