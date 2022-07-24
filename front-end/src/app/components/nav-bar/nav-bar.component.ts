import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ObservablesService } from 'src/app/services/observables.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
  @Input() pageType = 'Article';
  @Input() currentRoute!: string;
  @Input() currentUser?: string;
  @Input() currentUsername?: string;
  @Input() currentRole?: string;
  @Input() currentCanEdit?: boolean;
  @Input() freezePage?: boolean;
  @Input() loggedIn = false;
  @Input() viewingArticle = false;
  @Output() onLogout = new EventEmitter();

  hideArticleEditButton = true;
  pageEditors: string[] = [];
  showLogoutModal = false;

  constructor(
    private router: Router,
    private observablesService: ObservablesService
  ) {}

  ngOnInit(): void {
    this.observablesService.pageEditor$.subscribe({
      next: (pageEditors: string[]) => {
        this.pageEditors = pageEditors;
      },

      error: (err) => {
        console.log(err);
      },
    });
  }

  logOut() {
    this.onLogout.emit();
  }

  performSearch() {
    const searchString = (<HTMLInputElement>(
      document.getElementById('search-bar')
    )).value;
    this.router.navigateByUrl('/wiki/search?search-string=' + searchString);
  }
}
