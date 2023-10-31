# Wikiclone

A Wikipedia clone.

![Front image showing an article](images/front.png)

## Features

### Create Article

![Image showing creating of article](images/create-article.png)

### Edit Article

![Image showing editing of article](images/edit-article.png)

### View Article Edit History

![Image showing viewing of article edit history](images/view-article-edit-history.png)

### Search Article

![Image showing searching for an article](images/search-article.png)

### View User Profile and Page Contributions

![Image showing viewing of user profile and page contributions](images/view-user-profile.png)

### Admin Dashboard

![Image showing admin dashboard](images/admin-dashboard.png)

## How to Build

This application requires Docker and Node.

```
> git clone https://github.com/marshblocker/wikiclone.git
> cd wikiclone/front-end
> npm install
> cd ../back-end npm install
> npm install
> cd ..
> docker-compose build --no-cache
> docker-compose up --build
```
