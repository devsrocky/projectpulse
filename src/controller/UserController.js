const { CreateUserService, UserLoginService } = require("../service/UserService");

exports.CreateUser = async (req, res) => {
    let data = await CreateUserService(req);
    return res.status(200).json(data)
}

exports.UserLogin = async (req, res) => {
    let data = await UserLoginService(req);
    if(data?.['status'] === 'login'){
        let cookieOption = {
            httpOnly: true,
            expires: new Date(Date.now() + 72 * 60 * 60 * 1000)
        }


        // res.cookie('token', data['token'], cookieOption)
        res.setHeader('Set-Cookie', `token=${response.token.token}; Path=/; HttpOnly; Max-Age=${72*60*60}`);
        return res.status(200).json(data)
    }else{
        return res.status(200).json(data)
    }
}


exports.Logout = async (req, res) => {
    try {
        let cookieOption = {
            expires: new Date(Date.now() - 72 * 60 * 60 * 1000),
            httpOnly: false
        }
        res.cookie('token', "", cookieOption)
        return res.status(200).json({status: 'Logout', message: 'Logout successfully '})
    } catch (err) {
        return {status: 'failed', message: err.toString()}
    }
}
