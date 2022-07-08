import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageEdit } from '../interfaces/page-edit.interface';
import { Page } from '../interfaces/page.interface';

@Injectable({
  providedIn: 'root'
})
export class PageEditService {

  constructor(private http: HttpClient) { }

  submitNewPageEdit(page: Page, editSummary: string): Promise<PageEdit> {
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
    })
  }
}