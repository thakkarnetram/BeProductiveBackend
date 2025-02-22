const productiveLimiter = require('express-rate-limit');

//  TODOs Limiting
exports.getTodoLimit = productiveLimiter({
    windowMs: 5 * 60 * 1000, // every 5 minutes
    limit: 150, // 150 Reqs every 5 minutes
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    message: {
        error: 'Too many requests please try again in 10 minutes !'
    }
})

exports.getRecentTodoLimit = productiveLimiter({
    windowMs: 5 * 60 * 1000, // every 5 minutes
    limit: 150, // 150 Reqs every 5 minutes
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    message: {
        error: 'Too many requests please try again in 10 minutes !'
    }
})

exports.addTodoLimit = productiveLimiter({
    windowMs: 5 * 60 * 1000, // every 5 minutes
    limit: 150, // 150 Reqs every 5 minutes
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    message: {
        error: 'Too many requests please try again in 10 minutes !'
    }
})

exports.updateTodoLimit = productiveLimiter({
    windowMs: 5 * 60 * 1000, // every 5 minutes
    limit: 150, // 150 Reqs every 5 minutes
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    message: {
        error: 'Too many requests please try again in 10 minutes !'
    }
})


exports.deleteTodoLimit = productiveLimiter({
    windowMs: 5 * 60 * 1000, // every 5 minutes
    limit: 150, // 150 Reqs every 5 minutes
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    message: {
        error: 'Too many requests please try again in 10 minutes !'
    }
})

// NOTES Limiting
exports.getNotesLimit = productiveLimiter({
    windowMs: 5 * 60 * 1000, // every 5 minutes
    limit: 150, // 150 Reqs every 5 minutes
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    message: {
        error: 'Too many requests please try again in 10 minutes !'
    }
})

exports.getRecentNoteLimit = productiveLimiter({
    windowMs: 5 * 60 * 1000, // every 5 minutes
    limit: 150, // 150 Reqs every 5 minutes
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    message: {
        error: 'Too many requests please try again in 10 minutes !'
    }
})

exports.addNoteLimit = productiveLimiter({
    windowMs: 5 * 60 * 1000, // every 5 minutes
    limit: 150, // 150 Reqs every 5 minutes
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    message: {
        error: 'Too many requests please try again in 10 minutes !'
    }
})

exports.updateNoteLimit = productiveLimiter({
    windowMs: 5 * 60 * 1000, // every 5 minutes
    limit: 150, // 150 Reqs every 5 minutes
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    message: {
        error: 'Too many requests please try again in 10 minutes !'
    }
})

exports.deleteNoteLimit = productiveLimiter({
    windowMs: 5 * 60 * 1000, // every 5 minutes
    limit: 150, // 150 Reqs every 5 minutes
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    message: {
        error: 'Too many requests please try again in 10 minutes !'
    }
})
