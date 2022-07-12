import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Page } from 'src/app/interfaces/page.interface';
import { UserPublic } from 'src/app/interfaces/user.interface';
import { PageService } from 'src/app/services/page.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  users!: UserPublic[];
  pages!: Page[];
  displayUsers = true;
  renderReady = true;
  noUsers = false;
  noPages = false;

  constructor(private userService: UserService, 
              private pageService: PageService, 
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    Promise.all([this.userService.readAllUsers(), this.pageService.getAllPages()])
      .then((res: [UserPublic[], Page[]]) => {
        let [users, pages] = res;
        if (users == null) {
          console.log('No users received!');
          return;
        }
        if (pages == null) {
          console.log('No pages receievd!');
          return;
        }
        this.route.paramMap.subscribe(params => {
          const currentUsername = params.get('username');
          console.log(currentUsername);
          users = users.filter(user => user.username !== currentUsername);
          this.users = users;
          this.pages = pages;
          if (this.users.length === 0) {
            this.noUsers = true;
          }
          if (this.pages.length === 0) {
            this.noPages = true;
          }
        })
      })
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
        console.log(deletedPage);
        location.reload();
      })
      .catch(console.log);
  }
}
