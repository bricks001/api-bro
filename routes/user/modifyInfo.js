import {Router} from 'express';
import verifySession from '../../middlewares/verifySession.js';
import usersModel from '../../db/models/users.model.js';
import bcrypt from 'bcrypt';



const route = Router();




route.post('/modify/pwd', verifySession, async (req,res)=> {
    try {
        if(req.body.password.toLowerCase().length<6) return res.status(500).json({msg: 'password length must be greater than 6'})
        let hashedPwd = await bcrypt.hash(req.body.password.toLowerCase(),10)
        await usersModel.updateOne({_id:req.user._id},{password:hashedPwd})
        res.status(201).json({data:'password changed successfully'})
    } catch (error) {
        res.status(500).json({
            msg: 'action not complete, try again'
        })
    }
})



// wallet change 

route.post('/modify/wallet', verifySession, async (req,res)=> {
    try {
        await usersModel.updateOne({_id:req.user._id},{wallet:{
            address:req.body.address,
            tag: req.body.tg
        }})
        res.status(201).json({data:'Wallet information modified'})
    } catch (error) {
        res.status(500).json({
            msg: 'action not complete, try again'
        })
    }
})


// kyc

route.post('/modify/kyc', verifySession, async (req,res)=> {
    try {
        await usersModel.updateOne({_id:req.user._id},{kyc:{
            status:'pending',
            document: req.body.document
        }})
        res.status(201).json({data:'Kyc status, under review'})
    } catch (error) {
        res.status(500).json({
            msg: 'action not complete, try again'
        })
    }
})



















export default route;



