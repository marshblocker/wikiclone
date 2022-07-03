import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  @Input() pageType = 'Article';
  @Input() currentRoute!: string;

  constructor() { }

  ngOnInit(): void {
  }

}
