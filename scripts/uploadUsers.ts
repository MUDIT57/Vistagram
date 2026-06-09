import { Users } from "@/app/data/usersAuth"
import {firebaseService} from "@/services/firebaseService"

export const uploadUsers=async()=>{
    const data=await firebaseService.getAll("users");
    if(data.length!=0)
        return ;
    for(const user of Users){
        await firebaseService.add("users",user);
    }
}