const express = require('express');
const Food = require('../models/foodModel');
const router = express.Router()

//Routes for user

//Get All the foods
router.get('/getallfoods', async (req, res) => {
    try {
        const { page, limit } = req.query
        const getFoods = await Food.find().limit(limit * 1).skip((page - 1) * limit)
        if (getFoods.length == 0) {
            return res.status(400).json({ success: false, message: "No foods available" });
        }
        return res.status(200).json({ success: true, message: getFoods })

    } catch (error) {
        return res.status(400).json({ success: false, message: "some error occured" });
    }
})

//Search the foodItem

router.get('/foodItem/:foodName', async (req, res) => {
    try {
        const key = req.params.foodName.toLowerCase();
        let food = await Food.find({
            "$or": [
                { "Name": { $regex: key } },
                { "Category": { $regex: key } }
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

//Get single food
router.get('/singlefood/:id', async (req, res) => {
    try {
        const food = await Food.findById(req.params.id)
        if (!food) {
            return res.status(400).json({ success: false, message: "No foods available" });
        }

        return res.status(200).json({ success: true, message: food });

    } catch (error) {
        return res.status(400).json({ success: false, message: "some error occured" });
    }
})


//



module.exports = router