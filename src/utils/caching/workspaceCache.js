const NodeCache = require("node-cache");

const cache = new NodeCache({
    stdTTL: 3600,       // Default time-to-live for cache entries: 1 hour
    checkperiod: 1600,  // How often to check for and remove expired items
    useClones: false    // Recommended for performance
});

// Export the single instance to be used everywhere
module.exports = cache;
