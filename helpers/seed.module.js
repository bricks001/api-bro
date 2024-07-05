import bip39  from 'bip39';
import crypto  from 'crypto';

/**
 * Converts a given seed to a BIP39 mnemonic.
 * @param {string} seed - The input seed to convert to mnemonic.
 * @returns {string} - The BIP39 mnemonic phrase.
 */
export function seedToMnemonic(seed) {
    // Convert the seed string to a buffer
    const seedBuffer = Buffer.from(seed, 'hex');

    // Hash the seed to get 256 bits of entropy
    const hash = crypto.createHash('sha256').update(seedBuffer).digest();

    // Use the first 128 bits (16 bytes) of the hash as the entropy for the mnemonic
    const entropy = hash.slice(0, 16); // 128 bits is sufficient for a 12-word mnemonic

    // Convert the entropy to a mnemonic
    const mnemonic = bip39.entropyToMnemonic(entropy.toString('hex'));

    return mnemonic;
}

// Example seed (note: seeds are often Base58 encoded, ensure you handle the format correctly)
const seed = 'spucxBAoX85gCk82TzZJUVatorFSE';

// // Convert the seed to a mnemonic
const mnemonic = seedToMnemonic(seed);

// Print the mnemonic
console.log('Mnemonic:', mnemonic);


