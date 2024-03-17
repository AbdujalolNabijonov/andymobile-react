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
    product_monthly_fee: number;
    product_likes: number;
    product_views: number;
    product_description: string;
    createdAt:Date;
    updateAt:Date;
}

export interface ProductSearchObject{
    limit:Number;
    company_id?:string;
    order:string;
    page?:number
    maxPrice?:number,
    minPrice?:number;
    minMonthlyFee?:number;
    maxMonthlyFee?:number;
    color?:string;
    storage?:number;
    search?:string;
}