const Redis = require('ioredis');
const redis = new Redis({
    port: 6379,
    host: 'redis'
});

module.exports = redis;