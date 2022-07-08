import { PageContent } from "./page.interface";

export interface PageEdit {
    page_edit_id: string;
    page_version: number;
    timestamp: string;
    edit_summary: string;
    
    user_id: string;
    username: string;
    role: string

    page_id: string;
    freeze_page: string;
    content: PageContent;
}