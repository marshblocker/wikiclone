import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { OutputData } from '@editorjs/editorjs';
import { PageEditor } from 'src/app/classes/page-editor.class';
import { PageHTML } from 'src/app/classes/page-html.class';
import { PageEdit } from 'src/app/interfaces/page-edit.interface';
import { Page, PageContent } from 'src/app/interfaces/page.interface';
import { PageEditService } from 'src/app/services/page-edit.service';
import { PageService } from 'src/app/services/page.service';
import { SocketService } from 'src/app/services/socket.service';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-existing-page-editor',
  templateUrl: './existing-page-editor.component.html',
  styleUrls: ['./existing-page-editor.component.css']
})
export class ExistingPageEditorComponent implements OnInit {
  pageEditor!: PageEditor;
  initialPageTitle!: string | null;
  pageTitle!: string | null;
  pageId!: string;
  pageImageUrl!: string;
  pagePreviewSafeHTML!: SafeHtml;

  userRole!: string;
  
  pageFrozen!: boolean;
  pageDeleted = false;

  // TODO: Combine existing-page-editor and new-page-editor. 
  constructor(private route: ActivatedRoute, 
              private router: Router, 
              private pageService: PageService, 
              private sanitizer: DomSanitizer,
              private tokenService: TokenService,
              private pageEditService: PageEditService,
              private userService: UserService,
              private socketService: SocketService) {
    if (!this.tokenService.tokenInCookie()) {
      this.router.navigateByUrl('/token_expired');
      return;
    }
    this.route.paramMap.subscribe(params => {
      this.initialPageTitle = params.get('title');
      this.pageTitle = params.get('title');
      if (this.pageTitle === null) {
        console.log('Error: pageTitle is null.');
        return;
      }
      this.pageService.getPageByTitle(this.pageTitle)
        // Fill page editor with the initial content of the article.
        .then((page: Page) => {
          this.pageImageUrl = page.content.image_url;
          this.pageId = page.page_id;
          this.pageFrozen = page.freeze_page;
          const pageLeadData: OutputData = JSON.parse(page.content.lead) as OutputData;
          const pageBodyData: OutputData = JSON.parse(page.content.body) as OutputData;

          this.pageEditor = new PageEditor('page-lead-editor', 'page-body-editor', pageLeadData, pageBodyData);
          this.userService.readCurrentUser()
            .then(userInfo => {
              this.userRole = userInfo.role;
            })
            .catch(console.log);
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
      title: this.pageTitle as string,
      image_url: this.pageImageUrl,
      lead: leadData,
      body: bodyData
    };

    this.pageService.updatePage(this.pageId, content)
      .then((updatedPage: Page) => {
        updatedPage.timestamp = updatedPage.timestamp
          .replace('T', ' ')
          .split('.')[0];
        const editSummary = (<HTMLInputElement>document.getElementById('edit-summary-input')).value;
        this.pageEditService.submitNewPageEdit(updatedPage, editSummary)
          .then((newPageEdit: PageEdit) => {
            if (this.initialPageTitle === null || this.pageTitle === null) {
              console.log('Error: pageTitle or initialPageTitle is null.')
              return;
            }          
            this.socketService.finishedPageUpdate(this.initialPageTitle, this.pageTitle);
            this._goBackToPageView(true); 
          })
          .catch(console.log);
      })
      .catch(console.log);
  }

  cancelUpdate() {
    const proceed = window.confirm('Cancel edit?');
    if (!proceed) {
      return;
    }
    this._goBackToPageView(false);
  }

  async freezePage() {
    const proceed = window.confirm('Do you really want to freeze this article? This will prevent non-admin users from editing this article.');
    if (!proceed) {
      return;
    }
    this.pageService.updateFreezePage(this.pageId, !this.pageFrozen)
      .then(() => {
        this.pageFrozen = !this.pageFrozen;

        if (this.initialPageTitle === null) {
          console.log('Error: initialPageTitle is null.');
          return;
        }
        
        this.socketService.finishedFreezePageUpdate(this.initialPageTitle, this.pageFrozen);
        this.router.navigateByUrl('/wiki/' + this.initialPageTitle);
      })
      .catch(console.log);
  }

  async deletePage() {
    const proceed = window.confirm('Do you really want to delete this page?');
    if (!proceed) {
      return;
    }
    this.pageService.deletePage(this.pageId)
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
        this.pageTitle as string, this.pageImageUrl,
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

  _goBackToPageView(afterUpdate: boolean) {
    const title = afterUpdate ? this.pageTitle : this.initialPageTitle;
    this.router.navigateByUrl('/wiki/' + title)
      .then(navigated => {
        if (!navigated) {
          console.log('Failed to go to the updated page.');
        }
      })
      .catch(console.log);
  }

}
