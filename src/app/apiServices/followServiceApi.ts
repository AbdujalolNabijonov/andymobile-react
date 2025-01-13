import axios from "axios";
import { serverApi } from "../libs/config";
import { FollowInterface, SubscribeInterface } from "../libs/types/member";

class FollowServiceApi {
    private path: string
    constructor() {
        this.path = serverApi
    }

    async subscribeMember(otherId: string): Promise<SubscribeInterface> {
        try {
            const url = `${this.path}/follow/subscribe`
            const result = await axios.post(url, { other_id: otherId }, { withCredentials: true });
            console.log(`POST: subscribeMember, ${result.data.state}`)
            const followed: SubscribeInterface = result.data.value
            return followed
        } catch (err: any) {
            throw err
        }
    }
    async unsubscribeMember(otherId: string, mb_id?:string): Promise<SubscribeInterface> {
        try {
            const url = `${this.path}/follow/unsubscribe`
            const data:any = {other_id:otherId};
            if(mb_id){
                data.mb_id = mb_id
            }
            const result = await axios.post(url, data, { withCredentials: true })
            console.log(`POST:unsubscribeMember state, ${result.data.state}`);
            const unsubscribedUser: SubscribeInterface = result.data.value;
            return unsubscribedUser
        } catch (err: any) {
            throw err
        }
    }

    async getFollowers(data: any): Promise<FollowInterface[]> {
        try {
            const url = `${this.path}/follow/followers`
            const result = await axios.post(url, data, { withCredentials: true })
            console.log(`GET: getFollowers, ${result.data.state}`)
            const followers: FollowInterface[] = result.data.value;
            return followers
        } catch (err: any) {
            throw err
        }
    }

    async getFollowings(data: any): Promise<FollowInterface[]> {
        try {
            const url = `${this.path}/follow/followings`;
            const result = await axios.post(url, data, { withCredentials: true })
            console.log(`GET:getFollowings, ${result.data.state}`);
            const followings: FollowInterface[] = result.data.value;
            return followings
        } catch (err: any) {
            throw err
        }
    }
}

export default FollowServiceApi