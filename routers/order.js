const express = require('express')
const router = express.Router()
const verifyUser = require('../middleware/verifyUser');
const User = require('../models/authModels/userModel');
const Order = require('../models/orderModel');
const nodemailer = require('nodemailer');

//Routes for user

//New Order
router.post('/neworder', verifyUser, async (req, res) => {
    const { orderItems, Address, phoneNo, deliveryAt, Price } = req.body;
    if (!orderItems || !Address || !phoneNo || !deliveryAt) {
        return res.status(400).json({ success: false, message: "Please Fill All the data properly" });
    }
    try {
        const user = await User.findOne({ _id: req.user })
        const order = new Order({ orderItems, Price, Address, phoneNo, deliveryAt, customerName: user.name, Email: user.email, OrderId: req.user.slice(0, 8) + Date.now() })
        const saveorder = await order.save()

        if (saveorder) {

            //Nodemailer Setup(authentication)
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'threatyour@gmail.com',
                    pass: `${process.env.PASS}`
                }
            });

            //Nodemailer Setup(requirements  & details)
            let info = transporter.sendMail({
                from: 'threatyour@gmail.com',
                to: `${user.email}`,
                subject: 'Your Orders',
                text: `Dear ${user.name}, Your Order is recieved. If you want to cancel the order, please do it under 15 minutes or before the order is shipped. Your order id is ${saveorder.OrderId}. 

            From Diamond Eats.

            You will recieve an email when the order is shipped.

            Please contact to 9876543210 if you have any queries.
            
            `
            });

            return res.status(201).json({ success: true, message: `Order Success. Your orderId is sent to your email. Please keep it safe.` });
        }


    } catch (error) {
        return res.status(400).json({ success: false, message: "some error occured" });
    }
})


//Cancel Orders
router.delete('/cancelorder/:id', verifyUser, async (req, res) => {

    try {

        const order = await Order.findOne({ OrderId: req.params.id })
        if (!order) {
            return res.status(400).json({ success: false, message: "No Order Found" });
        }
        // const date = new Date(order.OrderedAt).getTime()
        // const today = Date.now()

        // if ((today - date) > 900000) {
        //     return res.status(400).json({ success: false, message: "You can't cancel it after 15 minutes of booking. Please contact to Restaurant for cancellation" });
        // }

        if (order.OrderStatus == "Shipped") {
            return res.status(400).json({ success: false, message: "You can't cancel it after the order is shipped. Please contact to Restaurant for cancellation" });

        }
        if (order.OrderStatus == "Cancelled" || order.OrderStatus == "Discarded" || order.OrderStatus == "Completed" || order.OrderStatus == "Preparing") {
            return res.status(400).json({ success: false, message: "You cannot perform this action. Call cestaurant for any issues." });
        }
        else {
            const cancel = await order.updateOne({ OrderStatus: "Cancelled" })

            if (cancel) {
                return res.status(200).json({ success: true, message: "Your Order Has Been Cancelled Successfully" });
            }
        }

    } catch (error) {
        return res.status(400).json({ success: false, message: "some error occured" });
    }
})


//My Orders
router.get('/myallorders', verifyUser, async (req, res) => {
    try {
        const findUser = await User.findOne({ _id: req.user })
        const findAllOrders = await Order.find({ Email: findUser.email }).sort({ "OrderedAt": 1 })

        if (!findUser) {
            return res.status(400).json({ success: false, message: "No such user" });
        }

        if (findAllOrders == 0) {
            return res.status(400).json({ success: false, message: "No Orders Available" });
        }


        return res.status(200).json({ success: true, message: findAllOrders });

    } catch (error) {
        return res.status(400).json({ success: false, message: "some error occured" });

    }
})


module.exports = router