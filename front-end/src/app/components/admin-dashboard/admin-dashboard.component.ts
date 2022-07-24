import { Component, OnInit } from '@angular/core';
import { Page } from 'src/app/interfaces/page.interface';
import { PageService } from 'src/app/services/page.service';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  displayUsers = true;

  constructor(private userService: UserService, 
              private pageService: PageService,
              private socketService: SocketService) { }

  ngOnInit(): void {
  }

  changeDisplay(type: 'users' | 'pages') {
    if (type === 'users') {
      this.displayUsers = true;
    } else if (type === 'pages') {
      this.displayUsers = false;
    } else {
      console.log('Error. Invalid display type.');
    }
  }

  deleteUser(username: string) {
    this.userService.deleteUser(username)
      .then(deletedUserInfo => {
        console.log(deletedUserInfo);
        location.reload();
      })
      .catch(console.log);
  }

  deletePage(pageId: string) {
    this.pageService.deletePage(pageId)
      .then((deletedPage: Page) => {
        this.socketService.finishedPageDelete(deletedPage.content.title);
        location.reload();
      })
      .catch(console.log);
  }
}
