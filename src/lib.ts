import { p2tr, p2pkh, p2wpkh } from '@scure/btc-signer/payment.js';
import { NETWORK, pubECDSA, pubSchnorr } from '@scure/btc-signer/utils.js';
import type { BTC_NETWORK } from '@scure/btc-signer/utils.js';





type PRR <K extends string, V> = Partial<Readonly<Record<K, V>>>;

type Bytes = Uint8Array;

type Format = 'pkh' | 'wpkh' | 'tr';

type HDKey = PRR<'publicKey' | 'privateKey', Bytes | null | undefined>;





function gen (

        type: Format,
        key: HDKey,
        network: BTC_NETWORK,

) {

    const convert = address(type);

    const pub = key.privateKey ? convert(key.privateKey) : key.publicKey;

    if (pub == null) {
        throw new Error('invalid HDKey');
    }

    if (type === 'wpkh') {
        return p2wpkh(pub, network);
    }

    if (type === 'pkh') {
        return p2pkh(pub, network);
    }

    if (type === 'tr') {
        return p2tr(output(pub), void 0, network);
    }

    throw new Error(`getAddress: unknown type=${ type }`);

}





export function get_address_by (

        type: Format,
        network = NETWORK,

): (key: HDKey) => string {

    return key => gen(type, key, network).address;

}





function address (type: Format) {

    return type === 'tr' ? pubSchnorr : pubECDSA;

}





function output (pub: Bytes) {

    return pub.byteLength === 32 ? pub : pub.slice(1, 33);

}

