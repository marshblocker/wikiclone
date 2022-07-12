import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { PageContent, Page, PageSearchResultView } from '../interfaces/page.interface';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  constructor(private http: HttpClient) { }

  public getPage(pageId: string): Promise<Page> {
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
        return resolve(pageResponse.body);
      });
    });
  }

  public getPageByTitle(title: string): Promise<Page> {
    return new Promise((resolve, reject) => {
      const url = 'http://localhost:3000/pages?title=' + title;
      this.http.get<Page>(
        url, 
        { 
          headers: { 'Authorization': document.cookie }, 
          observe: 'response', 
          responseType: 'json' 
        }
      ).subscribe((pageResponse: HttpResponse<Page>) => {
        console.log(pageResponse);
        if (pageResponse.body === null) {
          return reject('Page is null!');
        }
        return resolve(pageResponse.body);
      });
    });
  }

  public getAllPages(): Promise<Page[]> {
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
        if (allPagesResponse.body === null) {
          return reject('Get all page id request failed!');
        }
        return resolve(allPagesResponse.body);
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
          return reject('Get all page id request failed!');
        }
        allPagesResponse.body.forEach(page => {
          allPageId.push(page.page_id);
        })
        return resolve(allPageId);
      });
    });
  }

  public getAllPageTitles(): Promise<string[]> {
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
        let allPageTitles: string[] = [];
        if (allPagesResponse.body === null) {
          return reject('Get all page id request failed!');
        }
        allPagesResponse.body.forEach(page => {
          allPageTitles.push(page.content.title);
        })
        return resolve(allPageTitles);
      });
    });
  }

  public getPagesBasedOnSearchString(searchString: string): Promise<PageSearchResultView[]> {
    return new Promise((resolve, reject) => {
      const url = 'http://localhost:3000/pages?contains=' + searchString;
      this.http.get<PageSearchResultView[]>(
        url,
        {
          headers: { 'Authorization': document.cookie }, 
          observe: 'response', 
          responseType: 'json' 
        }
      ).subscribe((matchedPagesResponse: HttpResponse<PageSearchResultView[]>) => {
        if (matchedPagesResponse.body == null) {
          return reject('Get all page based on search string failed!');
        }
        return resolve(matchedPagesResponse.body);
      });
    });
  }

  public submitNewPage(content: PageContent): Promise<Page> {
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
          return resolve(newPageResponse.body);
        });
    })
  }

  public updatePage(pageId: string, content: PageContent): Promise<Page> {
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
        if (updatedPageResponse.body == null) {
          return reject('Updated page is null!');
        }
        return resolve(updatedPageResponse.body);
      })
    });
  }

  public updateFreezePage(pageId: string, freezePage: boolean): Promise<Page> {
    return new Promise((resolve, reject) => {
      const url = 'http://localhost:3000/pages/' + pageId + '/freeze_page';
      this.http.patch<Page>(
        url, { 'freeze_page': freezePage },
        { 
          headers: { 'Authorization': document.cookie }, 
          observe: 'response', 
          responseType: 'json'
        }
      ).subscribe((response: HttpResponse<Page>) => {
        if (response.body == null) {
          return reject('Frozen page is null!');
        }
        return resolve(response.body);
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
