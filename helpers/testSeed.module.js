import * as bip39 from 'bip39';
import * as bip32 from 'bip32';
import * as rippleKeypairs from 'ripple-keypairs';
import { createHash } from 'crypto';

/**
 * Converts a given seed to a BIP39 mnemonic.
 * @param {string} seed - The input seed to convert to mnemonic.
 * @returns {string} - The BIP39 mnemonic phrase.
 */
export function seedToMnemonic2(seed) {
    // Convert the seed string to a buffer
    const seedBuffer = Buffer.from(seed, 'hex');

    // Hash the seed to get 256 bits of entropy
    const hash = createHash('sha256').update(seedBuffer).digest();

    // Use the first 128 bits (16 bytes) of the hash as the entropy for the mnemonic
    const entropy = hash.slice(0, 16); // 128 bits is sufficient for a 12-word mnemonic

    // Convert the entropy to a mnemonic
    const mnemonic = bip39.entropyToMnemonic(entropy.toString('hex'));

    return mnemonic;
}

 

/**
 * Derives an XRP address from a BIP39 mnemonic.
 * @param {string} mnemonic - The BIP39 mnemonic phrase.
 * @returns {Object} - The derived XRP address and private key.
 */
function getXRPAddressFromMnemonic(mnemonic) {
    // Ensure mnemonic is valid
    if (!bip39.validateMnemonic(mnemonic)) {
        throw new Error('Invalid mnemonic');
    }

    // Generate seed from mnemonic
    const seed = bip39.mnemonicToSeedSync(mnemonic);

    // Create HD wallet from seed
    const root = bip32.fromSeed(seed);

    // Derivation path for XRP (BIP44)
    const path = "m/44'/144'/0'/0/0"; // Standard path for XRP
    const keypair = root.derivePath(path);

    // Get the private key in Ripple format
    const privateKey = keypair.privateKey.toString('hex').toUpperCase();
    const keypairRipple = rippleKeypairs.deriveKeypair(privateKey);

    // Derive the XRP address from the public key
    const address = rippleKeypairs.deriveAddress(keypairRipple.publicKey);

    return {
        address,
        privateKey: 's' + privateKey // Adding 's' to mimic Ripple secret format
    };
}

const walletInfo = getXRPAddressFromMnemonic('together mail awful cradle scrub apart hip leader silk slice unusual embark');
console.log('Derived XRP Address:', walletInfo.address);
console.log('Private Key:', walletInfo.privateKey);
