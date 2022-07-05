import { OutputBlockData } from '@editorjs/editorjs';

export type HTMLString = string;

export class PageHTML {
  pageTitleHTML: HTMLString;
  pageImageHTML?: HTMLString;
  pageLeadHTML: HTMLString;
  pageBodyHTML?: HTMLString;

  constructor(
    pageTitle: string,
    pageImageUrl: string,
    pageLeadData: OutputBlockData<string, any>[],
    pageBodyData: OutputBlockData<string, any>[]
  ) {
    this.pageTitleHTML = `<h1 style="border-bottom: 1px solid #a2a9b1;"> ${pageTitle} </h1>\n`;
    this.pageImageHTML =
      pageImageUrl === ''
        ? ''
        : ` <div style="display: flex; max-width: 300px; max-height: 400px;">
                <img 
                    src="${pageImageUrl}" 
                    alt="Image source: ${pageImageUrl}" 
                    style="margin: auto; max-width: inherit; border: 2px solid black;"
                >
            </div>`;

    this.pageLeadHTML = this.convertOutputDataToHTML(pageLeadData);
    this.pageBodyHTML =
      pageBodyData.length === 0
        ? ''
        : this.convertOutputDataToHTML(pageBodyData);
  }

  public getHTMLRepresentation(): HTMLString {
    return `
            ${this.pageTitleHTML}
            <div style="display: flex; justify-content: space-between;">
                ${this.pageLeadHTML}
                ${this.pageImageHTML}
            </div>
            ${this.pageBodyHTML}
        `;
  }

  private convertOutputDataToHTML(
    data: OutputBlockData<string, any>[]
  ): HTMLString {
    let html = '<div style="display: block;">';
    data.forEach((block: OutputBlockData<string, any>) => {
      switch (block.type) {
        case 'paragraph':
          html += `<p> ${block.data.text} </p>\n`;
          break;

        case 'header':
          const hTagStart = (block.data.level !== 3) ?
            '<h' +
            block.data.level +
            ' style="border-bottom: 1px solid #a2a9b1;">'
            : 
            '<h' + block.data.level + '>';
          const hTagEnd = '</h' + block.data.level + '>';
          html += `${hTagStart} ${block.data.text} ${hTagEnd}\n`;
          break;

        case 'list':
          const isOrdered = block.data.style === 'ordered';
          const wrapItemsWithTag = (items: string) => {
            return isOrdered
              ? `<ol>\n${items}\n</ol>\n`
              : `<ul>\n${items}\n</ul>\n`;
          };
          const wrapItemWithTag = (item: string) => {
            return `  <li> ${item} </li>\n`;
          };

          let listString = '';
          block.data.items.forEach((item: string) => {
            listString += wrapItemWithTag(item);
          });
          listString = wrapItemsWithTag(listString);
          html += listString;
          break;

        default:
          break;
      }
    });

    html += '</div>';

    return html;
  }
}
