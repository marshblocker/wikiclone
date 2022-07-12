import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UserPublic } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
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

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  logOut() {
    this.onLogout.emit();
  }

  performSearch() {
    const searchString = (<HTMLInputElement>document.getElementById('search-bar')).value;
    this.router.navigateByUrl('/wiki/search?search-string=' + searchString);
  }

  

}
