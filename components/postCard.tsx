'use client'
import { Clock, Heart, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/utils/firebase.browser';
import { Post } from '@/app/type/posts';
import { deletePost, likePost, unlikePost } from '@/services/socialService';

type PostCardProps = {
    post: Post;
    currentUserId: string;
};

function getTimeDifference(postedTime: Date): string {
    const seconds = (Date.now() - postedTime.getTime()) / 1000;
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const years = Math.floor(days / 365);

    if (seconds < 60)
        return "Few second ago";
    else if (minutes < 60)
        return `${minutes} minutes ago`;
    else if (hours < 24)
        return `${hours} hours ago`;
    else if (days < 365)
        return `${days} days ago`;
    else
        return `${years} years ago`;
}

export function PostCard({ post, currentUserId }: PostCardProps) {
    const [liked, setLiked] = useState(false);
    const [busy, setBusy] = useState(false);
    const isOwnPost = post.authorId === currentUserId;

    useEffect(() => {
        const likeRef = doc(db, "users", post.authorId, "posts", post.id, "likes", currentUserId);
        return onSnapshot(
            likeRef,
            (snap) => setLiked(snap.exists()),
            (err) => console.log("Like listener error", err)
        );
    }, [post.authorId, post.id, currentUserId]);

    const toggleLike = async () => {
        if (busy) return;
        setBusy(true);
        try {
            if (liked) await unlikePost(post, currentUserId);
            else await likePost(post, currentUserId);
        } catch (e) {
            console.log("Error updating like", e);
        } finally {
            setBusy(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Delete this post?")) return;
        try {
            await deletePost(post);
        } catch (e) {
            console.log("Error deleting post", e);
        }
    };

    return (
        <div className="rounded-3xl overflow-hidden border-border border hover:shado-lg hover:shadow-[0px_10px_50px_rgba(6,182,212,0.25)] duration-300 flex flex-col">
            <div className="relative w-full overflow-hidden aspect-4/3">
                <Image
                    src={post.image}
                    alt="User's post"
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-110 "
                />
                <div className='absolute bottom-0 w-full h-24 bg-linear-to-t from-black/70 to-transparent'></div>
                <div className="absolute bottom-2 left-2 flex items-center gap-2 ">
                    <Image
                        src={post.authorAvatar}
                        alt="User"
                        width={40}
                        height={40}
                        className="rounded-full"
                    />
                    <div className="text-white text-xs">
                        <div className='text-sm font-bold'>{post.authorName}</div>
                        {post.createdAt && (
                            <div className="flex items-center gap-1 text-[#67E8F9]">
                                <Clock size={14} />
                                {getTimeDifference(post.createdAt.toDate())}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="p-5 bg-surface flex-1 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <button
                        onClick={toggleLike}
                        disabled={busy}
                        aria-label={liked ? "Unlike" : "Like"}
                        className="cursor-pointer flex items-center gap-1.5 text-sm text-muted hover:text-foreground duration-200 disabled:opacity-60"
                    >
                        <Heart size={20} className={liked ? "fill-pink-500 text-pink-500" : ""} />
                        <span>{post.likeCount}</span>
                    </button>
                    {isOwnPost && (
                        <button
                            onClick={handleDelete}
                            aria-label="Delete post"
                            className="cursor-pointer text-muted hover:text-red-500 duration-200"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}
                </div>
                <p className="text-foreground text-sm wrap-break-word">{post.caption}</p>
            </div>
        </div>
    );
}
