import { Blog } from "./blog";
import { Brand } from "./member";
import { Order } from "./order";
import { Product } from "./product";
import { Review } from "./review";

//App State
export interface AppRootState {
    homePage: HomePageState,
    brandPage: BrandPageState,
    productPage: ProductPageState,
    blogPage: BlogPageState,
    trackOrderPage: TrackOrderPageState
}

//Home Page State
export interface HomePageState {
    targetBrands: Brand[];
    randomNewProducts: Product[];
    targetProducts: Product[];
    communityPost: Blog[]
}

//Brand Page State
export interface BrandPageState {
    targetBrands: Brand[]
}

//Product Page State
export interface ProductPageState {
    targetProducts: Product[];
    chosenProduct: Product;
    productDescription: Product;
    productReview: Review[];
}

//Blog Page State
export interface BlogPageState {
    getTargetBlogs: Blog[]
}

//Track Page State
export interface TrackOrderPageState {
    getAllOrders: Order[];
    getChosenTarget: Order;
}
