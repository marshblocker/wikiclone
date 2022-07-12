import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageEdit } from 'src/app/interfaces/page-edit.interface';
import { PageEditService } from 'src/app/services/page-edit.service';

@Component({
  selector: 'app-page-version-list',
  templateUrl: './page-version-list.component.html',
  styleUrls: ['./page-version-list.component.css']
})
export class PageVersionListComponent implements OnInit {
  pageEdits?: PageEdit[];
  pageTitle!: string;
  latestVersion!: number;
  renderReady = false;

  constructor(private route: ActivatedRoute, private pageEditService: PageEditService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const pageTitle = params.get('title');
      if (pageTitle == null) {
        console.log('Failed to get pageTitle.');
        return;
      }
      this.pageTitle = pageTitle;
      this.pageEditService.getAllPageEditsOfAPage(pageTitle)
        .then((pageEdits: PageEdit[]) => {
          this.pageEdits = pageEdits;
          this.renderReady = true;
        })
    })
  }


}
