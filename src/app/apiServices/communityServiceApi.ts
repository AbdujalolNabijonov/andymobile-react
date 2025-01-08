import axios from "axios";
import { serverApi } from "../../libs/config";
import { searchBlogs } from "../../libs/types/others";
import { Blog, BlogCreate, SearchObjBlog } from "../../libs/types/blog";
import { Review, reviewCreateData } from "../../libs/types/review";

class CommunityServiceApi {
    private readonly path: string
    constructor() {
        this.path = serverApi
    }

    async getTargetCommunityPost(data: searchBlogs): Promise<Blog[]> {
        try {
            const url = `${this.path}/blogs/getTargetBlogs?filter=${data.filter}&page=${data.page}&limit=${data.limit}`;
            const result = await axios.get(url, { withCredentials: true });
            console.log(`getTargetCommunityPost State::: ${result.data.state}`);
            const blogs: Blog[] = result.data.value;
            return blogs
        } catch (err: any) {
            throw err
        }
    }

    async getProductReviews(product_id: string): Promise<Review[]> {
        try {
            const url = `${serverApi}/review/getReviews/${product_id}`
            const result = await axios.get(url, { withCredentials: true });
            console.log(`getProductReviews state, ${result.data.state}`)
            const reviews: Review[] = result.data.value;
            return reviews
        } catch (err) {
            throw err
        }
    }
    async createReview(data: reviewCreateData): Promise<Review> {
        try {
            const url = `${serverApi}/review/createReview`;
            const result = await axios.post(url, data, { withCredentials: true })
            console.log("createReview state::", result.data.state);
            const review: Review = result.data.value
            return review
        } catch (err) {
            throw err
        }
    }

    async createBlogData(data: BlogCreate): Promise<Blog> {
        try {
            const url = `${this.path}/blogs/createBlog`
            const result = await axios.post(url, data, { withCredentials: true })
            console.log(`POST: createBlogData state, ${result.data.state}`);
            const newBlog: Blog = result.data.value;
            return newBlog
        } catch (err: any) {
            throw err
        }
    }

    async getTargetBlogs(query: SearchObjBlog): Promise<Blog[]> {
        try {
            const url = `${this.path}/blogs/getTargetBlogs/?filter=${query.filter}&order=${query.order}&page=${query.page}&limit=${query.limit}&mb_id=${query.mb_id}`
            const result = await axios.get(url, { withCredentials: true });
            console.log("getTargetBlogs State::", result.data.state);
            const blogs: Blog[] = result.data.value;
            return blogs
        } catch (err: any) {
            throw err
        }
    }

    async getChosenBlog(id: string): Promise<Blog> {
        try {
            const url = `${this.path}/community/chosenBlog/${id}`;
            const result = await axios.get(url, { withCredentials: true });
            console.log(`GET: getChosenBlog State, ${result.data.state}`);
            const chosenBlog: Blog = result.data.value;
            return chosenBlog
        } catch (err: any) {
            throw err
        }
    }
    async removeChosenBlog(blog_id: string): Promise<Blog> {
        try {
            const url = `${serverApi}/community/removeBlog/${blog_id}`;
            const result = await axios.get(url, { withCredentials: true });
            console.log(`GET: removeChosenBlog, ${result.data.state}`)
            const deletedBlog: Blog = result.data.value;
            return deletedBlog
        } catch (err: any) {
            throw err
        }
    }

    async uploadImageData(image: any): Promise<string> {
        try {
            const url = `${this.path}/community/image`;
            const form = new FormData();
            form.append("community_image", image)
            const result = await axios(url, {
                withCredentials: true,
                method: "POST",
                data: form,
                headers: {
                    "Content-Type": "multipart/form-data"
                },

            },)
            console.log("POST: uploadImageData state, ", result.data.state)
            const imagePath: string = result.data.value;
            return imagePath
        } catch (err: any) {
            throw err
        }
    }
}

export default CommunityServiceApi