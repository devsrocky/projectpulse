const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const UserModel = require('../model/UserModel');
const { EncodeToken } = require('../utility/TokenHelper');

const CreateUserService = async (req) => {
    try {
        let PostBody = req.body;
        let user = JSON.parse(req.headers['Userdetails']);

        if(user['role'] === 'Admin'){
            await UserModel.create(PostBody)
            return {status: 'success', message: 'User created success'}
        }else{
            return {status: 'success', message: 'You aren\'t capable to create user'}
        }



    } catch (err) {
        return {status: 'failed', message: err.toString()}
    }
}

const UserLoginService = async (req) => {
    try {
        let PostBody = req.body;
        let user = await UserModel.find({email: PostBody['email'], password: PostBody['password']})
        if(user.length > 0){
            let Userdetails = { _id: user[0]['_id'], email: user[0]['email'], role: user[0]['role']}
            let token = await EncodeToken(Userdetails);
            return {status: 'login', role: user[0]['role'], token: token}
        }else{
            return {status: 'failed', message: 'User didn\'t find'}
        }
    } catch (err) {
        return {status: 'failed', message: err.toString()}
    }
}



module.exports = {
    CreateUserService,
    UserLoginService
}
