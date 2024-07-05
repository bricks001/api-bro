import { Router } from "express";
import Joi from "joi";
import UserSchema from '../../db/models/users.model.js';
import { createXRPWallet, getXrpBalance } from "../../helpers/xrp.module.js";
import usersModel from "../../db/models/users.model.js";
import WalletSchema from '../../db/models/wallet.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'


const router = Router();


const loginValidator =  Joi.object({
    password: Joi.string().min(6).lowercase().required(),
    username: Joi.string().required(),
})


router.post('/access', async(req,res)=>{ 
    try {
        let {error,value} = loginValidator.validate(req.body)
        if(error) throw new Error(error.details[0].message);
        let {username,password} = value; // extraction 
        let usernameExists = await usersModel.findOne({username})
        if(!usernameExists) throw new Error('invalid username or password, try again')
        // compare pwd if the username is right 
        let pwdIsMatch = await bcrypt.compare(password, usernameExists.password)
        if(!pwdIsMatch) throw new Error('invalid username or password provided');
        // sign the user to login 
        let token = await jwt.sign({_id:usernameExists._id}, 'jwt', {
            expiresIn: '1h'
        })

        res.json({
            e: false,
            token,
            data: {...usernameExists._doc, password:undefined, kyc:undefined, referredBy:undefined}
        })


    } catch (error) {
        console.log('error ====================================');
        console.log(error);
        res.status(401).json({
            e:true,
            msg: error.toString(),
        })
    }
})

export default router;