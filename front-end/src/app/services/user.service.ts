import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginCredentials, UserPublic, UserRequiredInfo } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  public registerNewUser = (info: UserRequiredInfo): Promise<UserPublic> => {
    return new Promise((resolve, reject) => {
      const url = 'http://localhost:3000/users';
      this.http.post<{ info: UserPublic }>(url, { 'info': info }, 
        { 
          headers: { 'Authorization': document.cookie }, 
          observe: 'response', 
          responseType: 'json'
        }
      ).subscribe((newUserResponse: HttpResponse<{ info: UserPublic }>) => {
          if (newUserResponse.body === null) {
            return reject('New user is null!');
          }
          return resolve(newUserResponse.body.info);
        });
    });
  }

  public loginUser = (credentials: LoginCredentials): Promise<string> => {
    return new Promise((resolve, reject) => {
      const url = 'http://localhost:3000/login';
      let token = '';
      this.http.post<{token: string}>(url, { 'credentials': credentials },
        { 
          headers: { 'Authorization': document.cookie }, 
          observe: 'response', 
          responseType: 'json'
        }
      ).subscribe({
        next: (response: HttpResponse<{ token: string }>) => {
          if (response.body == null) {
            return reject('Failed to log in user.');
          }
          token = response.body?.token;
        },

        error: (err: HttpErrorResponse) => {
          return reject(err);
        },

        complete: () => {
          return resolve(token);
        }
      })
    });
  }

  public readAllUsers = (offset: number, limit: number): Promise<UserPublic[]> => {
    return new Promise((resolve, reject) => {
      const url = 'http://localhost:3000/users?offset=' + offset + '&limit=' + limit;
      this.http.get<{'info': UserPublic}[]>(url, 
        {
          headers: { 'Authorization': document.cookie },
          observe: 'response',
          responseType: 'json'
        }
      ).subscribe((response: HttpResponse<{'info': UserPublic}[]>) => {
        if(response.body === null) {
          return reject('No users was received!');
        }
        let allUsers: UserPublic[] = [];
        for (let i = 0; i < response.body.length; i++) {
          allUsers.push(response.body[i]['info']);
        }
        return resolve(allUsers);
      })
    });
  }

  public readUser = (username: string): Promise<UserPublic> => {
    return new Promise((resolve, reject) => {
      const url = 'http://localhost:3000/users/' + username + '/info';
      let user: UserPublic;
      this.http.get<{'info': UserPublic}>(url, 
        {
          headers: { 'Authorization': document.cookie }, 
          observe: 'response', 
          responseType: 'json'
        }
      ).subscribe({

        next: (response: HttpResponse<{'info': UserPublic}>) => {
          if(response.body === null) {
            return reject('No user received!');
          }
          user = response.body.info;
        },

        error: (err) => {
          return reject(err);
        },

        complete: () => {
          return resolve(user);
        }
      })
    });
  }

  public readCurrentUser = (): Promise<UserPublic> => {
    return new Promise((resolve, reject) => {
      const url = 'http://localhost:3000/users/current';
      this.http.get<{'info': UserPublic}>(url, 
        {
          headers: { 'Authorization': document.cookie }, 
          observe: 'response', 
          responseType: 'json'
        }
      ).subscribe((response: HttpResponse<{'info': UserPublic}>) => {
        if(response.body === null) {
          return reject('No user received!');
        }
        return resolve(response.body.info);
      })
    });
  }

  public updateUsername = (userId: string, newUsername: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const url = 'http://localhost:3000/users/' + userId + '/username';
      this.http.patch<{username: string}>(url, {username: newUsername}, 
        {
          headers: { 'Authorization': document.cookie }, 
          observe: 'response', 
          responseType: 'json'
        }
      ).subscribe((response: HttpResponse<{username: string}>) => {
        if (response.body === null) {
          return reject('Failed to update username!');
        }
        return resolve(response.body.username);
      })
    })
  } 

  public updateEmail = (userId: string, newEmail: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const url = 'http://localhost:3000/users/' + userId + '/email';
      this.http.patch<{email: string}>(url, {email: newEmail}, 
        {
          headers: { 'Authorization': document.cookie }, 
          observe: 'response', 
          responseType: 'json'
        }
      ).subscribe((response: HttpResponse<{email: string}>) => {
        if (response.body == null) {
          return reject('Failed to update username!');
        }
        return resolve(response.body.email);
      })
    })
  } 

  public updatePassword = (userId: string, newPassword: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const url = 'http://localhost:3000/users/' + userId + '/password';
      this.http.patch<{password: string}>(url, {password: newPassword}, 
        {
          headers: { 'Authorization': document.cookie }, 
          observe: 'response', 
          responseType: 'json'
        }
      ).subscribe((response: HttpResponse<{password: string}>) => {
        if (response.body == null) {
          return reject('Failed to update username!');
        }
        return resolve(response.body.password);
      })
    })
  } 

  public updateRole = (userId: string, newRole: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const url = 'http://localhost:3000/users/' + userId + '/role';
      this.http.patch<{role: string}>(url, {role: newRole}, 
        {
          headers: { 'Authorization': document.cookie }, 
          observe: 'response', 
          responseType: 'json'
        }
      ).subscribe((response: HttpResponse<{role: string}>) => {
        if (response.body == null) {
          return reject('Failed to update username!');
        }
        return resolve(response.body.role);
      })
    })
  }
  
  public updateCanEdit = (userId: string, canEdit: boolean): Promise<string> => {
    return new Promise((resolve, reject) => {
      const url = 'http://localhost:3000/users/' + userId + '/can_edit';
      this.http.patch<{can_edit: string}>(url, {can_edit: canEdit}, 
        {
          headers: { 'Authorization': document.cookie }, 
          observe: 'response', 
          responseType: 'json'
        }
      ).subscribe((response: HttpResponse<{can_edit: string}>) => {
        if (response.body == null) {
          return reject('Failed to update username!');
        }
        return resolve(response.body.can_edit);
      })
    })
  }   

  public deleteUser = (username: string): Promise<UserPublic> => {
    return new Promise((resolve, reject) => {
      const url = 'http://localhost:3000/users/' + username;
      this.http.delete<{info: UserPublic}>(url, 
        {
          headers: { 'Authorization': document.cookie }, 
          observe: 'response', 
          responseType: 'json'
        }  
      ).subscribe((response: HttpResponse<{info: UserPublic}>) => {
        if (response.body == null) {
          return reject('Failed to delete user');
        }
        return resolve(response.body.info);
      })
    })
  }
}
