
import jwt from 'jsonwebtoken';
import usersModel from '../db/models/users.model.js';

 const verifySession = async (req, res, next) => {
    try {
        let hasAuth = req.headers.authorization;
        if (!hasAuth) return res.status(403).json({ msg: 'unauthorized request, kindly login to continue' })
        // verify the token
        let token = hasAuth.split(' ')[1];
        if (!token) return res.status(403).json({ msg: 'unauthorized request, kindly login to continue' })
        // if thee request has token then verify 
        let tokenInfo = await jwt.verify(token, 'jwt')
        let { _id } = tokenInfo;
        // verify user is in db 
        let userIdIsInDB = await usersModel.findOne({_id}, { password: 0 });
        // confirm user is not blocked by admin 
        if (!userIdIsInDB) return res.status(403).json({ msg: 'unauthorized user in session, kindly login to continue' })
        if (userIdIsInDB.status === 'suspended') throw new Error('account permissions do not exist, suspended account')
        req.user = userIdIsInDB._doc;
        next()
    } catch (error) {
        res.status(403).json({
            e: true,
            msg: error.toString()
        })
    }
}


export default verifySession;