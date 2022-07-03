// TODO: Handle scenarios where required fields are not given. 
// TODO: Handle scenario where the provided OutputData to database is wrong.

import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { OutputData } from '@editorjs/editorjs';

import { PageEditor } from 'src/app/classes/page-editor.class';
import { PageContent } from 'src/app/interfaces/page.interface';
import { PageService } from 'src/app/services/page.service';
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

  constructor(private pageService: PageService, private sanitizer: DomSanitizer, private router: Router) {}

  ngOnInit(): void {
    this.newPageTitle = (<HTMLInputElement>document.getElementById('new-page-title')).value;
    this.newPageImageUrl = (<HTMLInputElement>document.getElementById('new-page-image-url')).value;
  }

  async submitNewPage() {
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
      .then(pageId => {
        this.router.navigateByUrl('/wiki/' + pageId)
          .then(navigated => {
            if (!navigated) {
              console.log('Failed to go to the newly-created page.');
            }
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

  getTitle(inputEvent: Event) {
    this.newPageTitle = (<HTMLInputElement>inputEvent.target).value as string;
  }

  getImageUrl(inputEvent: Event) {
    this.newPageImageUrl = (<HTMLInputElement>inputEvent.target).value as string;
  }
}
