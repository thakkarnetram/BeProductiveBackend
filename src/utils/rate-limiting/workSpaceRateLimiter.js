const workSpaceLimiter = require('express-rate-limit')

//  Workspace Limiting
exports.workSpaceLimit = workSpaceLimiter({
    windowMs: 5 * 60 * 1000, // every 5 minutes
    limit: 150, // 150 Reqs every 5 minutes
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    message: {
        error: 'Too many requests please try again in 10 minutes !'
    }
})

exports.addWorkspaceLimit = workSpaceLimiter({
    windowMs: 5 * 60 * 1000, // every 5 minutes
    limit: 150, // 150 Reqs every 5 minutes
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    message: {
        error: 'Too many requests please try again in 10 minutes !'
    }
})

// Channel Limiting
exports.getChannelLimit = workSpaceLimiter({
    windowMs: 5 * 60 * 1000, // every 5 minutes
    limit: 150, // 150 Reqs every 5 minutes
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    message: {
        error: 'Too many requests please try again in 10 minutes !'
    }
})

exports.addChannelLimit = workSpaceLimiter({
    windowMs: 5 * 60 * 1000, // every 5 minutes
    limit: 150, // 150 Reqs every 5 minutes
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    message: {
        error: 'Too many requests please try again in 10 minutes !'
    }
})

// Message Limit
exports.messageLimit = workSpaceLimiter({
    windowMs: 5 * 60 * 1000, // every 5 minutes
    limit: 200, // 150 Reqs every 5 minutes
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    message: {
        error: 'Too many requests please try again in 10 minutes !'
    }
})

// Invite Links Limit
exports.inviteLimit = workSpaceLimiter({
    windowMs: 60 * 1000, // every 1 minute
    limit: 20, // 20 Reqs every 1 minute
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    message: {
        error: 'Too many requests please try again in 10 minutes !'
    }
})

exports.joinSpaceLimit = workSpaceLimiter({
    windowMs: 60 * 1000, // every 1 minute
    limit: 20, // 20 Reqs every 1 minute
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    message: {
        error: 'Too many requests please try again in 10 minutes !'
    }
})
