import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-page-version-list',
  templateUrl: './page-version-list.component.html',
  styleUrls: ['./page-version-list.component.css']
})
export class PageVersionListComponent implements OnInit {
  paginationType = 'get-all-page-edits-of-page';
  pageTitle!: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const pageTitle = params.get('title');
      if (pageTitle == null) {
        console.log('Failed to get pageTitle.');
        return;
      }
      this.pageTitle = pageTitle;
    })
  }
}
