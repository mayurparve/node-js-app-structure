
const db = require('../models');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc Register user
// @route POST /api/v1/auth/register
// @access public
exports.register = asyncHandler(async (req, res, next) => {
    const user = await db.user.create(req.body);

    sendTokenReponse(user, 200, res);
});

// @desc Login user
// @route POST /api/v1/auth/login
// @access public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password)
        return (next(new ErrorResponse(`Please provide an email and password`), 400));

    //Check user exist
    const user = await db.user.findOne({
        where: {
            email: email
        }
    });

    if (!user)
        return (next(new ErrorResponse(`Invalid credentials`), 401));

    //Match Password
    const isMatch = await user.matchPassword(password, user.password);

    if (!isMatch)
        return (next(new ErrorResponse(`Invalid credentials`), 401));

    sendTokenReponse(user, 200, res);
});

// @desc Logout user
// @route POST /api/v1/auth/logout
// @access public
exports.logout = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res
        .status(200)
        .json({
            success: true
        })
});

const sendTokenReponse = async (user, statusCode, res) => {
    const token = await user.getSignedJwtToken(user.user_id);

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_PARSER * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if(process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token: token
        })
}