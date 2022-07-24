const constants = require('../constants');
const redis = require('../database/redis');

class Sockets {
    constructor(io) {
        this.io = io;

        this.io.on('connection', socket => {
            this.io.emit('hello', { world: 'world' });

            socket.on('joinPageRoom', async (pageTitle, callback) => {
                socket.join(pageTitle);
                const pageEditors = await redis.hgetall(pageTitle + '-editors');
                console.log(pageEditors);
                callback(pageEditors);
            });

            socket.on('exitPageRoom', pageTitle => {
                socket.leave(pageTitle);
                console.log(socket.rooms);
            });

            socket.on('finishedPageUpdate', args => {
                this.io.to(args.room).emit('notifyReadersAboutPageUpdate', args.currentPageTitle);
            });

            socket.on('finishedFreezePageUpdate', args => {
                this.io.to(args.room).emit('toggleEditArticleButtonVisibility', args.pageFrozen);
            });

            socket.on('finishedPageDelete', args => {
                this.io.to(args.room).emit('notifyReadersAboutPageDelete');
            });

            socket.on('editPage', async args => {
                const userStatus = {
                    status: 'online',
                    editing: args.title
                };
                console.log('userStatus:');
                console.log(userStatus);
                // Store user status in cache.
                const cacheResult = await redis
                    .pipeline()
                    .hset(args.username,
                        'status', userStatus.status,
                        'editing', userStatus.editing
                    )
                    .exec()
                // Store username in list of current page editors.
                await redis.hset(args.title + '-editors',
                    args.username, args.username
                );
                const pageEditors = await redis.hgetall(args.title + '-editors');
                // Notify viewers of this user's profile of change in its user status.
                this.io.to(args.username).emit('userStatusUpdated', userStatus);
                // Notify readers of the article being edited by the user.
                this.io.to(args.title).emit('notifyReadersAboutPageEditors', pageEditors);
            })

            socket.on('leaveEditPage', async args => {
                const userStatus = {
                    status: 'online',
                    editing: ''
                };
                // Store user status in cache.
                const cacheResult = await redis
                    .pipeline()
                    .hset(args.username,
                        'status', userStatus.status,
                        'editing', userStatus.editing
                    )
                    .exec()
                const delResult = await redis.hdel(args.title + '-editors', args.username);
                const pageEditors = await redis.hgetall(args.title + '-editors');
                console.log('Yo');
                console.log(pageEditors);
                this.io.to(args.username).emit('userStatusUpdated', userStatus);
                this.io.to(args.title).emit('notifyReadersAboutPageEditors', pageEditors);
            })

            socket.on('loginUser', async args => {
                const userStatus = {
                    status: 'online',
                    editing: ''
                };
                const cacheResult = await redis
                    .pipeline()
                    .hset(args.username,
                        'status', userStatus.status,
                        'editing', userStatus.editing
                    )
                    .expire(args.username, constants.reddis.USER_CACHE_EXPIRATION_TIME)
                    .exec()
                this.io.to(args.username).emit('userStatusUpdated', userStatus);
            });

            socket.on('logoutUser', async args => {
                const userStatus = {
                    status: 'offline',
                    editing: ''
                };
                const delResult = await redis.del(args.username);
                this.io.to(args.username).emit('userStatusUpdated', userStatus);
            });

            socket.on('checkUserStatus', async (args, callback) => {
                socket.join(args.username);
                const readResult = await redis.hgetall(args.username);
                console.log('readResult: ');
                console.log(readResult);
                callback(readResult);
            })
        });
    }
}

module.exports = Sockets;