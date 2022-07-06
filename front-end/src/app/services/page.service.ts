import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { PageContent, Page } from '../interfaces/page.interface';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  constructor(private http: HttpClient) { }

  public getPageContent(pageId: string): Promise<PageContent> {
    return new Promise((resolve, reject) => {
      const url = 'http://localhost:3000/pages/' + pageId;
      this.http.get<Page>(
        url, 
        { 
          headers: { 'Authorization': document.cookie }, 
          observe: 'response', 
          responseType: 'json' 
        }
      ).subscribe((pageResponse: HttpResponse<Page>) => {
        if (pageResponse.body === null) {
          return reject('Page is null!');
        }
        return resolve(pageResponse.body.content);
      });
    });
  }

  public getAllPageId(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const url = 'http://localhost:3000/pages';
      this.http.get<Page[]>(
        url, 
        { 
          headers: { 'Authorization': document.cookie }, 
          observe: 'response', 
          responseType: 'json' 
        }
      ).subscribe((allPagesResponse: HttpResponse<Page[]>) => {
        let allPageId: string[] = [];
        if (allPagesResponse.body === null) {
          return reject('Get all page request failed!');
        }
        allPagesResponse.body.forEach(page => {
          allPageId.push(page.page_id);
        })
        return resolve(allPageId);
      });
    });
  }

  public submitNewPage(content: PageContent): Promise<string> {
    return new Promise((resolve, reject) => {
      const url = 'http://localhost:3000/pages';
      this.http.post<Page>(url, { 'content': content }, 
        { 
          headers: { 'Authorization': document.cookie }, 
          observe: 'response', 
          responseType: 'json'
        }
      ).subscribe((newPageResponse: HttpResponse<Page>) => {
          if (newPageResponse.body === null) {
            return reject('New page is null!');
          }
          return resolve(newPageResponse.body.page_id);
        });
    })
  }

  public updatePage(pageId: string, content: PageContent): Promise<null> {
    return new Promise((resolve, reject) => {
      const url = 'http://localhost:3000/pages/' + pageId + '/content';
      this.http.patch<Page>(
        url, { 'content': content },
        { 
          headers: { 'Authorization': document.cookie }, 
          observe: 'response', 
          responseType: 'json'
        }
      ).subscribe((updatedPageResponse: HttpResponse<Page>) => {
        if (updatedPageResponse.body === null) {
          return reject('Updated page is null!');
        }
        return resolve(null);
      })
    });
  }

  public deletePage(pageId: string): Promise<Page> {
    return new Promise((resolve, reject) => {
      const url = 'http://localhost:3000/pages/' + pageId;
      this.http.delete<Page>(url,
        { 
          headers: { 'Authorization': document.cookie }, 
          observe: 'response', 
          responseType: 'json'
        }
      ).subscribe((deletedPageResponse: HttpResponse<Page>) => {
        if (deletedPageResponse.body === null) {
          return reject('Updated page is null!');
        }
        return resolve(deletedPageResponse.body);
      })
    });
  }
}
