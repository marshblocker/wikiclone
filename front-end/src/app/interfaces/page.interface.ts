export interface Page {
    page_id: string;
    content: PageContent;
    freeze_page: boolean;
}

export interface PageContent {
    title: string;
    image_url: string;
    lead: string;
    body: string;
}