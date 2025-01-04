const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true, 
    },
    bannerUrl: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        default: Date.now,
    },
    endDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value > this.startDate; 
            },
            message: "End date must be after the start date.",
        },
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active', 
    },
    showPageName:{
        type:String,
        required:true
    }
});

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;
