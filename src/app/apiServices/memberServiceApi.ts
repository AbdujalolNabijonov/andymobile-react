import axios from "axios";
import assert from "assert";
import { serverApi } from "../libs/config";
import { Member, SignUpMember, UpdateMemberData } from "../libs/types/member";
import Definer from "../libs/Definer";
import { Product } from "../libs/types/product";
import { LikenItem, View, WishListItem } from "../libs/types/others";

export class MemberServiceApi {
    private readonly path: string
    constructor() {
        this.path = serverApi
    }

    async memberRequestSignUp(data: SignUpMember): Promise<Member> {
        try {
            const url = `${this.path}/signup`;
            const result = await axios.post(url, data, { withCredentials: true });
            console.log("signUpRequest state::", result.data.state);
            const costumize_error = result.data.message ? new Error(result.data.message.includes("duplicate") ? Definer.user_err1 : result.data.message) : ""
            assert.ok(result?.data?.state !== "fail", costumize_error);
            const member: Member = result.data.value;
            localStorage.setItem("member_data", JSON.stringify(member));
            return member;
        } catch (err: any) {
            console.log(`ERROR::: memberRequestSignUp, ${err.message}`)
            throw err
        }
    }

    async logoutRequest(): Promise<Member> {
        try {
            const url = `${this.path}/logout`,
                result = await axios.get(url, { withCredentials: true });
            const member: Member = result.data.value;
            return member
        } catch (err: any) {
            console.log(`ERROR::: memberRequestSignUp, ${err.message}`)
            throw err
        }
    }

    async loginRequest(loginData: any): Promise<Member> {
        try {
            const url = `${this.path}/login`
            const result = await axios.post(url, loginData, { withCredentials: true });
            console.log("signUpRequest state::", result.data.state);
            if (result.data.state === "fail") {
                throw new Error(result.data.message)
            }
            const member: Member = result.data.value;
            localStorage.setItem("member_data", JSON.stringify(member))
            return member
        } catch (err) {
            console.log(`ERROR: loginRequest, ${err}`)
            throw err
        }
    }

    async getChosenMember(mb_id: string): Promise<Member> {
        try {
            const url = `${this.path}/member/${mb_id}`;
            const result = await axios.get(url, { withCredentials: true });
            console.log("GET:getChosenMember State ,", result.data.state);
            const chosenMember: Member = result.data.value;
            return chosenMember
        } catch (err: any) {
            throw err
        }
    }

    async updateMember(data: UpdateMemberData): Promise<Member> {
        try {
            const formData = new FormData();
            formData.append("mb_nick", data.mb_nick ?? "");
            formData.append("mb_image", data.mb_image ?? "");
            formData.append("mb_phone", data.mb_phone ?? "");
            formData.append("mb_email", data.mb_email ?? "");
            formData.append("mb_password", data.mb_password ?? "")
            formData.append("mb_address", data.mb_address ?? "")

            const url = `${this.path}/member/member-edit`
            const result = await axios(url, {
                method: "POST",
                data: formData,
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            console.log("POST: updateMemberData state ", result.data.state);
            const updatedMember: Member = result.data.value;
            const jsonMemberData = JSON.stringify(updatedMember);
            localStorage.removeItem("member_data");
            localStorage.setItem("member_data", jsonMemberData)
            return updatedMember
        } catch (err: any) {
            throw err
        }
    }

    async resetPasswordData(data: { old_password: string, new_password: string }): Promise<Member> {
        try {
            const url = `${this.path}/member/resetPassword`
            const result = await axios.post(url, data, { withCredentials: true })
            console.log("POST: resetPasswordData state ", result.data.state);
            if (result.data.state === "fail") {
                throw new Error(result.data.message)
            }
            const updatedMember: Member = result.data.value;
            const jsonMemberData = JSON.stringify(updatedMember);
            localStorage.removeItem("member_data");
            localStorage.setItem("member_data", jsonMemberData)
            return updatedMember
        } catch (err: any) {
            throw err
        }
    }

    async likenItem(like_item_id: string, item_group: string, product?: Product): Promise<LikenItem> {
        try {
            const url = `${this.path}/liked-item`;
            const data = {
                like_item_id: like_item_id,
                like_group: item_group,
            }
            const result = await axios.post(url, data, { withCredentials: true });
            const likenItem: LikenItem = result.data.value[0]
            if (item_group === "PRODUCT") {
                if (result.data.value[0] && product) {
                    await this.createWishListItem(product)
                } else if (product) {
                    await this.removeWishListItem(product?._id)
                }
            }
            return likenItem
        } catch (err: any) {
            console.log(err)
            throw err
        }
    }

    async createWishListItem(product: Product): Promise<WishListItem | null> {
        try {
            const url = `${this.path}/wishlist/createWishlistItem`;
            const data = {
                product_id: product._id,
                product_name: product.product_name,
                product_image: product.product_images[0],
                product_price: product.product_price,
                product_discount: product.product_discount,
                product_memory: product.product_memory,
                product_color:product.product_color,
                product_qnt: 1,
            }
            const result = await axios.post(url, data, { withCredentials: true });
            const item: WishListItem = result.data.value
            return item
        } catch (err) {
            throw err
        }
    }
    async getWishListItems(): Promise<WishListItem[]> {
        try {
            const url = `${this.path}/wishlist/getAllWishedItems`
            const result = await axios.get(url, { withCredentials: true })
            console.log(`GET:getWishListItems, ${result.data.state}`)
            const listedPoducts: WishListItem[] = result.data.value
            return listedPoducts
        } catch (err: any) {
            throw err
        }
    }

    async editWishListItem(data: any): Promise<WishListItem> {
        try {
            const url = `${this.path}/wishlist/editWishlistItem`;
            const result = await axios.put(url, data, { withCredentials: true });
            console.log("PUT:editWishlistItem, ", result.data.state);
            const updatedItem: WishListItem = result.data.value;
            return updatedItem
        } catch (err: any) {
            throw err
        }
    }

    async removeWishListItem(product_id: string): Promise<WishListItem> {
        try {
            const url = `${this.path}/wishlist/removeWishlistItem/${product_id}`;
            const result = await axios.get(url, { withCredentials: true });
            const item: WishListItem = result.data.value
            return item
        } catch (err) {
            throw err
        }
    }

    async viewItem(view_item_id: string, item_group: string): Promise<View> {
        try {
            const url = `${this.path}/member/viewItem`
            const result = await axios.post(url, { view_item_id, item_group }, { withCredentials: true })
            console.log(`POST: viewItem state, ${result.data.state}`);
            const view: View = result.data.value;
            return view
        } catch (err) {
            throw err
        }
    }
}