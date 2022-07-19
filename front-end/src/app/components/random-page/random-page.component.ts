import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageService } from 'src/app/services/page.service';

@Component({
  selector: 'app-random-page',
  templateUrl: './random-page.component.html',
  styleUrls: ['./random-page.component.css']
})
export class RandomPageComponent implements OnInit {

  constructor(private router: Router, private pageService: PageService) { }

  ngOnInit(): void {
    this.pageService.getAllPageTitles()
      .then((allPageTitles: string[]) => {
        if (!allPageTitles.length) {
          throw new HttpErrorResponse({ status: 404 });
        }
        const pickRandomElement = (arr: any[]) => {
          return arr[Math.floor(Math.random()*arr.length)]
        };

        const randomPageTitle = pickRandomElement(allPageTitles);
        this.router.navigateByUrl('/wiki/' + randomPageTitle)
          .then(navigated => {
            if (!navigated) {
              console.log('Failed to go to the random page.');
            }
          })
          .catch(console.log);
      })
      .catch(err => {
        if (err.status === 404) {
          this.router.navigateByUrl('/404?resource=articles');
        } else {
          window.alert(
            `${err.error.message}\n\nYou will be redirected back to the main page.`
          );
          this.router.navigateByUrl('/');
        }
      });
  }

}
