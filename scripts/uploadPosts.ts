import { Posts } from "@/app/data/posts";
import { db } from "@/utils/firebase.browser";
import { addDoc, collection, getDocs } from "firebase/firestore";

export const uploadPosts=async()=>{
    const data= await getDocs(collection(db,"posts"));
    if(data.docs.length!=0)
        return ;
    for(const post of Posts){
        await addDoc(collection(db,"posts"),post);
    }
}