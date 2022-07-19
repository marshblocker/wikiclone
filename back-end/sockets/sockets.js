class Sockets {
    constructor(io) {
        this.io = io;

        this.io.on('connection', socket => {
            console.log('connected');
            this.io.emit('hello', { world: 'world' });

            socket.on('joinPageRoom', pageTitle => {
                socket.join(pageTitle);
                console.log(socket.rooms);
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
        });
    }
}

module.exports = Sockets;