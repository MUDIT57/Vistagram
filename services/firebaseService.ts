import { db } from "@/utils/firebase.browser"
import { collection, getDocs,setDoc,doc } from "firebase/firestore";

class FirebaseService {
    async getAll<T>(collectionName:string):Promise<T[]>{
        const snapshot= await getDocs(collection(db,collectionName));
        return snapshot.docs.map(snap=>snap.data() as T);
    }
    async add<T>(collectionName:string,data:T,uid:string){
        return await setDoc(doc(db,collectionName,uid),data as object);
    }
    async isEmpty(collectionName:string):Promise<boolean>{
        const snapshot= await getDocs(collection(db,collectionName));
        return snapshot.empty;
    }
}

export const firebaseService=new FirebaseService();