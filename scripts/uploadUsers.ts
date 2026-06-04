import { Users } from "@/app/data/usersAuth"
import { db } from "@/utils/firebase.browser";
import { addDoc, collection, getDocs } from "firebase/firestore";

export const uploadUsersToFirebase=async()=>{
    const data= await getDocs(collection(db,"users"));
    if(data.docs.length!=0)
        return ;
    for(const user of Users){
        await addDoc(collection(db,"users"),user);
    }
}