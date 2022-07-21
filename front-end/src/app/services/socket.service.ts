import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Socket } from 'ngx-socket-io';
import { UserStatus } from '../interfaces/user.interface';

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

  notifyReadersAboutPageDelete = this.socket.fromEvent(
    'notifyReadersAboutPageDelete'
  );

  notifyReadersAboutPageEditors = this.socket.fromEvent<{
    [username: string]: string;
  }>('notifyReadersAboutPageEditors');

  userStatusUpdated = this.socket.fromEvent<UserStatus>('userStatusUpdated');

  joinPageRoom(
    pageTitle: string
  ): Promise<{ [username: string]: string }> {
    return new Promise((resolve, reject) => {
      this.socket.emit(
        'joinPageRoom',
        pageTitle,
        (response: { [username: string]: string } | null) => {
          if (response == null) {
            return reject('Error: pageEditors is null.');
          }
          return resolve(response);
        }
      );
    });
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
      pageFrozen: pageFrozen,
    });
  }

  finishedPageDelete(room: string) {
    this.socket.emit('finishedPageDelete', {
      room: room,
    });
  }

  editPage(username: string, title: string) {
    this.socket.emit('editPage', {
      username: username,
      title: title,
    });
  }

  leaveEditPage(username: string, title: string) {
    this.socket.emit('leaveEditPage', {
      username: username,
      title: title
    });
  }

  loginUser(username: string) {
    this.socket.emit('loginUser', {
      username: username,
    });
  }

  logoutUser(username: string) {
    this.socket.emit('logoutUser', {
      username: username,
    });
  }

  checkUserStatus(
    username: string
  ): Promise<{ status: string; editing: string }> {
    return new Promise((resolve, reject) => {
      this.socket.emit(
        'checkUserStatus',
        {
          username: username,
        },
        (response: { status: string; editing: string } | null) => {
          if (response == null) {
            return reject('Failed to get user status.');
          }
          if (typeof response === 'object' && !Object.keys(response).length) {
            return resolve({ status: 'offline', editing: '' });
          }
          return resolve(response);
        }
      );
    });
  }
}
