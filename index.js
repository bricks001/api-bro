import dotenv from 'dotenv';
import express from 'express';
dotenv.config({path:'.env.local'});
import registerUser from './routes/user/register.route.js'
import scanMe from './routes/user/viewUser.route.js'
import loginUser from './routes/user/login.route.js'
import listAllUserTransactions from './routes/user/fetchTransactions.route.js'
import unstakeFunds from './routes/user/unstakeFunds.js'
import modifyInfo from './routes/user/modifyInfo.js'
import cors from 'cors';

// loggers 
import logger from  'morgan';
import mongoose from 'mongoose';





const app = express();


//middleware 
app.use(logger());
app.use(cors('*'));
app.use(express.json());
app.use(express.urlencoded({extended: false}))



// routes 
app.use('/api/v1/user/', registerUser, loginUser, scanMe, modifyInfo)
app.use('/api/v1/transaction/', listAllUserTransactions)
app.use('/api/v1/funds/', unstakeFunds)




const {PORT} = process.env;
// mongoose.connect('mongodb://127.0.0.1/backup') 
mongoose.connect('mongodb+srv://rahmanaminat03:YLGi5bDPYpA5oebn@ng.wxmdcwi.mongodb.net/brokiq')
.then(()=>console.log('DB OK AND READY FOR WRITE'))
.catch(e=>console.log('DB FAILED DUE TO '+e))
app.listen(PORT, ()=>console.log(`THE SERVER STARTED ON PORT ${PORT}`))