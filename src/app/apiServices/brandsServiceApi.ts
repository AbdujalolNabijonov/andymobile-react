import axios from "axios"
import { serverApi } from "../../libs/config"
import { Brand } from "../../libs/types/member"
import { searchTargetBrands } from "../../libs/types/others"
import Definer from "../../libs/Definer"

class BrandsServiceApi {
    private readonly path: string
    constructor() {
        this.path = serverApi
    }

    async getTargetBrands(data: searchTargetBrands): Promise<Brand[]> {
        try {
            let initialUrl = `${this.path}/brands/getTargetBrands?limit=${data.limit}`;
            if (data.random) initialUrl += `&random=${data.random}`;
            if (data.order) initialUrl += `&order=${data.order}`;
            if (data.page) initialUrl += `&page=${data.page}`;
            if (data.search) initialUrl += `&search=${data.search}`;
            const result = await axios.get(initialUrl, { withCredentials: true });
            console.log(`getTargetBrands state::: ${result.data.state}`);
            if (result.data.message === "fail") {
                throw new Error(result.data.message);
            }
            const brands: Brand[] = result.data.value
            return brands
        } catch (err: any) {
            throw err
        }
    }

    async getAllBrands(): Promise<Brand[]> {
        try {
            const url = `${serverApi}/brands/getAllBrands`
            const result = await axios.get(url, { withCredentials: true })
            console.log(`getAllBrands state::: ${result.data.state}`)
            if (result.data.state == "fail") {
                throw new Error(Definer.general_err1)
            }
            const brands: Brand[] = result.data.value;
            return brands
        } catch (err: any) {
            throw err
        }
    }
}

export default BrandsServiceApi