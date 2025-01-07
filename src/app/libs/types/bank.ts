export interface Bank {
    mb_id: string;
    card_status: string;
    card_owner_name: string;
    card_number: number;
    card_expiry: string;
    card_cvc: number;
    card_pincode: string;
}

export interface Transaction {
    order_address: string
    trans_owner: string
    trans_card_number: number
    trans_card_expiry: string,
    trans_card_cvc: number,
    createdAt: Date,
}