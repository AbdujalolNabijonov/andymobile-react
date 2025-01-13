import { Member } from "./member";

export interface searchBlogs {
    order?: string,
    filter: string,
    page: number;
    limit: number;
    mb_id?: string;
}

export interface searchTargetBrands {
    limit: number;
    order?: string;
    page?: number;
    search?: string;
    random?: boolean;
}

export interface BankInfoObj {
    card_owner_name: string;
    card_number: string;
    card_expiry: string;
    card_cvc: string;
    card_pincode: string;
}

export interface LikenItem {
    like_item_id: string;
    like_group: string;
    mb_id: string
}

export interface WishListItem {
    product_id: string,
    product_name: string,
    product_color: string,
    product_image: string,
    product_price: number,
    product_discount: number,
    product_memory: number
    product_qnt: number,
    createdAt: Date,
    updatedAt: Date,
}

export interface View {
    mb_id: string;
    view_item_id: string,
    view_group: string;
}
export interface Message {
    event:string;
    text:string;
    memberData:Member
}