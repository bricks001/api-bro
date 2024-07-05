import { Router } from "express";
import Joi from "joi";
import UserSchema from '../../db/models/users.model.js';
import { createXRPWallet, getXrpBalance } from "../../helpers/xrp.module.js";
import usersModel from "../../db/models/users.model.js";
import WalletSchema from '../../db/models/wallet.model.js';



const router = Router();


const registerValidator =  Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().min(6).required(),
    first_name: Joi.string().min(3).required(),
    last_name: Joi.string().min(3).required(),
    username: Joi.string().required(),
    referral:Joi.string().optional()
})


router.post('/new', async(req,res)=>{
    try {

        let {error,value} =  registerValidator.validate(req.body);
        if(error) return res.status(500).json({msg:error.details[0].message,e:true});
        let {email,username} = value;

        let userExist = await usersModel.findOne({username})
        if(userExist) return res.status(403).json({e:true,msg: `${userExist.username || userExist.email} is already in use`})
          
        userExist = await usersModel.findOne({email})
        if(userExist) return res.status(403).json({e:true,msg: `${userExist.email} is already in use`})
        

        let newUser = await UserSchema.create(value) //create user here
        //create user xrp wallet here 
        let {seed,keypair, address } = await createXRPWallet()
        await WalletSchema.create({seed,keypair,address, uid:newUser._doc._id})

        return  res.status(201).json({
            data: 'user account created successfully, login to continue',
            e: false
        })


    } catch (error) {
        console.log('Error: '+error);
        let msg = 'an unknown error occurred 1'
        if (error.code === 11000 && error.keyPattern.email) {
            const duplicateKey = error.keyValue.email || 'unknown';
            const msg = `User with email "${duplicateKey}" already exists`;
            res.status(500).json({
                e:true,
                msg,
                data:null
            });
          } else if (error.code === 11000 && error.keyPattern.username) {
            const duplicateKey = error.keyValue.username || 'unknown';
            const msg = `User with username "${duplicateKey}" already exists`;
            res.status(500).json({
                e:true,
                msg,
                data:null
            });
          }  else {
            msg = 'An unexpected error occurred';
            res.status(500).json({
                e: true, 
                msg,
                data: null
            })
        } 
    }
})


export default router;