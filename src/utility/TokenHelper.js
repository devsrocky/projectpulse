const jwt = require('jsonwebtoken');
require('dotenv').config();
const KEY = process.env.SECREET_KEY;


exports.EncodeToken = (Userdetails) => {
    const EXPIRE = {expiresIn: '72h'};
    const PAYLOAD = Userdetails;
    return jwt.sign(PAYLOAD, KEY, EXPIRE)
}

exports.DecodeToken = (token) => {
    try {
        return jwt.verify(token, KEY)
    } catch (err) {
        return null
    }
}