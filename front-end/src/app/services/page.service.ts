import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { PageContent, Page } from '../interfaces/page.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  constructor(private http: HttpClient) { }

  public getPageContent(pageId: string): Promise<PageContent> {
    return new Promise((resolve, reject) => {
      const url = 'http://localhost:3000/pages/' + pageId;
      this.http.get<Page>(
        url, { observe: 'response', responseType: 'json' }
      ).subscribe((pageResponse: HttpResponse<Page>) => {
        console.log(pageResponse);
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
        url, { observe: 'response', responseType: 'json' }
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
      (this.http.post<Page>(url, { 'content': content }, 
        {observe: 'response', responseType: 'json'}) as Observable<HttpResponse<Page>>)
        .subscribe((newPageResponse: HttpResponse<Page>) => {
          if (newPageResponse.body === null) {
            return reject('New page is null!');
          }
          return resolve(newPageResponse.body.page_id);
        });
    })
  }
}
