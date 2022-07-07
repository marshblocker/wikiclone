import { Component, Input, OnInit } from '@angular/core';
import { OutputBlockData, OutputData } from '@editorjs/editorjs';
import { PageSearchResultView } from 'src/app/interfaces/page.interface';

@Component({
  selector: 'app-search-entry',
  templateUrl: './search-entry.component.html',
  styleUrls: ['./search-entry.component.css']
})
export class SearchEntryComponent implements OnInit {
  @Input() page!: PageSearchResultView;
  lead = '';
  finishedProcessing = false;

  constructor() { }

  ngOnInit(): void {
    let blocks: OutputBlockData[] = (JSON.parse(this.page.lead) as OutputData).blocks;
    blocks.forEach(block => {
      console.log('text: ' + block.data.text);
      this.lead = this.lead.concat(block.data.text);
    });
    this.finishedProcessing = true;
  }
}
