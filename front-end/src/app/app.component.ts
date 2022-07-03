import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'front-end';
  pageType = 'Article'; // This is passed to the navBar.
  currentRoute!: string;

  constructor(private router: Router, private location: Location) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      // From https://stackoverflow.com/a/46305085/17927002
      if (event instanceof RoutesRecognized) {
        let data = event.state.root.firstChild?.data;
        if (data === undefined) {
          console.log('Error: Undefined custom data!');
          return;
        }
        this.pageType = data['pageType'];
      }
      if(this.location.path() != ''){
        this.currentRoute = this.location.path();
      } else {
        this.currentRoute = '/';
      }
    })
  }
}
