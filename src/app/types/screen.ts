import { Bank } from "./bank";
import { Blog } from "./blog";
import { Brand, Member } from "./member";
import { Order } from "./order";
import { WishListItem } from "./others";
import { Product } from "./product";
import { Review } from "./review";

//App State
export interface AppRootState {
    homePage: HomePageState,
    brandPage: BrandPageState,
    productPage: ProductPageState,
    blogPage: BlogPageState,
    memberPage: MemberPageState;
    trackOrderPage: TrackOrderPageState
}

//Home Page State
export interface HomePageState {
    topRandomBrands: Brand[];
    randomNewProducts: Product[];
    targetHomeProducts: Product[];
    communityPost: Blog[]
}

//Brand Page State
export interface BrandPageState {
    targetBrands: Brand[]
}

//Product Page State
export interface ProductPageState {
    targetProducts: Product[];
    chosenProduct: Product | null;
    productReview: Review[];
    allBrands: Brand[];
    relatedProducts: Product[]
}

//Blog Page State
export interface BlogPageState {
    targetBlogs: Blog[]
}

//Member Page State

export interface MemberPageState {
    chosenMember: Member | null;
    chosenBankCard: Bank | null;
    wishListItems: WishListItem[];
    followers: Member[],
    followings: Member[];
    targetBlogs: Blog[];
}

//Track Page State
export interface TrackOrderPageState {
    getAllOrders: Order[];
    getChosenTarget: Order;
}
