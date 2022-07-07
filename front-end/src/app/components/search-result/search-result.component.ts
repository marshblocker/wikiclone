import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageSearchResultView } from 'src/app/interfaces/page.interface';
import { PageService } from 'src/app/services/page.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {
  pages!: PageSearchResultView[];

  constructor(private route: ActivatedRoute, private pageService: PageService) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(queryParams => {
      const searchString = queryParams.get('search-string');
      if (searchString == null) {
        console.log('Search string is empty!');
        return;
      }
      this.pageService.getPagesBasedOnSearchString(searchString)
        .then((pages: PageSearchResultView[]) => {
          this.pages = pages;
          console.log(pages);
        })
    })
  }
}
