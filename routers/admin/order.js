const express = require('express');
const Order = require('../../models/orderModel');
const verifyUser = require('../../middleware/verifyUser');
const nodemailer = require('nodemailer');
const router = express.Router()

//Search order by orderId or Customer Name

router.get('/searchorder/:mykey', verifyUser, async (req, res) => {
    //Checking if the user is admin or not
    if (req.user !== process.env.ADMIN) {
        return res.status(400).json({ success: false, message: "You are not authorized" });
    }
    try {
        const key = req.params.mykey.toLowerCase();
        let food = await Order.find({
            "$or": [
                { "Email": { $regex: key } },
                { "OrderId": { $regex: key } },
                { "customerName": { $regex: key } },
            ]
        })
        if (food.length == 0) {
            return res.status(400).json({ success: false, message: "No foods available" });
        }
        return res.status(200).json({ success: true, message: food })

    } catch (error) {
        return res.status(400).json({ success: false, message: "some error occured" });
    }
})

//Get all the orders
router.get('/getallorders', verifyUser, async (req, res) => {
    //Checking if the user is admin or not
    if (req.user !== process.env.ADMIN) {
        return res.status(400).json({ success: false, message: "You are not authorized" });
    }
    try {
        const { page, limit } = req.query
        const data = await Order.find().limit(limit * 1).skip((page - 1) * limit).sort({ "OrderedAt": -1 })
        if (data.length == 0) {
            return res.status(400).json({ success: false, message: "No Orders Found" })
        }
        else {
            return res.status(200).json({ success: true, message: data })
        }

    } catch (error) {
        return res.status(400).json({ success: false, message: "Some Error Occured!" });

    }
})


//completed / cancelled / discard /  the order

router.patch('/editorder/:id', verifyUser, async (req, res) => {
    //Checking if the user is admin or not
    if (req.user !== process.env.ADMIN) {
        return res.status(400).json({ success: false, message: "You are not authorized" });
    }
    if (!req.body) {
        return res.status(400).json({ success: false, message: "Fill the data" })
    }
    try {
        const order = await Order.findOne({ _id: req.params.id })
        if (!order) {
            return res.status(400).json({ success: false, message: "No Order Found" })
        }
        await order.updateOne({ "OrderStatus": req.body.status })
        if (req.body.status == "Shipped") {
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
                to: `${order.Email}`,
                subject: 'Your Orders',
                text: `Dear ${order.customerName}, Your order (order id: ${order.OrderId}) has been shipped. Please don't turn off your phone number and get to the filled destination under 15 minutes with payment.
                
            From Diamond Eats.

            Please contact to 9876543210 if you have any queries.
            
            `
            });
        }
        return res.status(200).json({ success: true, message: "Order Updated" })

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Something went wrong' });
    }
})



//Get today's orders
router.get('/todayorders', verifyUser, async (req, res) => {
    //Checking if the user is admin or not
    if (req.user !== process.env.ADMIN) {
        return res.status(400).json({ success: false, message: "You are not authorized" });
    }
    try {
        let moredate = Date.now() + 54000000
        let lessdate = Date.now() - 54000000

        const order = await Order.find({ OrderStatus: "Incomplete" }).sort({ "OrderedAt": 1 })
        let todaysOrdersArr = []
        await order.map((elem) => {
            var checkdate = new Date(elem.deliveryAt).getTime()
            if (checkdate > lessdate && checkdate < moredate) {
                todaysOrdersArr.push(elem)
            }
        })
        return res.status(200).json({ success: true, message: todaysOrdersArr })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Something went wrong' });
    }
})

//Get today's orders
router.get('/shippedorders', verifyUser, async (req, res) => {
    //Checking if the user is admin or not
    if (req.user !== process.env.ADMIN) {
        return res.status(400).json({ success: false, message: "You are not authorized" });
    }
    try {
        const order = await Order.find({ OrderStatus: "Shipped" }).sort({ "OrderedAt": 1 })
        if (!order) {
            return res.status(500).json({ success: false, message: 'No Orders' });
        }
        return res.status(200).json({ success: true, message: order })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Something went wrong' });
    }
})

//Get today's orders
router.get('/discardedorders', verifyUser, async (req, res) => {
    //Checking if the user is admin or not
    if (req.user !== process.env.ADMIN) {
        return res.status(400).json({ success: false, message: "You are not authorized" });
    }
    try {
        const order = await Order.find({ OrderStatus: "Discarded" }).sort({ "OrderedAt": -1 })
        if (!order) {
            return res.status(500).json({ success: false, message: 'No Orders' });
        }
        return res.status(200).json({ success: true, message: order })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Something went wrong' });
    }
})

router.get('/cancelledorders', verifyUser, async (req, res) => {
    //Checking if the user is admin or not
    if (req.user !== process.env.ADMIN) {
        return res.status(400).json({ success: false, message: "You are not authorized" });
    }
    try {
        const order = await Order.find({ OrderStatus: "Cancelled" }).sort({ "OrderedAt": -1 })
        if (!order) {
            return res.status(500).json({ success: false, message: 'No Orders' });
        }
        return res.status(200).json({ success: true, message: order })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Something went wrong' });
    }
})

router.get('/allincompleteorders', verifyUser, async (req, res) => {
    //Checking if the user is admin or not
    if (req.user !== process.env.ADMIN) {
        return res.status(400).json({ success: false, message: "You are not authorized" });
    }
    try {
        const order = await Order.find({ OrderStatus: "Incomplete" }).sort({ "OrderedAt": -1 })
        if (!order) {
            return res.status(500).json({ success: false, message: 'No Orders' });
        }
        return res.status(200).json({ success: true, message: order })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Something went wrong' });
    }
})


module.exports = router 