import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageEdit } from '../interfaces/page-edit.interface';
import { Page } from '../interfaces/page.interface';

@Injectable({
  providedIn: 'root'
})
export class PageEditService {

  constructor(private http: HttpClient) { }

  submitNewPageEdit = (page: Page, editSummary: string): Promise<PageEdit> => {
    return new Promise((resolve, reject) => {
      const url = 'http://localhost:3000/page-edits';

      const { page_version, timestamp, page_id, freeze_page, content } = page;
      this.http.post<PageEdit>(url, 
        { 
          'page_version': page_version,
          'timestamp': timestamp,
          'edit_summary': editSummary,
          'page_id': page_id,
          'freeze_page': freeze_page,
          'current_title': content.title,
          'content': content 
        }, 
        { 
          headers: { 'Authorization': document.cookie }, 
          observe: 'response', 
          responseType: 'json'
        }
      ).subscribe((newPageEditResponse: HttpResponse<PageEdit>) => {
          if (newPageEditResponse.body === null) {
            return reject('New page edit is null!');
          }
          return resolve(newPageEditResponse.body);
        });
    });
  }

  getUserPageEdits = (offset: number, limit: number, username: string): Promise<PageEdit[]> => {
    return new Promise((resolve, reject) => {
      const url = 'http://localhost:3000/page-edits?username=' + username + '&offset=' + offset + '&limit=' + limit;
      this.http.get<PageEdit[]>(url, 
        { 
          headers: { 'Authorization': document.cookie }, 
          observe: 'response', 
          responseType: 'json'
        }
      ).subscribe((userPageEditsResponse: HttpResponse<PageEdit[]>) => {
        if (userPageEditsResponse.body === null) {
          return reject('Failed to get user page edits!');
        }
        return resolve(userPageEditsResponse.body);
      })
    });
  }

  getPageEditByPageTitleAndPageVersion = (pageTitle: string, pageVersion: string): Promise<PageEdit> => {
    return new Promise((resolve, reject) => {
      const url = 'http://localhost:3000/page-edits?page_title=' + pageTitle + '&page_version=' + pageVersion;
      let pageEdit: PageEdit;
      this.http.get<PageEdit>(url, 
        { 
          headers: { 'Authorization': document.cookie }, 
          observe: 'response', 
          responseType: 'json'
        }
      ).subscribe({

        next: (pageEditResponse: HttpResponse<PageEdit>) => {
          if (pageEditResponse.body === null) {
            return reject('Failed to get user page edits!');
          }
          pageEdit = pageEditResponse.body;
        },

        error: (err: HttpErrorResponse) => {
          return reject(err);
        },

        complete: () => {
          return resolve(pageEdit);
        }
      })
    });
  }

  getAllPageEditsOfAPage = (offset: number, limit: number, pageTitle: string): Promise<PageEdit[]> => {
    return new Promise((resolve, reject) => {
      const url = 'http://localhost:3000/page-edits?page_title=' + pageTitle + '&offset=' + offset + '&limit=' + limit;
      this.http.get<PageEdit[]>(url,
        { 
          headers: { 'Authorization': document.cookie }, 
          observe: 'response', 
          responseType: 'json'
        }
      ).subscribe((pageEditsResponse: HttpResponse<PageEdit[]>) => {
        if (pageEditsResponse.body === null) {
          return reject('Failed to get page edits of a page.');
        }
        return resolve(pageEditsResponse.body);
  getLatestVersionOfEachPage = (): Promise<
    { [page_title: string]: number }
  > => {
    return new Promise((resolve, reject) => {
      const url = constants.ROOT_URL + 'page-edits?return=latest_versions';
      let latestVersions: { [page_title: string]: number } = {};
      this.http
        .get<{ latest_version: number; current_title: string }[]>(url, {
          headers: { Authorization: document.cookie },
          observe: 'response',
          responseType: 'json',
    })
        .subscribe({
          next: (
            response: HttpResponse<
              { latest_version: number; current_title: string }[]
            >
          ) => {
            if (response.body == null) {
              return reject(
                'Failed to get the latest versions of all the articles'
              );
  }

            response.body.forEach(
              (obj: { latest_version: number; current_title: string }) => {
                latestVersions[obj.current_title] = obj.latest_version;
            });
          },

          error: (err: HttpErrorResponse) => {
            return reject(err);
          },

          complete: () => {
            return resolve(latestVersions);
          },
        });
    });
  };
}