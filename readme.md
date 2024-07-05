rGJ8TXfT2KRCwLcGU71dUrpiqMCMfuRtt8 - normal wallet 



   


    // sendXRP(senderAddress, senderSecret, recipientAddress, destinationTag, amount)
    // .then(result => {
    //     console.log('Transaction successful:', result);
    // })
    // .catch(error => {
    //     console.error('Transaction failed:', error);
    // });
        // return null;
        // let walletInfo = await createXRPWallet()


        // sendXRPWithTag(walletSeed, recipientAddress, amount, destinationTag)
//     .then(secret => {
//         console.log('Generated Ripple Secret:', secret);

//         // Proceed with sending XRP or other operations
//     })
//     .catch(error => {
//         console.error('Error generating Ripple secret:', error);
//     });
// return null
        let address = 'rGJ8TXfT2KRCwLcGU71dUrpiqMCMfuRtt8';
        let balance = await getXrpBalance(address);
        console.log(parseInt(balance).toLocaleString());
        return null

        return res.json({walletInfo});


        const senderAddress = 'rULU15pkiQrpi7P6dDu6oN7W5P5yBx2Jhr';

const senderSecret = '188nY5ei4dsThbdTZMU76i96SxdEMyR5x7graKcetT3yD'

// Define the recipient's details
const destinationTag = 500657279;
const recipientAddress = 'rJn2zAPdFA193sixJwuFixRkYDUtx3apQh'; // Replace with the recipient's address
const amount = '5'; // Amount in XRP to send

// const walletSeed = 'spucxBAoX85gCk82TzZJUVatorFSE';