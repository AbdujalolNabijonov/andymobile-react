import { Member } from "./member";

export interface Review {
    _id: string;
    mb_id: string;
    review_target_id: string;
    review_stars: number
    review_context: string;
    review_group: string
    review_likes: number;
    review_dislikes: number;
    me_liked: any;
    member_data: Member;
    updatedAt: Date;
    createdAt: Date;
}

export interface reviewCreateData {
    review_target_id: string;
    review_stars: number;
    review_context: string;
    review_group: string
}