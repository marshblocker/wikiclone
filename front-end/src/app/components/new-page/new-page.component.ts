// TODO: Handle scenarios where required fields are not given. 

import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { PageEditor } from 'src/app/classes/page-editor.class';
import { PageHTML } from '../../classes/page-html.class';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styleUrls: ['./new-page.component.css']
})
export class NewPageComponent implements OnInit {
  newPageTitle!: string;
  newPageImageUrl?: string;

  newPagePreviewHTML!: PageHTML;
  newPagePreviewSafeHTML!: SafeHtml;

  pageEditor = new PageEditor('new-page-lead-editor', 'new-page-body-editor');

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
  }

  updatePage() {}

  async updatePagePreview() {
    try {
      await this.pageEditor.updatePageEditorDataContainers();
      this.newPagePreviewHTML = new PageHTML(
        this.newPageTitle, this.pageEditor.pageLeadEditorData, 
        this.newPageImageUrl, this.pageEditor.pageBodyEditorData
      );
  
      this.newPagePreviewSafeHTML = this.sanitizer.bypassSecurityTrustHtml(
        this.newPagePreviewHTML.getHTMLRepresentation()
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
