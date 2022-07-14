import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-resource-not-found',
  templateUrl: './resource-not-found.component.html',
  styleUrls: ['./resource-not-found.component.css']
})
export class ResourceNotFoundComponent implements OnInit {
  message = 'Uh-oh! Resource not found.'

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(queryParams => {
      const missingResourceType = queryParams.get('resource');
      switch (missingResourceType) {
        case 'article':
          this.message = `Uh-oh! Article not found. Reasons could be: it was deleted, its title was changed, 
                          or no article with such name exists in the database.
                          `;
          break;

        case 'user':
          this.message = `Uh-oh! User not found. Reasons could be: the user was deleted, its username was changed,
                          or no user with such name exists in the database.
                          `;
          break;

        case 'article-edit':
          this.message = `Uh-oh! Article edit not found. Make sure that its version number is less than the version 
                          number of the latest version of the article.
                          `;
          break;
      
        default:
          console.log('Invalid missing resource type!');
          return;
      }
    })
  }

}
