export interface OrderItem {
    _id: string;
    item_quantity: number;
    item_price: number;
    order_id: string;
    item_name: string;
    product_image: string;
    item_color: string;
    item_storage: number
}

export interface Order {
    _id: string;
    mb_id: string;
    order_code: string;
    order_total_amount: number;
    order_status: string;
    order_delivery_cost: number;
    order_subtotal_amount: number;
    order_product_qty: number;
    order_delivery_address: string;
    order_owner_name: string;
    order_delivery_postal: number;
    order_items: OrderItem[]
    order_shipping_time: Date;
    order_shipped_time: Date;
    order_delivered_time: Date;
    createdAt?: Date
}

export interface CardDetail {
    exist_card: boolean,
    exist_address: boolean;
    order_id: string,
    order_code: string;
    order_address: string,
    trans_owner: string,
    trans_card_number: number,
    trans_card_expiry: string,
    trans_card_cvc: number,
    trans_card_pincode: string
}

export interface BasketItem {
    _id: string,
    item_quantity?: number;
    product_price: number,
    product_color: string,
    product_memory: number,
    product_name: string,
    product_images: string[];
    costumize_product_contract: number;
    product_discount: number;
}
