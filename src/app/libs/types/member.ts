export interface Brand {
    _id: string;
    mb_nick: string;
    mb_phone: string;
    mb_password: string;
    mb_status: string;
    mb_type: string;
    mb_top?: string;
    mb_image: string;
    mb_address: string;
    mb_email: string;
    mb_likes: number;
    mb_views: number;
    mb_comments: number;
    mb_followers: number;
    mb_followings: number;
    mb_description: string;
    lat: number,
    lng: number,
    me_liked: any;
    createdAt: Date;
    updatedAt: Date;
}

export interface Member {
    _id: string;
    mb_nick: string;
    mb_phone: string;
    mb_password: string;
    mb_status: string;
    mb_type: string;
    mb_top?: string;
    mb_image?: string;
    mb_address: string;
    mb_address_postCode: number;
    mb_address_province: string;
    mb_email?: string;
    mb_likes: number;
    mb_views: number;
    mb_followers: number;
    mb_followings: number;
    mb_description?: string;
    my_following: any
    createdAt: Date;
    updatedAt: Date;
}

export interface SignUpMember {
    mb_nick: string;
    mb_email: string;
    mb_password: string;
    mb_phone: string;
}

export interface UpdateMemberData {
    mb_nick?: string;
    mb_phone?: string;
    mb_image?: string;
    mb_description?: string;
    mb_password?: string;
    mb_email?: string;
    mb_address?: string
}

export interface FollowInterface {
    following_id: string,
    follower_id: string,
    createdAt: Date,
    updatedAt: Date,
    member_data: Member;
    me_following: [{
        following_id: string,
        follower_id: string,
        me_following: boolean
    }]
}
export interface SubscribeInterface {
    following_id: string,
    follower_id: string,
    createdAt: Date,
    updatedAt: Date,
}
