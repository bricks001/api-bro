import { model, Schema } from "mongoose";
import bcrypt from 'bcrypt';



const UserSchema = new Schema({
    first_name:{
        type:String,
        required: [true, 'user first name is a required field']
    },
    last_name:{
        type:String,
        required: [true, 'user last name is a required field']
    },
    username:{
        type:String,
        required: [true, 'username is a required field'],
        unique: [true,'user with user already exist']

    },
    email: {
        type: String,
        required: [true, 'email field is required'],
        unique: [true,'user with email already exist']
    },
    status: {
        type: String,
        enum:['suspended','active','inactive'],
        default: 'active'
    },
    password: {
        type: String,
        required: [true, 'password field is required']
    },
    country: {
        type: String,
    },
    isReferralWeek: {
        default: false,
        type: Boolean
    },
    total_bonus: {
        type: Number,
        default: 0
    },
    total_balance: {
        default: 0,
        type: Number
    },
    total_withdraw: {
        default: 0,
        type: Number
    },
    nextPayout: {
        default: 'null',
        type: String
    },
    referredBy: {
         type:String,
        default: 'admin'
    },
    wallet: {
        address: String,
        tag: String
    },
    kyc:{
        status: {
            type:String,
            enum:['pending', 'not-applied','resolved'],
            default: 'not-applied'
        },
        document:{
            type: String,
            default:'null'
        }
    }

}, {
    timestamps: true
})

// hash user password on account creation 
UserSchema.pre('save', async function(){
    if(this.password){
        this.password = await bcrypt.hash(this.password, 10)
    }
})


export default model('user', UserSchema)