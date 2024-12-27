const mongoose = require('mongoose')
const { Schema } = mongoose

const offerSchema = new mongoose.Schema({
    offerType: {
        type: String,
        enum: ['fixed', 'percentage']
    },
    offerValue: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                return value > 0;
            },
            message: 'Discount value must be greater than 0',
        },
    },
    validFrom: {
        type: Date,
        required: true,
    },
    validUntil: {
        type: Date,
        required: true,
    },
    isListed:{
        type:Boolean,
        default:true
    }
    // productIds: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'product',
    // }],
    // categoryIds: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'category',
    // }],
},
    {
        timestamps: true,
    });

const Offer = mongoose.model('offer', offerSchema)
module.exports = Offer