export const USAGE: string = `
Usage: [OPTIONS] <mnemonic sentence>

OPTIONS:

    --root-xprv          export the xprv (Extended Private Key)
    --xprv               <xprv from above>

    --extend-xpub        export the xpub (Extended Public Key)
    --xpub               <xpub from above>

    -n, --num            (default 1)
    -a, --account        (default 0)
    -i, --internal       toggle as the change address
    -f, --format         one of: tr / pkh / wpkh (default)
    -p, --passphrase
    -v, --verbose
    -h, --help
`;

