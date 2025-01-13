import { Direction } from "../enums/product";
import { Brand} from "./member";

export interface Product {
    _id: string;
    company_id: string;
    product_name: string;
    product_images: string[];
    product_color: string;
    product_display: string;
    product_core: string;
    product_memory: number;
    product_ram: number;
    product_camera: string;
    product_price: number;
    product_monthly_price: number;
    product_water_proof: string;
    product_status: string;
    product_new_released: string;
    product_discount: number;
    product_contract: number;
    product_likes: number;
    product_views: number;
    product_comments: number;
    product_description: string;
    product_related_colors: any;
    product_related: any;
    company_data: Brand;
    owner_data: any;
    me_liked:any;
    createdAt: Date;
    updateAt: Date;
}
interface Range{
    start:number,
    end:number
}

interface PSearch{
    company_id?:string;
    priceRange?:Range
    contarctRange?:Range;
    color?:string;
    memory?:number
    text?:string
}

export interface ProductSearchObject {
    page:number;
    limit: Number;
    order: string;
    direction:Direction;
    search:PSearch
}