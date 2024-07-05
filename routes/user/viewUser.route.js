import { Router } from 'express';
import verifySession from '../../middlewares/verifySession.js';
import walletModel from '../../db/models/wallet.model.js';
import { getXrpBalance } from '../../helpers/xrp.module.js';
const route = Router();




route.get('/scanMe', verifySession, async (req, res) => {
    try {
        let walletDetails = await walletModel.findOne({ uid: req.user._id })
        let userWalletBalance = await getXrpBalance(walletDetails.address) //returns xrp wallet balance 
        res.json({
            data: { ...req.user, address: walletDetails.address, walletBalance: userWalletBalance },
            e: false
        })
    } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');

        res.status(403).json({
            e: true,
            msg: 'unknown error occurred, kindly contact support'
        })
    }
})

export default route;