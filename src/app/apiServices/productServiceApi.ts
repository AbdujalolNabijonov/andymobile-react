import axios from "axios"
import { Product, ProductSearchObject } from "../../libs/types/product"
import { serverApi } from "../../libs/config";

class ProductServiceApi {
    private readonly path: string
    constructor() {
        this.path = serverApi
    }
    async getTargetProducts(data: ProductSearchObject): Promise<Product[]> {
        try {
            const url = `${this.path}/products/getTargetProducts`
            const result = await axios.post(url, data, { withCredentials: true })
            console.log(`getTargetProducts state::: ${result.data.state}`)
            if (result?.data?.state === "fail") {
                throw new Error(result.data.message)
            }
            const products: Product[] = result.data.value;
            return products
        } catch (err: any) {
            console.log(`ERROR::: getRandomNewProducts, ${err.message}`)
            throw err
        }
    }

    async getChosenProduct(product_id: string): Promise<Product> {
        try {
            const url = `${serverApi}/products/product/${product_id}`;
            const result = await axios.get(url, { withCredentials: true })
            console.log(`getChosenProduct State::: ${result.data.state}`)
            const product: Product[] = result.data.value;
            return product[0]
        } catch (err: any) {
            throw err
        }
    }

}
export default ProductServiceApi