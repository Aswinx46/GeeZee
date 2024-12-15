const mongoose=require('mongoose')
const {Schema}=mongoose
const {v4:uuidv4}=require('uuid')

const orderSchema=new mongoose.Schema({
    orderId:{
        type:String,
        default:()=>uuidv4(),
        unique:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    orderItems:[{
        productId:{
            type:Schema.Types.ObjectId,
            ref:'product',
            required:true
        },
        quantity:{
            type:Number,
            required:true,
            default:1,
            min: [1, 'Quantity cannot be less than 1'],
        },
        price:{
            type:Number,
            required:true,

        }
    }],
    totalPrice:{
        type:Number,
        required:true
    },
    discount:{
        type:Number,
        required:false,
        default:0
    },
    finalAmount:{
        type:Number,
        required:true
    },
    address:{
        type:Schema.Types.ObjectId,
        ref:"address",
        required:true
    },
    invoiceDate:{
        type:Date,
        default:Date.now
    
    },
    status:{
        type:String,
        required:false,
        enum:['Pending','Processing','Shipped','Delivered','Cancelled','Return Request','Returned']
    },
    createdOn:{
        type:Date,
        default:Date.now,
        required:true
    },
    couponApplied :{
        type:Boolean,
        default:false
    },
    paymentMethod:{
        type:String,
        enum:['Credit card','Debit Card','Net Banking','UPI','Cash on Delivery'],
        required:true
    },
    shippingCost:{
        type:Number,
        default:40
    },
    returnReason:{
        type:String,
        required:false
    },
    deliveryDate:{
        type:Date,
        default:function (){
            const today=new Date();
            today.setDate(today.getDate() + 5);
            return today
        }
    }

})

const Order=mongoose.model('order',orderSchema)

module.exports = Order;