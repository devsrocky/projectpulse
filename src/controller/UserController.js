const { CreateUserService, UserLoginService } = require("../service/UserService");

exports.CreateUser = async (req, res) => {
    let data = await CreateUserService(req);
    return res.status(200).json(data)
}

exports.UserLogin = async (req, res) => {
    let data = await UserLoginService(req);
    if(data?.['status'] === 'login'){
        // let cookieOption = {
        //     httpOnly: true,
        //     expires: new Date(Date.now() + 72 * 60 * 60 * 1000)
        // }

        // let cookieOptions = {
        //       httpOnly: true,                                // secure & middleware readable
        //       secure: process.env.NODE_ENV === 'production', // HTTPS required in production
        //       sameSite: 'none',                              // important for cross-origin
        //       maxAge: 72 * 60 * 60 * 1000,                  // 72 hours
        //       path: '/',                                     // available on all routes
        // };

        const cookieOptions = {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // true in production, false on localhost
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' only in prod
          maxAge: 72 * 60 * 60 * 1000, // 72 hours
          path: '/',
        };
        res.cookie('token', data['token'], cookieOption)
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
