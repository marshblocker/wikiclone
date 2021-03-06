import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserPublic } from 'src/app/interfaces/user.interface';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userInfo!: UserPublic;
  isUpdatingUserInfo = false;
  isUpdatingUsername = false;
  isUpdatingPassword = false;
  isUpdatingEmail = false;
  passwordsMatch = true;
  viewingOwnProfile = false;
  viewerIsAdmin = false;
  viewerIsLoggedIn = false;
  paginationType = 'get-all-page-edits-of-user';

  constructor(private router: Router,
              private route: ActivatedRoute,
              private userService: UserService,
              private tokenService: TokenService) { }

  ngOnInit(): void {
    this.viewerIsLoggedIn = this.tokenService.tokenInCookie();
    this.route.paramMap.subscribe(params => {
      const username = params.get('username');
      if (username == null) {
        window.alert('Username is null!\n\nYou will be redirected back to the main page.');
        this.router.navigateByUrl('/');
        return;
      }
      this.userService.readUser(username)
        .then((userInfo: UserPublic) => {
          this.userInfo = userInfo;

          if (this.viewerIsLoggedIn) {
            this.userService.readCurrentUser()
              .then((currentUserInfo: UserPublic) => {
                if (currentUserInfo.role === 'admin') {
                  this.viewerIsAdmin = true;
                }
                if (currentUserInfo.username === this.userInfo.username) {
                  this.viewingOwnProfile = true;
                }
              })
              .catch(console.log);
          } else {
            this.viewerIsAdmin = false;
            this.viewingOwnProfile = false;
          }
        })
        .catch((err: HttpErrorResponse) => {
          if (err.status === 404) {
            this.router.navigateByUrl('/404?resource=user');
          } else {
            window.alert(`${err.error.message}\n\nYou will be redirected back to the main page.`);
            this.router.navigateByUrl('/');
          }
        });
    })
  }

  startUpdateUsername() {
    this.isUpdatingUserInfo = true;
    this.isUpdatingUsername = true;
  }

  startUpdatePassword() {
    this.isUpdatingUserInfo = true;
    this.isUpdatingPassword = true;
    this.passwordsMatch = true;
  }

  startUpdateEmail() {
    this.isUpdatingUserInfo = true;
    this.isUpdatingEmail = true;
  }

  updateUsername() {
    const newUsername = (<HTMLInputElement>document.getElementById('new-username')).value;
    if (this.userInfo == null) {
      console.log('No user found!');
      return;
    }

    const proceed = window.confirm('Update username?');
    if (!proceed) return;

    this.userService.updateUsername(this.userInfo.user_id, newUsername)
      .then(newUsername => {
        console.log('new username: ', newUsername);
        if (this.viewingOwnProfile) {
          this.logout();
        } else {
          this.refreshPage(newUsername);
        }
      })
      .catch(console.log);
  }

  updatePassword() {
    const newPassword = (<HTMLInputElement>document.getElementById('new-password')).value;
    const rewriteNewPassword = (<HTMLInputElement>document.getElementById('rewrite-new-password')).value;
    if (newPassword !== rewriteNewPassword) {
      this.passwordsMatch = false;
      return;
    }

    if (this.userInfo == null) {
      console.log('No user found!');
      return;
    }

    const proceed = window.confirm('Update password?');
    if (!proceed) return;

    console.log(newPassword);

    this.userService.updatePassword(this.userInfo.user_id, newPassword)
      .then(() => {
        console.log('Password has been successfully updated.');
        if (this.viewingOwnProfile) {
          this.logout();
        } else {
          this.refreshPage();
        }
      })
      .catch(console.log);
  }

  updateEmail() {
    const newEmail = (<HTMLInputElement>document.getElementById('new-email')).value;
    if (this.userInfo == null) {
      console.log('No user found!');
      return;
    }

    const proceed = window.confirm('Update email?');
    if (!proceed) return;

    this.userService.updateEmail(this.userInfo.user_id, newEmail)
      .then(newEmail => {
        console.log('new email: ', newEmail);
        if (this.viewingOwnProfile) {
          this.logout();
        } else {
          this.refreshPage();
        }
      })
      .catch(console.log);
  }

  updateRole() {
    const newRole = (this.userInfo?.role === 'user') ? 'admin' : 'user';
    if (this.userInfo == null) {
      console.log('No user found!');
      return;
    }

    const proceed = window.confirm('Update role?');
    if (!proceed) return;

    this.userService.updateRole(this.userInfo?.user_id, newRole)
      .then(newRole => {
        console.log('new role:', newRole);
        location.reload();
      })
      .catch(console.log);
  }

  updateCanEdit() {
    const newCanEdit = (this.userInfo?.can_edit) ? false : true;
    if (this.userInfo == null) {
      console.log('No user found!');
      return;
    }

    const proceed = window.confirm('Update can_edit?');
    if (!proceed) return;

    this.userService.updateCanEdit(this.userInfo?.user_id, newCanEdit)
      .then(newCanEdit => {
        console.log('new can_edit:', newCanEdit);
        location.reload();
      })
      .catch(console.log);
  }

  deleteAccount() {
    if (this.userInfo == null) {
      console.log('No user found!');
      return;
    }

    const proceed = window.confirm('Are you sure you want to delete your account?');
    if (!proceed) return;

    this.userService.deleteUser(this.userInfo.username)
      .then(deletedUserInfo => {
        console.log(deletedUserInfo);
        if (this.viewingOwnProfile) {
          this.logout();
        } else {
          this.goHome();
        }
      })
      .catch(console.log);
  }

  cancelUpdate() {
    this.isUpdatingUserInfo = false;
    this.isUpdatingUsername = false;
    this.isUpdatingPassword = false;
    this.isUpdatingEmail = false;
  }

  logout() {
    this.router.navigateByUrl('/?logout=true');
  }

  refreshPage(username?: string) {
    if (username) {
      let route = `/user/${username}/profile`;
      this.router.navigateByUrl(route)
        .then(navigated => {
          if (!navigated) {
            console.log('Error! Failed to go to the user profile.');
          } else {
            location.reload();
          }
        })
        .catch(console.log);
    } else {
      location.reload();
    }
  }

  goHome() {
    this.router.navigateByUrl('/');
  }

  removePasswordWarning() {
    this.passwordsMatch = true;
  }
}
