import assert from "assert";
import { verifiedMemberData } from "../../apiServices/verified";
import Definer from "../../../libs/Definer";
import OrderServiceApi from "../../apiServices/orderServiceApi";
import { OrderItem } from "../../../libs/types/order";
import { sweetErrorHandling } from "../../../libs/sweetAlert";

export async function handleBuyProduct(product: any, obj: any, address?:string) {
    try {
        assert.ok(verifiedMemberData, Definer.auth_err1)
        const orderServiceApi = new OrderServiceApi();
        const orderItem: OrderItem[] = [{
            _id: product?._id ?? "",
            item_quantity: obj.item_quantity,
            //@ts-ignore
            item_price: product.product_price - (product.product_price * (product.product_discount / 100)),
            order_id: "",
            item_name: product?.product_name ?? "",
            product_image: product?.product_images && product?.product_images[0] ? product?.product_images[0] : product?.product_image,
            item_color: product?.product_color ?? "",
            item_storage: product?.product_memory ?? 0
        }]
        const result = await orderServiceApi.createOrder(orderItem)
        if(address){
            window.location.replace(address)
        }
        assert.ok(result, Definer.general_err1);
    } catch (err) {
        console.log(err)
        await sweetErrorHandling(err)
    }
}

