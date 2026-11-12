import { collection, doc, increment, serverTimestamp, writeBatch } from "firebase/firestore";
import { db } from "@/utils/firebase.browser";
import { User } from "@/app/type/auth";
import { Post } from "@/app/type/posts";

const postRef = (post: Post) => doc(db, "users", post.authorId, "posts", post.id);

export const createPost = async (user: User, image: string, caption: string) => {
    const batch = writeBatch(db);
    batch.set(doc(collection(db, "users", user.id, "posts")), {
        authorId: user.id,
        authorName: user.userName,
        authorAvatar: user.avatar,
        image,
        caption,
        createdAt: serverTimestamp(),
        likeCount: 0,
        commentCount: 0,
    });
    batch.update(doc(db, "users", user.id), { postCount: increment(1) });
    await batch.commit();
};

export const deletePost = async (post: Post) => {
    const batch = writeBatch(db);
    batch.delete(postRef(post));
    batch.update(doc(db, "users", post.authorId), { postCount: increment(-1) });
    await batch.commit();
};

export const likePost = async (post: Post, userId: string) => {
    const batch = writeBatch(db);
    batch.set(doc(postRef(post), "likes", userId), {});
    batch.update(postRef(post), { likeCount: increment(1) });
    await batch.commit();
};

export const unlikePost = async (post: Post, userId: string) => {
    const batch = writeBatch(db);
    batch.delete(doc(postRef(post), "likes", userId));
    batch.update(postRef(post), { likeCount: increment(-1) });
    await batch.commit();
};

export const followUser = async (me: User, other: User) => {
    const batch = writeBatch(db);
    batch.set(doc(db, "users", other.id, "followers", me.id), { userName: me.userName });
    batch.set(doc(db, "users", me.id, "following", other.id), { userName: other.userName });
    batch.update(doc(db, "users", other.id), { followerCount: increment(1) });
    batch.update(doc(db, "users", me.id), { followingCount: increment(1) });
    await batch.commit();
};

export const unfollowUser = async (meId: string, otherId: string) => {
    const batch = writeBatch(db);
    batch.delete(doc(db, "users", otherId, "followers", meId));
    batch.delete(doc(db, "users", meId, "following", otherId));
    batch.update(doc(db, "users", otherId), { followerCount: increment(-1) });
    batch.update(doc(db, "users", meId), { followingCount: increment(-1) });
    await batch.commit();
};
