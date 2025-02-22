const authRateLimiter = require('express-rate-limit');

exports.loginLimit = authRateLimiter({
    windowMs: 10 * 60 * 1000, // every 10 minutes
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    message: {
        error: 'Too many login requests please try again in 10 minutes !'
    }
});

exports.registerLimit = authRateLimiter({
    windowMs: 5 * 60 * 1000, // every 5 minutes
    limit: 2,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    message: {
        error: 'Too many signup requests please try again in 5 minutes !'
    }
})

exports.verifyEmailLimit = authRateLimiter({
    windowMs: 60 * 1000, // every 1 minute
    limit: 1,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    message: {
        error: 'Too many verification requests please try again after a minute !'
    }
})

exports.resetPasswordGenerateLinkLimit = authRateLimiter({
    windowMs: 60 * 1000, // every 1 minute
    limit: 1,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    message: {
        error: 'Too many reset password requests please try again after a minute !'
    }
})

exports.resetPasswordPageLimit = authRateLimiter({
    windowMs: 20 * 60 * 1000, // every 2 minutes
    limit: 2,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    message: {
        error: 'Too many requests please try again after 2 minutes !'
    }
})

exports.resetPasswordUpdatingLimit = authRateLimiter({
    windowMs: 60 * 1000, // every 1 minute
    limit: 1,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    message: {
        error: 'Too many requests please try again after a minute !'
    }
})
