const express = require('express')
const Food = require('../../models/foodModel')
const verifyUser = require('../../middleware/verifyUser')
const User = require('../../models/authModels/userModel')
const router = express.Router()
const multer = require('multer')


//Routes for admin
// http://localhost:5000/public/images/1686983988828_1.png

//Multer Setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname)
    }
})

const upload = multer({ storage: storage });

//Add New Food
router.post('/addfood', verifyUser, upload.single('Picture'), async (req, res) => {
    //Checking if the user is admin or not
    if (req.user !== process.env.ADMIN) {
        return res.status(400).json({ success: false, message: "You are not authorized" });
    }
    let Picture = req.file.filename
    const { Name, foodId, Category, Unit, Price } = req.body

    // Checking if something is missing in the body
    
    if (!Name || !foodId || !Category || !Price || !Unit || !Picture) {
        return res.status(400).json({ success: false, message: "Please Fill the data properly" });
    }
    try {
        const newFood = new Food({ Name, foodId, Category, Price, Unit, Picture })
        await newFood.save();
        return res.status(201).json({ success: true, message: "Food Added" });
    } catch (error) {
        return res.status(400).json({ success: false, message: "some error occured" });
    }
})

//Updating the food components
router.patch('/update/:foodId', verifyUser, async (req, res) => {
    //Checking if the user is admin or not
    if (req.user !== process.env.ADMIN) {
        return res.status(400).json({ success: false, message: "You are not authorized" });
    }
    // Checking if something is missing in the body
    if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
        return res.status(400).json({ success: false, message: "Please Fill the data" });
    }
    try {
        const food = await Food.findOne({ foodId: req.params.foodId })
        if (!food) {
            return res.status(400).json({ success: false, message: "No such food item" });
        }
        await Food.findByIdAndUpdate(food._id, req.body)
        return res.status(200).json({ success: true, message: "Food Item Updated" });

    } catch (error) {
        return res.status(400).json({ success: false, message: "some error occured" });
    }
})

//Remove the food items
router.delete('/delete/:foodId', verifyUser, async (req, res) => {
    //Checking if the user is admin or not
    if (req.user !== process.env.ADMIN) {
        return res.status(400).json({ success: false, message: "You are not authorized" });
    }

    try {
        const food = await Food.findOne({ foodId: req.params.foodId })
        if (!food) {
            return res.status(400).json({ success: false, message: "No such food item" });
        }
        await Food.findByIdAndDelete(food._id)
        return res.status(200).json({ success: true, message: "Food Item Deleted" });

    } catch (error) {
        return res.status(400).json({ success: false, message: "some error occured" });
    }
})



module.exports = router