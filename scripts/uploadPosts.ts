import { Posts } from "@/app/data/posts";
import { firebaseService } from "@/services/firebaseService";

export const uploadPosts=async()=>{
    const data=await firebaseService.getAll("posts");
    if(data.length!=0)
        return ;
    for(const post of Posts){
        await firebaseService.add("posts",post);
    }
}

