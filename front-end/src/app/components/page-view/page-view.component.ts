import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { OutputBlockData, OutputData } from '@editorjs/editorjs';
import { PageHTML } from 'src/app/classes/page-html.class';
import { PageContent } from 'src/app/interfaces/page.interface';
import { PageService } from 'src/app/services/page.service';

@Component({
  selector: 'app-page-view',
  templateUrl: './page-view.component.html',
  styleUrls: ['./page-view.component.css']
})
export class PageViewComponent implements OnInit {
  pageSafeHTML!: SafeHtml;
  pageTitle!: string;

  constructor(private route: ActivatedRoute, 
              private router: Router, 
              private pageService: PageService, 
              private sanitizer: DomSanitizer,
              private titleService: Title) { }

  ngOnInit(): void {
    this._renderPageView()
      .then(() => {
        // Change page title.
        this.titleService.setTitle(this.pageTitle);
      })
      .catch(err => {
        console.log(err);
        this.router.navigateByUrl('/404');
      })
  }

  _renderPageView(): Promise<null> {
    return new Promise((resolve, reject) => {
      this.route.paramMap.subscribe(params => {
        const pageId = params.get('page_id');
        if (typeof pageId !== 'string') {
          console.log('Error: pageId is null.');
          return;
        }
        this.pageService.getPageContent(pageId)
          .then((pageContent: PageContent) => {
            // Convert pageContent to its HTML format.
            this.pageTitle = pageContent.title;
            const pageImageUrl = pageContent.image_url;
            const pageLeadData: OutputBlockData<string, any>[] = 
              (JSON.parse(pageContent.lead) as OutputData).blocks;
            const pageBodyData: OutputBlockData<string, any>[] = 
              (JSON.parse(pageContent.body) as OutputData).blocks;
  
            const pageHTML = new PageHTML(this.pageTitle, pageImageUrl, pageLeadData, pageBodyData);
            this.pageSafeHTML = this.sanitizer.bypassSecurityTrustHtml(
              pageHTML.getHTMLRepresentation()
            );
            return resolve(null);
          })
          .catch(error => {
            return reject(error);
          });
      });
    })

  }
}
