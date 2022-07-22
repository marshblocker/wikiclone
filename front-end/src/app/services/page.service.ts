import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { PageContent, Page, PageSearchResultView } from '../interfaces/page.interface';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  constructor(private http: HttpClient) { }

  public getPage = (pageId: string): Promise<Page> => {
    return new Promise((resolve, reject) => {
      const url = 'http://localhost:3000/pages/' + pageId;
      this.http.get<Page>(
        url, 
        { 
          headers: { 'Authorization': document.cookie }, 
          observe: 'response', 
          responseType: 'json' 
        }
      ).subscribe({
        next: (pageResponse: HttpResponse<Page>) => {
          if (pageResponse.body === null) {
            return reject('Page is null!');
          }
          return resolve(pageResponse.body);
        },

        error: (err: HttpErrorResponse) => {
          return reject(err);
        }
      });
    });
  }

  public getPageByTitle = (title: string): Promise<Page> => {
    return new Promise((resolve, reject) => {
      const url = 'http://localhost:3000/pages?title=' + title;
      let page: Page;
      this.http.get<Page>(
        url, 
        { 
          headers: { 'Authorization': document.cookie }, 
          observe: 'response', 
          responseType: 'json' 
        }
      ).subscribe({
        
        next: (pageResponse: HttpResponse<Page>) => {
          if (pageResponse.body === null) {
            return reject('Page is null!');
          }
          page = pageResponse.body;
        },

        error: (err) => {
          return reject(err);
        },

        complete: () => {
          return resolve(page);
        }
      });
    });
  }

  public getAllPages = (offset: number, limit: number): Promise<Page[]> => {
    return new Promise((resolve, reject) => {
      const url = 'http://localhost:3000/pages?' + 'offset=' + offset + '&limit=' + limit;
      this.http.get<Page[]>(
        url, 
        { 
          headers: { 'Authorization': document.cookie }, 
          observe: 'response', 
          responseType: 'json' 
        }
      ).subscribe({
        next: (allPagesResponse: HttpResponse<Page[]>) => {
          if (allPagesResponse.body === null) {
            return reject('Get all page id request failed!');
          }
          return resolve(allPagesResponse.body);
        },

        error: (err: HttpErrorResponse) => {
          return reject(err);
        }
      });
    });
  }

  public getAllPageTitles = (): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const url = 'http://localhost:3000/pages?offset=0&limit=1000000';
      this.http.get<Page[]>(
        url, 
        { 
          headers: { 'Authorization': document.cookie }, 
          observe: 'response', 
          responseType: 'json' 
        }
      ).subscribe({
        next: (allPagesResponse: HttpResponse<Page[]>) => {
          let allPageTitles: string[] = [];
          if (allPagesResponse.body === null) {
            return reject('Get all page id request failed!');
          }
          allPagesResponse.body.forEach(page => {
            allPageTitles.push(page.content.title);
          })
          return resolve(allPageTitles);
        },

        error: (err) => {
          return reject(err);
        }
      });
    });
  }

  public getPagesBasedOnSearchString = (offset: number, limit: number, searchString: string): Promise<PageSearchResultView[]> => {
    return new Promise((resolve, reject) => {
      const url = 'http://localhost:3000/pages?contains=' + searchString + '&offset=' + offset + '&limit=' + limit;
      this.http.get<PageSearchResultView[]>(
        url,
        {
          headers: { 'Authorization': document.cookie }, 
          observe: 'response', 
          responseType: 'json' 
        }
      ).subscribe({
        next: (matchedPagesResponse: HttpResponse<PageSearchResultView[]>) => {
          if (matchedPagesResponse.body == null) {
            return reject('Get all page based on search string failed!');
          }
          return resolve(matchedPagesResponse.body);
        },

        error: (err: HttpErrorResponse) => {
          return reject(err);
        }
      });
    });
  }

  public submitNewPage = (content: PageContent): Promise<Page> => {
    return new Promise((resolve, reject) => {
      const url = 'http://localhost:3000/pages';
      this.http.post<Page>(url, { 'content': content }, 
        { 
          headers: { 'Authorization': document.cookie }, 
          observe: 'response', 
          responseType: 'json'
        }
      ).subscribe({
        next: (newPageResponse: HttpResponse<Page>) => {
          if (newPageResponse.body === null) {
            return reject('New page is null!');
          }
          return resolve(newPageResponse.body);
        },

        error: (err: HttpErrorResponse) => {
          return reject(err);
        }
      });
    })
  }

  public updatePage = (pageId: string, content: PageContent): Promise<Page> => {
    return new Promise((resolve, reject) => {
      const url = 'http://localhost:3000/pages/' + pageId + '/content';
      this.http.patch<Page>(
        url, { 'content': content },
        { 
          headers: { 'Authorization': document.cookie }, 
          observe: 'response', 
          responseType: 'json'
        }
      ).subscribe({
        next: (updatedPageResponse: HttpResponse<Page>) => {
          if (updatedPageResponse.body == null) {
            return reject('Updated page is null!');
          }
          return resolve(updatedPageResponse.body);
        },

        error: (err: HttpErrorResponse) => {
          return reject(err);
        }
      })
    });
  }

  public updateFreezePage = (pageId: string, freezePage: boolean): Promise<Page> => {
    return new Promise((resolve, reject) => {
      const url = 'http://localhost:3000/pages/' + pageId + '/freeze_page';
      this.http.patch<Page>(
        url, { 'freeze_page': freezePage },
        { 
          headers: { 'Authorization': document.cookie }, 
          observe: 'response', 
          responseType: 'json'
        }
      ).subscribe({
        next: (response: HttpResponse<Page>) => {
          if (response.body == null) {
            return reject('Frozen page is null!');
          }
          return resolve(response.body);
        },

        error: (err: HttpErrorResponse) => {
          return reject(err);
        }
      })
    });
  }

  public deletePage = (pageId: string): Promise<Page> => {
    return new Promise((resolve, reject) => {
      const url = 'http://localhost:3000/pages/' + pageId;
      this.http.delete<Page>(url,
        { 
          headers: { 'Authorization': document.cookie }, 
          observe: 'response', 
          responseType: 'json'
        }
      ).subscribe({
        next: (deletedPageResponse: HttpResponse<Page>) => {
          if (deletedPageResponse.body === null) {
            return reject('Updated page is null!');
          }
          return resolve(deletedPageResponse.body);
        },

        error: (err: HttpErrorResponse) => {
          return reject(err);
        }
      })
    });
  }
}
