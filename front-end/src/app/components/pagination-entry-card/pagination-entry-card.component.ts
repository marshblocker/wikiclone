import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OutputBlockData, OutputData } from '@editorjs/editorjs';
import { PageEdit } from 'src/app/interfaces/page-edit.interface';
import { Page, PageSearchResultView } from 'src/app/interfaces/page.interface';
import { UserPublic } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'app-pagination-entry-card',
  templateUrl: './pagination-entry-card.component.html',
  styleUrls: ['./pagination-entry-card.component.css'],
})
export class PaginationEntryCardComponent implements OnInit {
  @Input() type!: string;

  // If type is user-page-edit-card or page-edit-of-page-card,
  // set these attributes:
  @Input() i?: number;
  @Input() pageEdit!: PageEdit;
  @Input() latestVersions!: {[page_title: string]: number};

  // If type is page-search-card, set these attributes:
  @Input() pageSearchEntry?: PageSearchResultView;
  lead = '';

  // If type is page-card, set these attributes:
  @Input() page?: Page; 
  @Output() adminDashboardDeletePageButtonClicked = new EventEmitter();

  // If type is user-card, set these attributes:
  @Input() user?: UserPublic;
  @Output() adminDashboardDeleteUserButtonClicked = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    console.log(this.type);
    if (this.type === 'page-search-card') {
      this.pageSearchEntry = this.pageSearchEntry as PageSearchResultView;
      let blocks: OutputBlockData[] = (JSON.parse(this.pageSearchEntry.lead) as OutputData)
        .blocks;
      blocks.forEach((block) => {
        this.lead = this.lead.concat(block.data.text);
      });
    }
  }
}
