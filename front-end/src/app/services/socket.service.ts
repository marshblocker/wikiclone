import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor(private socket: Socket) {}

  // helloWorld() {
  //   this.socket.fromEvent('hello').subscribe(data => {
  //     console.log(data);
  //   });
  // }

  notifyReadersAboutPageUpdate = this.socket.fromEvent<string>(
    'notifyReadersAboutPageUpdate'
  );

  toggleEditArticleButtonVisibility = this.socket.fromEvent<boolean>(
    'toggleEditArticleButtonVisibility'
  );

  joinPageRoom(pageTitle: string) {
    this.socket.emit('joinPageRoom', pageTitle);
  }

  exitPageRoom(pageTitle: string) {
    this.socket.emit('exitPageRoom', pageTitle);
  }

  finishedPageUpdate(room: string, currentPageTitle: string) {
    this.socket.emit('finishedPageUpdate', {
      room: room,
      currentPageTitle: currentPageTitle,
    });
  }

  finishedFreezePageUpdate(room: string, pageFrozen: boolean) {
    this.socket.emit('finishedFreezePageUpdate', {
      room: room,
      pageFrozen: pageFrozen
    });
  }
}
