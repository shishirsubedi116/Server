const mongoose = require('mongoose')
const validator = require('validator')


const forgotSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: [true, "Enter a unique email"],
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email")
            }
        }
    },

    otp: {
        type: String,
        required: true
    },
    expireAt: { type: Date, default: Date.now() + 60000, expires: 60 }
})



// we will create a new collection
const Forgot = new mongoose.model('Forgot', forgotSchema)

module.exports = Forgot;