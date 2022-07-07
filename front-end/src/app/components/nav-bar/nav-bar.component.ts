import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  @Input() pageType = 'Article';
  @Input() currentRoute!: string;
  @Input() currentUser?: string;
  @Input() currentUserId?: string;
  @Input() loggedIn = false;
  @Input() viewingArticle = false;
  @Output() onLogout = new EventEmitter();

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
