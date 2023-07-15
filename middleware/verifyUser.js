//MIDDLEWARE TO VERIFY THE USER

const jwt = require('jsonwebtoken')
const secretKey = process.env.SECRET

const verifyUser = async (req, res, next) => {
    //Get the user from the jwt token and add id to the req object
    const token = req.header('token');
    if (!token) {
      return  res.status(401).send({ success: false, message: "Please authenticate" })
    }
    try {
        const data = await jwt.verify(token, secretKey);
        req.user = data._id;
        next();

    } catch (error) {
       return res.status(401).send({ success: false, message: "Please authenticate using a valid token" });
    }
}
module.exports = verifyUser