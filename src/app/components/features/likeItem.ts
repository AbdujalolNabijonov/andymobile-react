import { MemberServiceApi } from "../../apiServices/memberServiceApi";
import Definer from "../../libs/Definer";
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from "../../libs/sweetAlert";


export async function handleLikeItem(e: any, item: any, like_group: string, refs?: any, setRebuild?: any, refresh?: boolean) {
    try {
        const memberServiceApi = new MemberServiceApi();
        const result = await memberServiceApi.likenItem(item._id, like_group, item);
        if (result) {
            e.target.style.fill = "red"
            e.target.classList.add("animate-heart")
            if (refs) {
                refs.current[item._id].innerHTML++
            }
            await sweetTopSmallSuccessAlert("success", 700, false)
        } else {
            e.target.style.fill = "white"
            e.target.classList.remove("animate-heart")
            if (refs) {
                refs.current[item._id].innerHTML--
            }
            await sweetTopSmallSuccessAlert("success", 700, false)
        }
        if (refresh) {
            setRebuild(new Date())
        }
    } catch (err: any) {
        console.log(err)
        await sweetErrorHandling({ message: Definer.auth_err1 })
    }
}