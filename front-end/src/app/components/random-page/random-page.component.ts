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
    this.pageService.getAllPageId()
      .then((allPageId: string[]) => {
        const pickRandomElement = (arr: any[]) => {
          return arr[Math.floor(Math.random()*arr.length)]
        };

        const randomPageId = pickRandomElement(allPageId);
        this.router.navigateByUrl('/wiki/' + randomPageId)
          .then(navigated => {
            if (!navigated) {
              console.log('Failed to go to the random page.');
            }
          })
          .catch(console.log);
      })
      .catch(console.log);
  }

}
