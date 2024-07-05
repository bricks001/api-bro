//     getAllTransactions(address)
// .then(transactions => {
//     console.log('Transactions:', transactions);
// })
// .catch(error => {
//     console.error('Failed to fetch transactions:', error);
// });


import { Router } from 'express';
import verifySession from '../../middlewares/verifySession.js';
import { getAllTransactions } from '../../helpers/xrp.module.js';
import walletModel from '../../db/models/wallet.model.js';
const route = Router()



route.get('/list', verifySession, async (req, res) => {
    try {
        let walletDetails = await walletModel.findOne({ uid: req.user._id })
        let XRPTransactions = await getAllTransactions(walletDetails.address)
        res.json({
            data: XRPTransactions,
            e: false
        })
    } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
        res.status(500).json({
            msg: 'unknown error occurred'
        })
    }
})


export default route;