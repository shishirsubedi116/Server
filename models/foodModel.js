const mongoose = require('mongoose')
const foodSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        minlength: 3
    },
    foodId:{
        type: Number,
        required: true,
        unique:true,
    },

    Category: {
        type: String,
        required: true
    },
    Price: {
        type: Number,
        required: true
    },
    Unit:{
        type: String,
        required: true
    },

    Picture: {
        type: String,
        required: true
    },
    Availability: {
        type: String,
        default: 'true'
    },
    Specials: {
        type: String,
        default: 'None'
    },

})

// we will create a new collection
const Food = new mongoose.model('Food', foodSchema);

module.exports = Food;


/*
    Name: The name of the food item.
    Description: A brief description or summary of the food item.
    Category: The category or type of food item (e.g., burgers, sandwiches, pizzas, salads).
    Category: The price of the food item.
    Ingredients: A list of ingredients used in the food item.
    Allergens: Any common allergens present in the food item (e.g., gluten, dairy, nuts).
    Nutritional Information: Details about the nutritional content of the food item, such as calories, fat, carbohydrates, and protein.
    Image: An image or photo of the food item to give users a visual representation.
    Availability: Indication of whether the food item is currently available or not.
    Specials or Promotions: Any special offers, discounts, or promotions related to the food item.
*/