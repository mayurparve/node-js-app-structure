const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const db = require('../models');

//Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.autorization && req.headers.autorization.startsWith('Bearer')) {
        token = req.headers.autorization.split(' ')[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token)
        return next(new ErrorResponse(`Not autorized to access this route`, 401));

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await db.user.findByPk(decoded.id);
        console.log("setting user", decoded);
        next();
    } catch (error) {
        console.log(error);
        return next(new ErrorResponse(`Not autorized to access this route`, 401));
    }
});

exports.authorize = (...roles) => {
    return (req, res, next) => {
        console.log(req.user);
        if(!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403));
        }
        next();
    }
}