import {Router} from 'express'
import verifySession from '../../middlewares/verifySession.js'
import Joi from 'joi'
const route = Router()


const joiBody = Joi.object({
    amount: Joi.number().min(1000).required()
})




route.post('/unstake', verifySession, async (req,res)=>{
    try {
        let {error,value} = joiBody.validate(req.body);
        if(error) return res.status(500).json({msg: error.details[0].message})
        //if the user reach here meaning he wrote 1000 
        // check the balance of the user /
        if(req.user.total_balance < value.amount) return res.status(500).json({msg: 'insufficient user balance, kindly top up to continue'})
            // if the user has 1k bal
        // trigger KYC 
        res.status(403).json({
            msg: 'kindly complete your KYC, and try again'
        })
    } catch (error) {
        res.status(403).json({
            msg: 'unknown error occurred, kindly try again after 5 minutes'
        })
    }
})



export default route;