import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { constants } from 'src/app/constants';
import { PageSearchResultView } from 'src/app/interfaces/page.interface';
import { PageEditService } from 'src/app/services/page-edit.service';
import { PageService } from 'src/app/services/page.service';
import { UserService } from 'src/app/services/user.service';

interface GetAllBasedPagination {
  (offset: number, limit: number): Promise<any[]>;
}

interface SearchBasedPagination {
  (offset: number, limit: number, searchString: string): Promise<any[]>;
}

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {
  @Input() paginationType!: string;

  @Output() adminDashboardDeletePageButtonClicked = new EventEmitter();
  @Output() adminDashboardDeleteUserButtonClicked = new EventEmitter();

  getPaginationEntries!: GetAllBasedPagination | SearchBasedPagination;
  previousPaginationEntries!: any[];
  currentPaginationEntries: any[] = [];
  nextPaginationEntries!: any[];
  offset = constants.PAGINATION_OFFSET_DEFAULT;
  limit = constants.PAGINATION_LIMIT_DEFAULT;
  isPaginationFirstPage: boolean = true;
  isPaginationLastPage: boolean = false;
  noResult: boolean = false;
  paginationLimits = constants.PAGINATION_LIMITS;

  searchBasedPaginations = ['search-pages', 'get-all-page-edits-of-page', 'get-all-page-edits-of-user'];

  // If paginationType is in searchBasedPaginations.
  searchString!: string;

  // If paginationType is 'get-all-page-edits-of-page' or 'get-all-page-edits-of-user'.
  latestVersions!: {[page_title: string]: number};

  constructor(private route: ActivatedRoute, 
              private pageService: PageService,
              private userService: UserService,
              private pageEditService: PageEditService) { }

  ngOnInit(): void {
    switch (this.paginationType) {
      case 'search-pages':
        this.getPaginationEntries = this.pageService.getPagesBasedOnSearchString;
        break;

      case 'get-all-pages':
        this.getPaginationEntries = this.pageService.getAllPages;
        break;

      case 'get-all-users':
        this.getPaginationEntries = this.userService.readAllUsers;
        break;

      case 'get-all-page-edits-of-page':
        this.getPaginationEntries = this.pageEditService.getAllPageEditsOfAPage;
        break;

      case 'get-all-page-edits-of-user':
        this.getPaginationEntries = this.pageEditService.getUserPageEdits;
        break;
    
      default:
        console.log('Error! Invalid paginationType value.');
        return;
    }

    if (this.searchBasedPaginations.includes(this.paginationType)) {
      this.performSearchBasedPagination();
    } else {
      this.goToFirstPage();
    } 
  }

  performSearchBasedPagination() {
    if (this.paginationType === 'search-pages') {
      this.route.queryParamMap.subscribe(queryParams => {
        const searchString = queryParams.get('search-string');
        if (searchString == null) {
          console.log('Search string is empty!');
          return;
        }
        this.searchString = searchString;
        this.goToFirstPage();
      });
    } else {
      this.route.paramMap.subscribe(params => {
        this.pageEditService.getLatestVersionOfEachPage()
          .then((latestVersions: {[page_title: string]: number}) => {
            this.latestVersions = latestVersions;
            const searchString = (this.paginationType === 'get-all-page-edits-of-page') ?
              params.get('title') : params.get('username');
            if (searchString == null) {
              console.log('Search string is empty!');
              return;
            }
            this.searchString = searchString;
            this.goToFirstPage();
          })
          .catch((err: HttpErrorResponse) => {
            console.log(err);
          })
      })
    }
  }

  goToFirstPage() {
    // Go to the top of the page.
    scroll(0, 0);

    this.offset = 0;
    this.isPaginationFirstPage = true;
    this.isPaginationLastPage = false;
    this.noResult = false;

    if (this.searchBasedPaginations.includes(this.paginationType)) {
      (<SearchBasedPagination>this.getPaginationEntries) (this.offset, this.limit, this.searchString)
        .then((currentPaginationEntries: any[]) => {
          this._getCurrentPaginationEntries(currentPaginationEntries);
          (<SearchBasedPagination>this.getPaginationEntries) (this.offset + this.limit, this.limit, this.searchString)
            .then((nextPaginationEntries: any[]) => {
              this._getNextPaginationEntries(nextPaginationEntries);
            })
            .catch(console.log);
        })
        .catch(console.log);
    } else {
      (<GetAllBasedPagination>this.getPaginationEntries) (this.offset, this.limit)
        .then((currentPaginationEntries: any[]) => {
          this._getCurrentPaginationEntries(currentPaginationEntries);
          (<GetAllBasedPagination>this.getPaginationEntries) (this.offset + this.limit, this.limit)
            .then((nextPaginationEntries: any[]) => {
              this._getNextPaginationEntries(nextPaginationEntries);
            })
            .catch(console.log);
        })
        .catch(console.log);
    }
  }

  goToNextPage() {
    if (this.isPaginationLastPage) {
      console.log('Error: Cannot go to next page!');
      return;
    }
    // Go to the top of the page.
    scroll(0, 0);

    this.isPaginationFirstPage = false;
    this.offset += this.limit;
    this.previousPaginationEntries = this.currentPaginationEntries;
    this.currentPaginationEntries = this.nextPaginationEntries;

    if (this.searchBasedPaginations.includes(this.paginationType)) {
      (<SearchBasedPagination>this.getPaginationEntries) (this.offset + this.limit, this.limit, this.searchString)
        .then((nextPages: any[]) => {
          if (nextPages.length === 0) {
            this.isPaginationLastPage = true;
          } else {
            this.nextPaginationEntries = nextPages;
            this.isPaginationLastPage = false;
          }
  
          // this._logComponentAttributes();
        })
        .catch(console.log);
    } else {
      (<GetAllBasedPagination>this.getPaginationEntries) (this.offset + this.limit, this.limit)
      .then((nextPages: any[]) => {
        if (nextPages.length === 0) {
          this.isPaginationLastPage = true;
        } else {
          this.nextPaginationEntries = nextPages;
          this.isPaginationLastPage = false;
        }

        // this._logComponentAttributes();
      })
      .catch(console.log);
    }
  }

  goToPreviousPage() {
    if (this.isPaginationFirstPage) {
      console.log('Error: Cannot go to previous page!');
      return;
    }
    // Go to the top of the page.
    scroll(0, 0);

    this.isPaginationLastPage = false;
    this.offset -= this.limit;
    this.nextPaginationEntries = this.currentPaginationEntries;
    this.currentPaginationEntries = this.previousPaginationEntries;
    if (this.offset === 0) {
      this.isPaginationFirstPage = true;
    } else {
      if (this.searchBasedPaginations.includes(this.paginationType)) {
        (<SearchBasedPagination>this.getPaginationEntries) (this.offset - this.limit, this.limit, this.searchString)
          .then((previousPages: any[]) => {
            this.previousPaginationEntries = previousPages;
            this.isPaginationFirstPage = false;

            // this._logComponentAttributes();
          })
          .catch(console.log);
      } else {
        (<GetAllBasedPagination>this.getPaginationEntries) (this.offset - this.limit, this.limit)
          .then((previousPages: any[]) => {
            this.previousPaginationEntries = previousPages;
            this.isPaginationFirstPage = false;

            // this._logComponentAttributes();
          })
          .catch(console.log);
      }
    }
  }

  changeLimit(newLimit: number) {
    this.limit = newLimit;
    this.goToFirstPage();
  }

  _getCurrentPaginationEntries(currentPaginationEntries: any[]) {
    if (currentPaginationEntries.length === 0) {
      this.noResult = true;
    }
    this.currentPaginationEntries = currentPaginationEntries;
  }

  _getNextPaginationEntries(nextPaginationEntries: PageSearchResultView[]) {
    if (nextPaginationEntries.length === 0) {
      this.isPaginationLastPage = true;
    } else {
      this.nextPaginationEntries = nextPaginationEntries;
    }

    // this._logComponentAttributes();
  }

  _logComponentAttributes() {
    console.log('Previous pagination entries: ', this.previousPaginationEntries);
    console.log('Current pagination entries: ', this.currentPaginationEntries);
    console.log('Next pagination entries: ', this.nextPaginationEntries);
    console.log('Offset: ', this.offset);
    console.log('Limit: ', this.limit);
    console.log('');
  }
}
