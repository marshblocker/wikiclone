// TODO: Handle scenarios where required fields are not given. 
// TODO: Handle scenario where the provided OutputData to database is wrong.

import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { OutputData } from '@editorjs/editorjs';

import { PageEditor } from 'src/app/classes/page-editor.class';
import { PageEdit } from 'src/app/interfaces/page-edit.interface';
import { Page, PageContent } from 'src/app/interfaces/page.interface';
import { PageEditService } from 'src/app/services/page-edit.service';
import { PageService } from 'src/app/services/page.service';
import { TokenService } from 'src/app/services/token.service';
import { PageHTML } from '../../classes/page-html.class';

@Component({
  selector: 'app-new-page-editor',
  templateUrl: './new-page-editor.component.html',
  styleUrls: ['./new-page-editor.component.css']
})
export class NewPageEditorComponent implements OnInit {
  newPageTitle!: string;
  newPageImageUrl!: string;

  newPagePreviewSafeHTML!: SafeHtml;

  pageEditor = new PageEditor('new-page-lead-editor', 'new-page-body-editor');

  constructor(private pageService: PageService, 
              private sanitizer: DomSanitizer, 
              private router: Router,
              private tokenService: TokenService,
              private pageEditService: PageEditService) {}

  ngOnInit(): void {
    if (!this.tokenService.tokenInCookie()) {
      this.router.navigateByUrl('/token_expired');
      return;
    }
    this.newPageTitle = (<HTMLInputElement>document.getElementById('new-page-title')).value;
    this.newPageImageUrl = (<HTMLInputElement>document.getElementById('new-page-image-url')).value;
  }

  async submitNewPage() {
    const proceed = window.confirm('Post new article?');
    if (!proceed) {
      return;
    }
    await this.pageEditor.updatePageEditorDataContainers();
    const leadData: string = JSON.stringify(this.pageEditor.pageLeadEditorData);
    const bodyData: string = JSON.stringify(this.pageEditor.pageBodyEditorData);
    const content: PageContent = {
      title: this.newPageTitle,
      image_url: this.newPageImageUrl,
      lead: leadData,
      body: bodyData
    };

    this.pageService.submitNewPage(content)
      .then((newPage: Page) => {
        const editSummary = 'First article edit.';
        newPage.timestamp = newPage.timestamp
          .replace('T', ' ')
          .split('.')[0];
        this.pageEditService.submitNewPageEdit(newPage, editSummary)
          .then(() => {
            this.router.navigateByUrl('/wiki/' + newPage.content.title)
              .then(navigated => {
                if (!navigated) {
                  console.log('Failed to go to the newly-created page.');
                }
              })
              .catch(console.log);
          })
          .catch(console.log);
      })
      .catch(console.log);
  }

  async updatePagePreview() {
    try {
      await this.pageEditor.updatePageEditorDataContainers();
      const pageLeadData = (this.pageEditor.pageLeadEditorData as OutputData).blocks;
      const pageBodyData = (this.pageEditor.pageBodyEditorData as OutputData).blocks;
      const newPagePreviewHTML = new PageHTML(
        this.newPageTitle, this.newPageImageUrl,
        pageLeadData, pageBodyData
      );
  
      this.newPagePreviewSafeHTML = this.sanitizer.bypassSecurityTrustHtml(
        newPagePreviewHTML.getHTMLRepresentation()
      );
    } catch (error) {
      console.log(error);
    }
  }

  cancelSubmission() {
    const proceed = window.confirm('Are you sure you want to cancel your new article?');
    if (!proceed) {
      return;
    }
    this.router.navigateByUrl('/');
  }

  getTitle(inputEvent: Event) {
    this.newPageTitle = (<HTMLInputElement>inputEvent.target).value as string;
  }

  getImageUrl(inputEvent: Event) {
    this.newPageImageUrl = (<HTMLInputElement>inputEvent.target).value as string;
  }
}
