import { OutputBlockData, OutputData } from "@editorjs/editorjs";

export type HTMLString = string;

export class PageHTML {
    pageTitleHTML: HTMLString;
    pageImageHTML?: HTMLString;
    pageLeadHTML: HTMLString;
    pageBodyHTML?: HTMLString;

    constructor(pageTitle: string, pageLead: OutputData, pageImageUrl?: string, pageBody?: OutputData) {
        this.pageTitleHTML = `<h1> ${pageTitle} </h1>\n`;
        this.pageImageHTML = (pageImageUrl === undefined) ? 
            '' : `<img src="${pageImageUrl}">`;

        this.pageLeadHTML = this.convertOutputDataToHTML(pageLead);
        this.pageBodyHTML = (pageBody === undefined) ? 
            '' : this.convertOutputDataToHTML(pageBody);
    }

    public getHTMLRepresentation(): HTMLString {
        return `
            ${this.pageTitleHTML}
            ${this.pageImageHTML}
            ${this.pageLeadHTML}
            ${this.pageBodyHTML}
        `;
    }

    private convertOutputDataToHTML(data: OutputData): HTMLString {
        let html = '';
        data.blocks.forEach((block: OutputBlockData<string, any>) => {
            switch (block.type) {
                case 'paragraph':
                    html += `<p> ${block.data.text} </p>\n`;
                    break;

                case 'header':
                    const hTagStart = '<h' + block.data.level + ' style="border-bottom: 1px solid black;">';
                    const hTagEnd = '</h' + block.data.level + '>';
                    html += `${hTagStart} ${block.data.text} ${hTagEnd}\n`;
                    break;
            
                case 'list':
                    const isOrdered = (block.data.style === 'ordered');
                    const wrapItemsWithTag = (items: string) => {
                        return isOrdered ? `<ol>\n${items}\n</ol>\n` : `<ul>\n${items}\n</ul>\n`;
                    }
                    const wrapItemWithTag = (item: string) => {
                        return `  <li> ${item} </li>\n`;
                    }
            
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

        return html;
    }
}