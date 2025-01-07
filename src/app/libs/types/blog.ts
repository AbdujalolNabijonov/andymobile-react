import { Member } from "./member";

export interface Blog {
    _id: string;
    mb_id: string;
    blog_title: String;
    blog_category: String;
    blog_context: String;
    blog_images: string[];
    blog_likes: number;
    blog_views: number;
    blog_comments: number;
    blog_status: String;
    mb_data: Member;
    me_liked: any;
    createdAt: Date;
    updateAt: Date;
}

export interface BlogCreate {
    blog_title: String;
    blog_category: String;
    blog_context: String;
    blog_images: string[];
}
export interface SearchObjBlog {
    order: string;
    filter: string;
    limit: number;
    page: number;
    mb_id?: string
}