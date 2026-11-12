'use client'
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '@/utils/firebase.browser';
import { User } from '@/app/type/auth';
import { followUser, unfollowUser } from '@/services/socialService';

type SuggestedUsersProps = {
    currentUser: User;
    followingIds: string[];
};

export function SuggestedUsers({ currentUser, followingIds }: SuggestedUsersProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [pendingId, setPendingId] = useState<string | null>(null);

    useEffect(() => {
        getDocs(query(collection(db, "users"), limit(20)))
            .then((snap) => {
                setUsers(snap.docs
                    .filter((d) => d.id !== currentUser.id)
                    .map((d) => ({ ...(d.data() as Omit<User, "id">), id: d.id })));
            })
            .catch((e) => console.log("Error loading users", e));
    }, [currentUser.id]);

    const toggleFollow = async (other: User) => {
        setPendingId(other.id);
        try {
            if (followingIds.includes(other.id)) await unfollowUser(currentUser.id, other.id);
            else await followUser(currentUser, other);
        } catch (e) {
            console.log("Error updating follow", e);
        } finally {
            setPendingId(null);
        }
    };

    return (
        <aside className="bg-surface border border-border rounded-3xl p-5">
            <h2 className="text-foreground font-semibold mb-4">Suggested people</h2>
            {users.length === 0 ? (
                <p className="text-muted text-sm">No one else here yet.</p>
            ) : (
                <ul className="flex flex-col gap-4">
                    {users.map((u) => {
                        const isFollowing = followingIds.includes(u.id);
                        return (
                            <li key={u.id} className="flex items-center gap-3">
                                <Image src={u.avatar} alt={u.userName} width={40} height={40} className="rounded-full" />
                                <div className="flex-1 min-w-0">
                                    <div className="text-foreground text-sm font-semibold truncate">{u.userName}</div>
                                    <div className="text-muted text-xs">{u.postCount} posts</div>
                                </div>
                                <button
                                    onClick={() => toggleFollow(u)}
                                    disabled={pendingId === u.id}
                                    className={`cursor-pointer text-sm font-semibold px-4 py-1.5 rounded-2xl duration-200 disabled:opacity-60 ${isFollowing
                                        ? "border border-border text-foreground hover:bg-surface-muted"
                                        : "text-white bg-linear-to-r from-[#06B6D4] to-[#3B82F6]"}`}
                                >
                                    {isFollowing ? "Following" : "Follow"}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </aside>
    );
}
