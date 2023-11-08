import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { OutputBlockData, OutputData } from '@editorjs/editorjs';
import { PageHTML } from 'src/app/classes/page-html.class';
import { Page } from 'src/app/interfaces/page.interface';
import { ObservablesService } from 'src/app/services/observables.service';
import { PageService } from 'src/app/services/page.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-page-view',
  templateUrl: './page-view.component.html',
  styleUrls: ['./page-view.component.css'],
})
export class PageViewComponent implements OnInit, OnDestroy {
  pageSafeHTML!: SafeHtml;
  pageTitle = '';
  freezePage = true;
  pageEditors: string[] = [];
  currentPageTitle!: string;

  showUpdateArticleChoiceModal = false;
  showUpdateFreezePageMessageModal = false;

  constructor( private route: ActivatedRoute,
               private router: Router,
               private pageService: PageService,
               private sanitizer: DomSanitizer,
               private titleService: Title,
               private socketService: SocketService,
               private observablesService: ObservablesService) {
    this._renderPageView()
      .then(async () => {
        try {
          this.titleService.setTitle(this.pageTitle);
          const pageEditors = await this.socketService.joinPageRoom(this.pageTitle);
          if (Object.keys(pageEditors).length) {
            this.pageEditors = Object.keys(pageEditors);
            this.pageEditors.sort(function (a, b) {
              return ('' + a).localeCompare(b);
            });
          }
          this.observablesService.pageEditor$.next(this.pageEditors);

          this.socketService.notifyReadersAboutPageUpdate.subscribe({
            next: (currentPageTitle: string) => {
              this.showUpdateArticleChoiceModal = true;
              this.currentPageTitle = currentPageTitle
            },
  
            error: (err) => {
              console.log(err);
            }
          });
  
          this.socketService.toggleEditArticleButtonVisibility.subscribe({
            next: (pageFrozen: boolean) => {
              this.freezePage = pageFrozen;
              this.observablesService.freezePage$.next(this.freezePage);
              if (this.freezePage) {
                this.showUpdateFreezePageMessageModal = true;
              }
            },
  
            error: (err) => {
              console.log(err);
            }
          });
  
          this.socketService.notifyReadersAboutPageDelete.subscribe({
            next: () => {
              this._pageDeletedAction();
            },
  
            error: (err) => {
              throw err;
            }
          });

          this.socketService.notifyReadersAboutPageEditors.subscribe({
            next: (pageEditors: {[username: string]: string}) => {
              console.log('pageEditors: ' + pageEditors);
              if (Object.keys(pageEditors).length) {
                this.pageEditors = Object.keys(pageEditors);
                this.pageEditors.sort(function (a, b) {
                  return ('' + a).localeCompare(b);
                });
              } else {
                this.pageEditors = [];
              }
              console.log(this.pageEditors);
              this.observablesService.pageEditor$.next(this.pageEditors);
            },

            error: (err) => {
              throw err;
            }
          })
        } catch (error) {
          throw error;
        }
      })
      .catch((err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.router.navigateByUrl('/404?resource=article');
        } else {
          window.alert(
            `${err.error.message}\n\nYou will be redirected back to the main page.`
          );
          this.router.navigateByUrl('/');
        }
      });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.pageTitle) {
      this.socketService.exitPageRoom(this.pageTitle);
    }
  }

  _renderPageView(): Promise<null> {
    return new Promise((resolve, reject) => {
      this.route.paramMap.subscribe((params) => {
        const pageTitle = params.get('title');
        if (pageTitle == null) {
          console.log('Error: pageTitle is null.');
          return;
        }
        this.pageTitle = pageTitle;
        this.pageService
          .getPageByTitle(pageTitle)
          .then((page: Page) => {
            this.freezePage = page.freeze_page;
            this.observablesService.freezePage$.next(this.freezePage);
            // Convert pageContent to its HTML format.
            const pageImageUrl = page.content.image_url;
            const pageLeadData: OutputBlockData<string, any>[] = (
              JSON.parse(page.content.lead) as OutputData
            ).blocks;
            const pageBodyData: OutputBlockData<string, any>[] = (
              JSON.parse(page.content.body) as OutputData
            ).blocks;

            const pageHTML = new PageHTML(
              pageTitle,
              pageImageUrl,
              pageLeadData,
              pageBodyData
            );
            this.pageSafeHTML = this.sanitizer.bypassSecurityTrustHtml(
              pageHTML.getHTMLRepresentation()
            );
            return resolve(null);
          })
          .catch((error) => {
            return reject(error);
          });
      });
    });
  }

  _loadUpdatedView() {
    if (this.currentPageTitle === this.pageTitle) {
      location.reload();
    } else {
      this.router
        .navigateByUrl('/wiki/' + this.currentPageTitle)
        .then((navigated) => {
          if (navigated) {
            location.reload();
          } else {
            console.log('Error: failed to navigate to updated page.');
          }
        })
        .catch(console.log);
    }
  }

  _pageDeletedAction() {
    this.router.navigateByUrl('/?msg-type=page-deleted')
      .then(navigated => {
        if (!navigated) {
          console.log('Error: Failed to go home.');
        }
      })
      .catch(console.log);
  }
}
