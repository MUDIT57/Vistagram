'use client'
import { Camera, Clock, X, Upload, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, doc, increment, onSnapshot, orderBy, query, serverTimestamp, writeBatch } from 'firebase/firestore';
import { Post } from '../type/posts';
import { ThemeToggle } from '@/components/themeToggle';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/utils/firebase.browser';

export default function Feeds() {

    const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [stream, setStream] = useState<null | MediaStream>(null);
    const [imageUrl, setImageUrl] = useState<null | string>(null);
    const [caption, setCaption] = useState<string>("");
    const [captionError, setCaptionError] = useState<string | null>(null);
    const [feeds, setFeeds] = useState<Post[]>([]);
    const imageInputRef = useRef<HTMLInputElement | null>(null)
    const { user, loading } = useAuth();
    const router = useRouter();
    const userId = user?.id;

    useEffect(() => {
        if (!loading && !user) router.replace("/login");
    }, [loading, user, router]);

    useEffect(() => {
        if (!userId) return;
        const postsQuery = query(
            collection(db, "users", userId, "posts"),
            orderBy("createdAt", "desc")
        );
        const unsubscribe = onSnapshot(
            postsQuery,
            (snap) => {
                setFeeds(snap.docs.map((d) => ({
                    ...(d.data({ serverTimestamps: "estimate" }) as Omit<Post, "id">),
                    id: d.id,
                })));
            },
            (err) => console.log("Posts listener error", err)
        );
        return unsubscribe;
    }, [userId]);

    const generateCaption = async () => {
        setCaptionError(null);
        const response = await fetch("/api/ai-caption", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                image_url: imageUrl
            })
        });
        const data = await response.json().catch(() => null);
        if (!response.ok || !data?.success) {
            setCaptionError(data?.error ?? "Couldn't generate a caption");
            return;
        }
        setCaption(data.caption);
    }

    function getTimeDifference(postedTime: Date): string {
        const currentTimeInSeconds = new Date().getTime() / 1000;
        const postedTimeInSeconds = postedTime.getTime() / 1000;
        const seconds = currentTimeInSeconds - postedTimeInSeconds;
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

    const openCamera = async () => {
        setIsCameraOpen(true);
        try {
            const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current)
                videoRef.current.srcObject = stream;
            setStream(stream);
        }
        catch (err) {
            console.log("Error in opening video: ", err);
        }
    }

    const closeCamera = () => {
        if (stream)
            stream.getTracks().forEach(track => track.stop());
        setStream(null);
        setIsCameraOpen(false);
        setImageUrl(null);
        setCaption("");
        setCaptionError(null);
    }

    const capturePhoto = () => {
        const videoElement = document.getElementById("videoElement") as HTMLVideoElement;
        const canvasElement: HTMLCanvasElement = document.createElement('canvas')

        canvasElement.width = 800;
        canvasElement.height = 800 * videoElement.videoHeight / videoElement.videoWidth;
        canvasElement.getContext("2d")?.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        const photoDataUrl = canvasElement.toDataURL('image/jpeg', 0.7);
        setImageUrl(photoDataUrl);
    }

    const updateFeeds = async () => {
        if (!imageUrl || !user)
            return;
        const batch = writeBatch(db);
        const postRef = doc(collection(db, "users", user.id, "posts"));
        batch.set(postRef, {
            authorId: user.id,
            authorName: user.userName,
            authorAvatar: user.avatar,
            image: imageUrl,
            caption: caption,
            createdAt: serverTimestamp(),
            likeCount: 0,
            commentCount: 0,
        });
        batch.update(doc(db, "users", user.id), { postCount: increment(1) });
        try {
            await batch.commit();
        } catch (e) {
            console.log("Error sharing post", e);
        }
    }

    const triggerImageUploadClick = () => {
        const doc = imageInputRef.current as HTMLInputElement;
        doc.click();
    }

    const handleFileChnage = () => {
        const doc = imageInputRef.current as HTMLInputElement;
        const [input] = doc.files as FileList;
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new window.Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = 800;
                canvas.height = 800 * img.height / img.width;
                canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
                setImageUrl(canvas.toDataURL('image/jpeg', 0.7));
            }
            img.src = e.target?.result as string;
        }
        reader.onerror = (e) => {
            console.log('error found: ', e);
        }
        reader.readAsDataURL(input);
    }

    if (loading || !user) {
        return <div className='h-dvh flex items-center justify-center text-muted'>Loading…</div>;
    }

    return <div className='flex flex-col h-screen overflow-hidden'>
        {isCameraOpen &&
            <div className='max-sm:p-4 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg flex-col'>
                <div className='max-w-133 w-full border rounded-4xl overflow-hidden bg-surface border-border'>
                    <div className='flex justify-between p-6 items-center border-b border-border'>
                        <span className='text-2xl font-bold bg-linear-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text'>Capture Moment</span>
                        <X className='text-foreground cursor-pointer' onClick={() => closeCamera()} />
                    </div>
                    {!imageUrl ? <video className='w-full aspect-4/3' ref={videoRef} autoPlay id="videoElement"></video> :
                        <Image width={30} height={30} alt="faceCam" className='w-full aspect-4/3' src={imageUrl} id="photoElement" />}
                    {!imageUrl ? <div className=' p-6 flex flex-col justify-center items-center gap-3 border-t border-border'>
                        <div className='flex gap-4'>
                            <button onClick={() => triggerImageUploadClick()} id="captureButton" className='cursor-pointer text-white flex bg-linear-to-r from-purple-500 to-pink-500 px-6 py-3 justify-center items-center gap-2 rounded-2xl'>
                                <input ref={imageInputRef} onChange={() => handleFileChnage()} type="file" id="fileInput" accept="image/*" className="hidden" />
                                <Upload />
                                Upload Photo
                            </button>
                            <div onClick={() => capturePhoto()} className='bg-linear-to-r from-cyan-400 to-blue-500 border rounded-full w-16 h-16 relative border-none cursor-pointer'>
                                <div className='border-3 rounded-full absolute inset-4 border-white '></div>
                            </div>
                        </div>
                        <span className='text-muted text-sm'>Position your camera and tap the button to capture</span>
                    </div> : <div className='p-6'>
                        <div className='flex justify-between items-center'>
                            <span className='text-foreground text-sm'>Caption</span>
                            <button onClick={() => generateCaption()} className='cursor-pointer text-white flex text-sm bg-linear-to-r from-emerald-500 to-teal-500 rounded-2xl border-none px-4 py-2 items-center gap-1'>
                                <Sparkles height={16} width={16} />
                                AI Generate
                            </button>
                        </div>
                        {captionError && <span className='block mt-2 text-sm text-red-500'>{captionError}</span>}
                        <textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder='Describe your moment...' className='w-full h-32 bg-surface-muted rounded-2xl border-border border mt-2 text-foreground placeholder:text-placeholder p-4 focus:border-cyan-400 focus:outline-none' />
                        <button onClick={() => { closeCamera(); updateFeeds(); }} className='cursor-pointer mt-2 w-full bg-linear-to-r from-cyan-500 to-blue-500 rounded-4xl p-2 text-white'>Share to Feed</button>
                    </div>}
                </div>
            </div>
        }
        <header className="bg-surface py-5 px-8 lg:px-30">
            <div className='flex justify-between items-center '>
                <div className="flex flex-col">
                    <span className="text-2xl md:text-3xl font-black bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Vistagram</span>
                    <span className="max-sm:hidden text-muted text-sm  md:text-[16px]">Discover Points of Interest</span>
                </div>
                <div className='flex items-center gap-3'>
                    <ThemeToggle />
                    <button onClick={openCamera} className="flex gap-2 justify-center text-white items-center px-4 md:px-6 py-3 cursor-pointer rounded-4xl bg-linear-to-r from-[#06B6D4] to-[#3B82F6]">
                        <Camera size={15} />
                        <span className='text-sm md:text-[16px] font-semibold '>Capture</span>
                    </button>
                </div>
            </div>
        </header>
        <hr className='border-border' />
        <div className="bg-linear-to-b from-cyan-50 via-blue-100 to-purple-100 dark:from-slate-950 dark:via-slate-950 dark:to-blue-950 overflow-y-auto px-8 lg:px-20">
            <div className="grid grid-cols-1 gap-4 md:gap-8 py-10 md:grid-cols-2 lg:grid-cols-3">
                {feeds.map((post) => (
                    <div key={post.id} className="rounded-3xl overflow-hidden border-border border hover:shado-lg hover:shadow-[0px_10px_50px_rgba(6,182,212,0.25)] duration-300">
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
                        <div className="p-5 text-foreground text-sm bg-surface h-full wrap-break-word">{post.caption}</div>
                    </div>
                ))}
            </div>
        </div>
    </div >
}