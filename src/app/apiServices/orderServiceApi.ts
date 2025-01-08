import axios from "axios";
import { serverApi } from "../../libs/config";
import { Order, OrderItem } from "../../libs/types/order";

class OrderServiceApi {
    private readonly path: string
    constructor() {
        this.path = serverApi
    }

    async createOrder(orders: OrderItem[]): Promise<Order> {
        try {
            const url = `${this.path}/orders/createOrder`;
            const result = await axios.post(url, orders, { withCredentials: true });
            console.log("POST: createOrder state, ", result.data.state)
            const order: Order = result.data.value;
            return order
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    async getOrdersData(searchObj: any): Promise<Order[]> {
        try {
            const url = `${this.path}/orders/getAllOrders`;
            const result = await axios.post(url, searchObj, { withCredentials: true })
            console.log(`GET: getOrdersData State, ${result.data.state}`);
            const orders: Order[] = result.data.value;
            return orders
        } catch (err: any) {
            throw err
        }
    }
    async updateOrderItem(order_id: string, updateData: any): Promise<OrderItem> {
        try {
            const url = `${this.path}/orders/orderItem/${order_id}`;
            const result = await axios.post(url, updateData, { withCredentials: true });
            console.log("POST:updateOrderItem state, ", result.data.state);
            const updatedItem: OrderItem = result.data.vcalue;
            return updatedItem
        } catch (err: any) {
            throw err
        }
    }
    async updateOrderData(id: string, data: any): Promise<Order> {
        try {
            const url = `${this.path}/orders/editOrder/${id}`
            const result = await axios.post(url, data, { withCredentials: true });
            console.log(`POST:updateOrderData state, ${result.data.state}`);
            const updatedOrder: Order = result.data.value;
            return updatedOrder
        } catch (err: any) {
            throw err
        }
    }

    async removeOrderItem(id: string): Promise<OrderItem> {
        try {
            const url = `${this.path}/orders/orderItemRemmove/${id}`
            const result = await axios.get(url, { withCredentials: true });
            console.log(`GE: removeOrderItem, ${result.data.state}`);
            const deletedOrder: OrderItem = result.data.value;
            return deletedOrder
        } catch (err) {
            throw err
        }
    }

    async getChosenOrder(id: string): Promise<Order> {
        try {
            const url = `${this.path}/orders/getTargetOrder/${id}`;
            const result = await axios.get(url, { withCredentials: true })
            console.log(`GET: getChosenOrder state, ${result.data.state}`)
            const chosenOrder: Order = result.data.value[0];
            return chosenOrder
        } catch (err) {
            throw err
        }
    }

    async deleteOrderData(id: string): Promise<any> {
        try {
            const url = `${this.path}/orders/deleteOrder`;
            const result = await axios.post(url, { order_id: id }, { withCredentials: true });
            console.log(`POST: deleteOrderData state, ${result.data.state}`);
            const deletedOrder = result.data.value;
            return deletedOrder
        } catch (err: any) {
            throw err
        }
    }

}

export default OrderServiceApi