import rippleLib from 'ripple-lib';
import rippleKeypairs  from 'ripple-keypairs';
import { xAddressToClassicAddress } from 'ripple-address-codec';
import bs58 from 'bs58';
import { Wallet, Client } from 'xrpl';

const { RippleAPI } = rippleLib;

// Initialize the API
const api = new RippleAPI({ server: 'wss://s1.ripple.com' }); // Ripple public server

// Function to generate an XRP address and private key
export async function createXRPWallet() {
    // Generate a new seed
    const seed = rippleKeypairs.generateSeed();
    console.log('Seed:', seed);

    // Derive keypair from seed
    const keypair = rippleKeypairs.deriveKeypair(seed);
    console.log('Keypair:', keypair);

    // Generate address from public key
    const address = rippleKeypairs.deriveAddress(keypair.publicKey);
    console.log('Address:', address);

    return {
        seed,
        keypair,
        address
    };
}

// Function to check the balance of an XRP address
export async function getXrpBalance(address) {
    await api.connect();
    try {
        const accountInfo = await api.getAccountInfo(address);
        console.log(`Balance for ${address}: ${accountInfo.xrpBalance} XRP`);
        return accountInfo.xrpBalance;
    } catch (error) {
        console.error('Error fetching balance:', error);
        return 0
        // throw new Error(error.toString());
    } finally {
        await api.disconnect();
    }
}
 
export async function generateRippleSecret(mnemonicOrSeed) {
    try {
        const wallet = await Wallet.fromMnemonic(mnemonicOrSeed);
        return wallet;
    } catch (error) {
        console.error('Error generating Ripple secret:', error);
        throw error;
    }
}


// Function to check if an address is an X-address
function isXAddress(address) {
    return address.startsWith('X');
}

// Function to convert X-address to classic address
function getClassicAddress(xAddress) {
    const { classicAddress } = xAddressToClassicAddress(xAddress);
    return classicAddress;
}

// Fetch all transactions for the given address
/**
 * Fetches all transactions for a given XRP wallet address.
 * @param {string} address - The XRP wallet address.
 * @returns {Promise<Array>} - A promise that resolves to the list of transactions.
 */
export async function getAllTransactions(address) {
    let transactions = [];
    try {
        if (!api.isConnected()) {
            await api.connect();
            console.log('API CONNECTED');
        }

        // Convert X-address to classic address if necessary
        const classicAddress = isXAddress(address)
            ? xAddressToClassicAddress(address).classicAddress
            : address;

        // Set up options for transaction fetching
        const options = {
            limit: 20, // Adjust the limit as needed
            ledger_index_min: -1, // Fetch from the earliest available ledger
            ledger_index_max: -1, // Fetch up to the most recent ledger
        };

        let marker;

        // Loop to fetch transactions
        do {
            const response = await api.request('account_tx', {
                account: classicAddress,
                ledger_index_min: options.ledger_index_min,
                ledger_index_max: options.ledger_index_max,
                limit: options.limit,
                marker: marker
            });
            console.log('response====================================');
            console.log(response);
            console.log(transactions.length + "transactions length");
            console.log('====================================');
            // Ensure response contains transactions
            if (response.transactions) {
                transactions = transactions.concat(response.transactions);
            }

            marker = response.marker;
            if(transactions.length>30){
                break;
            }

        } while (!transactions || marker); // Continue fetching until no marker is returned

        return transactions;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return transactions

    } finally {
        if (api.isConnected()) {
            await api.disconnect();
            console.log('API DISCONNECTED');
        }
    }
}



// Create a wallet instance from seed

// Function to send XRP with a tag
// Define the reusable function to send XRP
export async function sendXRPWithTag(walletSeed, recipientAddress, amountXRP, destinationTag = null) {
    // const serverUrl = 'wss://s.altnet.rippletest.net:51233'; // Testnet server
    const serverUrl = 'wss://s1.ripple.com'; // Uncomment for Mainnet server

    const wallet = Wallet.fromSeed(walletSeed);
    const client = new Client(serverUrl);

    try {
        await client.connect();

        // Prepare the transaction object
        const payment = {
            TransactionType: 'Payment',
            Account: wallet.classicAddress,
            Destination: recipientAddress,
            Amount: (amountXRP * 1000000).toString(), // Convert XRP to drops
        };

        // Add destination tag if provided
        if (destinationTag !== null) {
            payment.DestinationTag = destinationTag;
        }

        // Autofill the transaction details
        const preparedTx = await client.autofill(payment);

        // Sign the transaction
        const signedTx = wallet.sign(preparedTx);

        // Submit the transaction and wait for validation
        const result = await client.submitAndWait(signedTx.tx_blob);

        console.log('Transaction result:', result);
        return result;

    } catch (error) {
        console.error('Error sending XRP:', error);
        throw error;

    } finally {
        client.disconnect();
    }
}



export function convertHexToBase58(hexPrivateKey) {
    // Convert hex to buffer
    const privateKeyBuffer = Buffer.from(hexPrivateKey, 'hex');
    // Encode the buffer to base58
    const base58PrivateKey = bs58.encode(privateKeyBuffer);
    return base58PrivateKey;
}



export async function estimateFee() {
    try {
        await api.connect();

        // Get current fee information
        const feeData = await api.getFee();

        console.log('Current fee data:', feeData);

        // Calculate estimated fee for a typical transaction
        const baseFee = feeData.currentLedgerFee / 1000000; // Convert from drops to XRP
        const feeMultiplier = 1.0; // Adjust as needed based on transaction complexity
        const estimatedFee = baseFee * feeMultiplier;

        console.log('Estimated transaction fee (XRP):', estimatedFee);

        await api.disconnect();

        return estimatedFee;
    } catch (error) {
        console.error('Error estimating fee:', error);
        await api.disconnect();
        throw error;
    }
}

// const senderAddress = 'rULU15pkiQrpi7P6dDu6oN7W5P2yBx2Jhr';
// const senderSecret = 'spucxBAoX85gCk82TzZJUVatorFOP'; // Replace with your actual secret

// // Define recipient's details (including destination tag)
// const recipientAddress = 'rDWX4urCdYbhU4UQq8r9m5NBYf57uWfLVY';
// const destinationTag = 12345; // Replace with the recipient's destination tag
// const amount = '10'; // Amount in XRP to send

// Call the estimateFee function
// estimateFee()
//     .then(estimatedFee => {
//         console.log('Estimated fee:', estimatedFee);
//     })
//     .catch(error => {
//         console.error('Failed to estimate fee:', error);
//     });