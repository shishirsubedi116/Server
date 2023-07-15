const mongoose = require('mongoose')
const orderSchema = new mongoose.Schema({
    OrderId: {
        type: String
    },
    customerName: {
        type: String,
        required: true,
    },
    orderItems:{
        type: Array,
        required:true,
    },
    Address: {
        type: Object,
        required: true,
    },
    phoneNo:{
        type: Number,
        required: true,
    },
    Email:{
        type: String,
        required: true,
    },
    OrderStatus:{
        type: String,
        default: "Incomplete"
    },
    OrderedAt:{
        type:Date,
        default : Date.now()
    },
    deliveryAt:{
        type:Date,
        default : Date.now()
    },
    Price:{
        type: Number
    }


})

// we will create a new collection
const Order = new mongoose.model('Order', orderSchema)

module.exports = Order