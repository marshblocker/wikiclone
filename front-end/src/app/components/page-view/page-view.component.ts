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
          console.log(this.pageEditors);
          this.observablesService.pageEditor$.next(this.pageEditors);

          this.socketService.notifyReadersAboutPageUpdate.subscribe({
            next: (currentPageTitle: string) => {
              this._loadUpdatedView(currentPageTitle);
            },
  
            error: (err) => {
              console.log(err);
            }
          });
  
          this.socketService.toggleEditArticleButtonVisibility.subscribe({
            next: (pageFrozen: boolean) => {
              this.freezePage = pageFrozen;
              this.observablesService.freezePage$.next(this.freezePage);
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

  _loadUpdatedView(currentPageTitle: string) {
    console.log('Just updated!');
    if (currentPageTitle === this.pageTitle) {
      location.reload();
    } else {
      this.router
        .navigateByUrl('/wiki/' + currentPageTitle)
        .then((navigated) => {
          if (navigated) {
            location.reload();
          } else {
            console.log('Error: failed to navigate to updated page.');
          }
        })
        .catch(console.log);
    }
    // const confirm = window.confirm(
    //   'This page has just been updated. Do you want to view its latest version?'
    // );
    // if (confirm) {
    //   this.router.navigateByUrl('/wiki/' + currentPageTitle);
    // }
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
