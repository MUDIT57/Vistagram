import { Timestamp } from "firebase/firestore";

export type Post = {
    id: string;
    authorId: string;
    authorName: string;
    authorAvatar: string;
    image: string;
    caption: string;
    createdAt: Timestamp | null;
    likeCount: number;
    commentCount: number;
}
