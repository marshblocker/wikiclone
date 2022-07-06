export interface Page {
    page_id: string;
    page_version: number;
    timestamp: string;
    username: string;
    user_id: string;
    freeze_page: boolean;
    content: PageContent;
}

export interface PageContent {
    title: string;
    image_url: string;
    lead: string;
    body: string;
}