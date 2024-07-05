import { Router } from 'express';
import  verifySession  from '../../middlewares/verifySession.js';
import walletModel from '../../db/models/wallet.model.js';
const route = Router();




route.get('/scanMe', verifySession, async(req,res)=> {
    try {
        let walletDetails = await walletModel.findOne({uid:req.user._id})
        res.json({
            data: {...req.user,address:walletDetails.address},
            e:false
        })
    } catch (error) {
        res.status(403).json({
            e:true,
            msg: 'unknown error occurred, kindly contact support'
        })
    }
})

export default route;