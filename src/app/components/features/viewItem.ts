import { sweetErrorHandling } from "../../../libs/sweetAlert"
import { MemberServiceApi } from "../../apiServices/memberServiceApi"

export const handleViewItem = async (item_id: string, item_group: string) => {
    try {
        const memberServiceApi = new MemberServiceApi();
        await memberServiceApi.viewItem(item_id, item_group)
    } catch (err: any) {
        await sweetErrorHandling({ message: err })
    }
}