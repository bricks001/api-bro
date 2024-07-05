import mongoose, { model, Schema, Types } from "mongoose";

const WalletSchema = new Schema({
    uid: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    address: {
        type: String,
        required: [true, 'user wallet address is required']
    },
    status: {
        type: String,
        enum: ['readOnly', 'readAndWrite']
    },
    seed: {
        type: String,
        required: [true, 'wallet seed is required']
    },
    keypair: {
        type: Object,
        required: [true, 'keypair is required']
    }
}, {
    timestamps: true
})

// seed,keypair, address 


export default model('wallet', WalletSchema)