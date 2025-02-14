const redis = require('redis');
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const client = redis.createClient({
    url:process.env.REDIS_URL,
    socket:{tls:true}
});

client.on('error', (err) => {
    console.error('Redis client error' , err);
})

async function connectRedis(){
    try {
        await client.connect();
        console.log('Redis client connected !')
    }
    catch (err) {
        console.error('Redis connection failed',err)
    }
}

connectRedis();

module.exports = client;
