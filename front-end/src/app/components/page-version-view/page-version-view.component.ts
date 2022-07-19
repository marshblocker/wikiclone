import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { OutputBlockData, OutputData } from '@editorjs/editorjs';
import { PageHTML } from 'src/app/classes/page-html.class';
import { PageEdit } from 'src/app/interfaces/page-edit.interface';
import { Page } from 'src/app/interfaces/page.interface';
import { FreezePageService } from 'src/app/services/freeze-page.service';
import { PageEditService } from 'src/app/services/page-edit.service';
import { PageService } from 'src/app/services/page.service';
import { SocketService } from 'src/app/services/socket.service';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-page-version-view',
  templateUrl: './page-version-view.component.html',
  styleUrls: ['./page-version-view.component.css'],
})
export class PageVersionViewComponent implements OnInit {
  pageSafeHTML!: SafeHtml;
  pageVersionTitle!: string;
  pageCurrentTitle!: string;
  pageId?: string;
  pageVersion?: number;
  pageEdit!: PageEdit;
  freezePage!: boolean;
  renderReady = false;
  viewerIsLoggedIn = false;

  canEdit = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pageEditService: PageEditService,
    private sanitizer: DomSanitizer,
    private titleService: Title,
    private pageService: PageService,
    private userService: UserService,
    private tokenService: TokenService,
    private socketService: SocketService,
    private freezePageService: FreezePageService
  ) {}

  ngOnInit(): void {
    this._renderPageView()
      .then(() => {
        this.titleService.setTitle(this.pageVersionTitle);
        this.socketService.joinPageRoom(this.pageCurrentTitle);
        this.viewerIsLoggedIn = this.tokenService.tokenInCookie();

        this.socketService.toggleEditArticleButtonVisibility.subscribe({
          next: (pageFrozen: boolean) => {
            this.freezePage = pageFrozen;
            this.freezePageService.freezePage$.next(this.freezePage);
          },

          error: (err) => {
            console.log(err);
            return;
          }
        })

        this.socketService.notifyReadersAboutPageDelete.subscribe({
          next: () => {
            this._pageDeletedAction();
          },

          error: (err) => {
            console.log(err);
          }
        })

        if (this.viewerIsLoggedIn) {
          this.userService
            .readCurrentUser()
            .then((currentUserInfo) => {
              this.canEdit = currentUserInfo.can_edit;
              this.renderReady = true;
            })
            .catch(console.log);
        } else {
          this.renderReady = true;
        }
      })
      .catch((err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.router.navigateByUrl('/404?resource=article-edit');
        } else {
          window.alert(
            `${err.error.message}\n\nYou will be redirected back to the main page.`
          );
          this.router.navigateByUrl('/');
        }
      });
  }

  _renderPageView(): Promise<null> {
    return new Promise((resolve, reject) => {
      this.route.paramMap.subscribe((params) => {
        const pageCurrentTitle = params.get('title');
        const pageVersion = params.get('page_version');
        if (pageCurrentTitle === null) {
          console.log('pageTitle is null.');
          return;
        }
        if (pageVersion === null) {
          console.log('pageVersion is null.');
          return;
        }

        this.pageCurrentTitle = pageCurrentTitle;
        this.pageVersion = +pageVersion;

        this.pageEditService
          .getPageEditByPageTitleAndPageVersion(pageCurrentTitle, pageVersion)
          .then((pageEdit: PageEdit) => {
            this.pageId = pageEdit.page_id;
            this.pageEdit = pageEdit;
            this.pageEditService
              .getLatestVersionOfEachPage()
              .then((latestVersions) => {
                const latestVersion = latestVersions[this.pageCurrentTitle];
                // Convert pageContent to its HTML format.
                this.pageVersionTitle = pageEdit.content.title;
                const pageVersionTitleRepr =
                  this.pageVersionTitle +
                  ` (version ${this.pageVersion} of ${latestVersion} of the article '${this.pageCurrentTitle}')`;

                const pageImageUrl = pageEdit.content.image_url;
                const pageLeadData: OutputBlockData<string, any>[] = (
                  JSON.parse(pageEdit.content.lead) as OutputData
                ).blocks;
                const pageBodyData: OutputBlockData<string, any>[] = (
                  JSON.parse(pageEdit.content.body) as OutputData
                ).blocks;

                const pageHTML = new PageHTML(
                  pageVersionTitleRepr,
                  pageImageUrl,
                  pageLeadData,
                  pageBodyData
                );
                this.pageSafeHTML = this.sanitizer.bypassSecurityTrustHtml(
                  pageHTML.getHTMLRepresentation()
                );
                console.log(this.pageSafeHTML);

                this.pageService.getPageByTitle(this.pageCurrentTitle)
                  .then(page => {
                    this.freezePage = page.freeze_page;
                    return resolve(null);
                  })
                  .catch((error) => {
                    return reject(error);
                  });
              })
          })
          .catch((error) => {
            return reject(error);
          });
      });
    });
  }

  setThisVersionAsCurrentVersion() {
    const content = this.pageEdit.content;
    const proceed = window.confirm('Restore article to this version?');
    if (!proceed) {
      return;
    }

    this.pageService
      .updatePage(this.pageId as string, content)
      .then((updatedPage: Page) => {
        updatedPage.timestamp = updatedPage.timestamp
          .replace('T', ' ')
          .split('.')[0];
        this.pageCurrentTitle = updatedPage.content.title;
        const editSummary =
          'Return article back to version ' + this.pageVersion + '.';
        this.pageEditService
          .submitNewPageEdit(updatedPage, editSummary)
          .then((newPageEdit: PageEdit) => {
            console.log(newPageEdit);
            this._goBackToPageView();
          })
          .catch(console.log);
      })
      .catch(console.log);
  }

  _goBackToPageView() {
    this.router
      .navigateByUrl('/wiki/' + this.pageCurrentTitle)
      .then((navigated) => {
        if (!navigated) {
          console.log('Failed to go to the updated page.');
        }
      })
      .catch(console.log);
  }

  _pageDeletedAction() {
    this.router.navigateByUrl('/')
      .then(navigated => {
        if (navigated) {
          console.log('Page has been deleted. You are redirected back to the home page.');
        } else {
          console.log('Error: Failed to go home.');
        }
      })
      .catch(console.log);
  }
}
