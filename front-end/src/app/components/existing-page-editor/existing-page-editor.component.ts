import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { OutputData } from '@editorjs/editorjs';
import { PageEditor } from 'src/app/classes/page-editor.class';
import { PageHTML } from 'src/app/classes/page-html.class';
import { Page, PageContent } from 'src/app/interfaces/page.interface';
import { PageService } from 'src/app/services/page.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-existing-page-editor',
  templateUrl: './existing-page-editor.component.html',
  styleUrls: ['./existing-page-editor.component.css']
})
export class ExistingPageEditorComponent implements OnInit {
  pageId!: string | null;
  pageEditor!: PageEditor;
  pageTitle!: string;
  pageImageUrl!: string;
  pagePreviewSafeHTML!: SafeHtml;
  
  pageDeleted = false;

  constructor(private route: ActivatedRoute, 
              private router: Router, 
              private pageService: PageService, 
              private sanitizer: DomSanitizer,
              private tokenService: TokenService) {
    if (!this.tokenService.tokenInCookie()) {
      this.router.navigateByUrl('/token_expired');
      return;
    }
    this.route.paramMap.subscribe(params => {
      this.pageId = params.get('page_id');
      if (this.pageId === null) {
        console.log('Error: pageId is null.');
        return;
      }
      this.pageService.getPageContent(this.pageId)
        // Fill page editor with the initial content of the article.
        .then((pageContent: PageContent) => {
          this.pageTitle = pageContent.title;
          this.pageImageUrl = pageContent.image_url;
          const pageLeadData: OutputData = JSON.parse(pageContent.lead) as OutputData;
          const pageBodyData: OutputData = JSON.parse(pageContent.body) as OutputData;

          this.pageEditor = new PageEditor('page-lead-editor', 'page-body-editor', pageLeadData, pageBodyData);
        })
    });
  }

  ngOnInit(): void {
  }

  async updatePage() {
    const proceed = window.confirm('Update article?');
    if (!proceed) {
      return;
    }
    await this.pageEditor.updatePageEditorDataContainers();
    const leadData: string = JSON.stringify(this.pageEditor.pageLeadEditorData);
    const bodyData: string = JSON.stringify(this.pageEditor.pageBodyEditorData);
    const content: PageContent = {
      title: this.pageTitle,
      image_url: this.pageImageUrl,
      lead: leadData,
      body: bodyData
    };

    this.pageService.updatePage(this.pageId as string, content)
      .then(() => { this._goBackToPageView(); })
      .catch(console.log);
  }

  cancelUpdate() {
    const proceed = window.confirm('Cancel edit?');
    if (!proceed) {
      return;
    }
    this._goBackToPageView();
  }

  async deletePage() {
    const proceed = window.confirm('Do you really want to delete this page?');
    if (!proceed) {
      return;
    }
    this.pageService.deletePage(this.pageId as string)
      .then((deletedPage: Page) => {
        console.log(deletedPage);
        this.pageDeleted = true;
        this.router.navigateByUrl('/');
      })
      .catch(console.log);
  }

  async updatePagePreview() {
    try {
      await this.pageEditor.updatePageEditorDataContainers();
      const pageLeadData = (this.pageEditor.pageLeadEditorData as OutputData).blocks;
      const pageBodyData = (this.pageEditor.pageBodyEditorData as OutputData).blocks;
      const pagePreviewHTML = new PageHTML(
        this.pageTitle, this.pageImageUrl,
        pageLeadData, pageBodyData
      );
  
      this.pagePreviewSafeHTML = this.sanitizer.bypassSecurityTrustHtml(
        pagePreviewHTML.getHTMLRepresentation()
      );
    } catch (error) {
      console.log(error);
    }
  }

  getTitle(inputEvent: Event) {
    this.pageTitle = (<HTMLInputElement>inputEvent.target).value as string;
  }

  getImageUrl(inputEvent: Event) {
    this.pageImageUrl = (<HTMLInputElement>inputEvent.target).value as string;
  }

  _goBackToPageView() {
    this.router.navigateByUrl('/wiki/' + this.pageId)
      .then(navigated => {
        if (!navigated) {
          console.log('Failed to go to the updated page.');
        }
        console.log('yo');
      })
      .catch(console.log);
  }

}
