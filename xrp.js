const rippleLib = require('ripple-lib');
const { RippleAPI } = rippleLib;

// Initialize the API
const api = new RippleAPI({ server: 'wss://s1.ripple.com' }); // Ripple public server

// Function to generate an XRP address and private key
async function createXRPWallet() {
    const wallet = api.generateAddress();
    console.log('Address:', wallet.address);
    console.log('Secret:', wallet.secret);
    return wallet;
}

// Function to check the balance of an XRP address
async function getBalance(address) {
    await api.connect();
    try {
        const accountInfo = await api.getAccountInfo(address);
        console.log(`Balance for ${address}: ${accountInfo.xrpBalance} XRP`);
        return accountInfo.xrpBalance;
    } catch (error) {
        console.error('Error fetching balance:', error);
        throw error;
    } finally {
        await api.disconnect();
    }
}

// Function to send XRP
async function sendXRP(fromAddress, fromSecret, toAddress, amount) {
    await api.connect();
    try {
        // Prepare payment transaction
        const payment = {
            source: {
                address: fromAddress,
                maxAmount: {
                    value: amount.toString(),
                    currency: 'XRP'
                }
            },
            destination: {
                address: toAddress,
                amount: {
                    value: amount.toString(),
                    currency: 'XRP'
                }
            }
        };

        // Prepare, sign, and submit the transaction
        const prepared = await api.preparePayment(fromAddress, payment);
        const { signedTransaction } = api.sign(prepared.txJSON, fromSecret);
        const result = await api.submit(signedTransaction);
        
        console.log('Transaction result:', result);
        return result;
    } catch (error) {
        console.error('Error sending XRP:', error);
        throw error;
    } finally {
        await api.disconnect();
    }
}

// Example usage
(async function () {
    // Create a new wallet
    const wallet = await createXRPWallet();
    
    // For demonstration purposes, we'll use the same wallet for both sending and receiving
    const fromAddress = wallet.address;
    const fromSecret = wallet.secret;
    
    // Get the balance of the new wallet
    await getBalance(fromAddress);
    
    // Replace with a recipient address you want to send XRP to
    const toAddress = 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh'; // Example recipient address
    
    // Send 10 XRP (assuming the wallet has sufficient balance)
    await sendXRP(fromAddress, fromSecret, toAddress, 10);
})();
