import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  @Input() pageType = 'Article';
  @Input() currentRoute!: string;
  @Input() currentUser?: string;
  @Input() loggedIn = false;
  @Input() viewingArticle = false;
  @Output() onLogout = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  logOut() {
    this.onLogout.emit();
  }

}
