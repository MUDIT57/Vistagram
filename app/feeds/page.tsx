'use client'
import { Camera, Clock, X, Upload, Sparkles } from 'lucide-react';
import { Posts } from "../data/posts"
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import OpenAI from 'openai';

export default function Feeds() {

    // useEffect(()=>{
    const run = async () => {
        const client = new OpenAI({
            apiKey: "api-key",
            dangerouslyAllowBrowser: true
        });
        const response = await client.responses.create({
            model: "gpt-5-nano",
            input: "Write a one-sentence bedtime story about a unicorn."
        })
        console.log(response.output_text);
    }
    // run();
    // },[])

    function getTimeDifference(postedTime: string): string {
        const currentTimeInSeconds = new Date().getTime() / 1000;
        const postedTimeInSeconds = new Date(postedTime).getTime() / 1000;
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

    const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [stream, setStream] = useState<null | MediaStream>(null);
    const [imageUrl, setImageUrl] = useState<null | string>(null);

    const openCamera = async () => {
        setIsCameraOpen(true);
        try {
            const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current)
                videoRef.current.srcObject = stream;
            setStream(stream);
            console.log(stream.getTracks());
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
    }

    const capturePhoto = () => {
        const videoElement = document.getElementById("videoElement") as HTMLVideoElement;
        const canvasElement: HTMLCanvasElement = document.createElement('canvas')

        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
        canvasElement.getContext("2d")?.drawImage(videoElement, 0, 0);
        const photoDataUrl = canvasElement.toDataURL('image/jpeg');
        setImageUrl(photoDataUrl);
    }

    return <div className='flex flex-col h-screen overflow-hidden'>
        {isCameraOpen &&
            <div className='fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg flex-col'>
                <div className='border rounded-4xl overflow-hidden bg-linear-to-r from-slate-900 to-blue-900 border-cyan-500/30'>
                    <div className='flex justify-between p-6  items-center border-b border-cyan-500/20'>
                        <span className='text-2xl font-bold bg-linear-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text'>Capture Moment</span>
                        <X className='text-white cursor-pointer' onClick={() => closeCamera()} />
                    </div>
                    {!imageUrl ? <video className='w-full h-100' ref={videoRef} autoPlay id="videoElement"></video> :
                        <img className='w-full h-100' src={imageUrl} id="photoElement" />}
                    {!imageUrl ? <div className='p-6 flex flex-col justify-center items-center gap-3 border-t border-cyan-500/20'>
                        <div className='flex gap-4'>
                            <button className='cursor-pointer text-white flex bg-linear-to-r from-purple-500 to-pink-500 px-6 py-3 justify-center items-center gap-2 rounded-2xl'>
                                <Upload />
                                Upload Photo
                            </button>
                            <div onClick={() => capturePhoto()} className='bg-linear-to-r from-cyan-400 to-blue-500 border rounded-full w-16 h-16 relative border-none cursor-pointer'>
                                <div className='border-3 rounded-full absolute inset-4 border-white '></div>
                            </div>
                        </div>
                        <span className='text-gray-400 text-sm'>Position your camera and tap the button to capture</span>
                    </div> : <div className='p-6'>
                        <div className='flex justify-between items-center'>
                            <span className='text-white text-sm'>Caption</span>
                            <button onClick={()=>run()} className='cursor-pointer text-white flex  text-sm bg-linear-to-r from-emerald-500 to-teal-500 rounded-2xl border-none px-4 py-2 items-center gap-1'>
                                <Sparkles height={16} width={16} />
                                AI Generate
                            </button>
                        </div>
                        <textarea placeholder='Describe your moment...' className='w-full h-32 bg-black/50 rounded-2xl border-cyan-500/30 border mt-2 text-white placeholder-gray-500 p-4 focus:border-cyan-400 focus:outline-none' />
                        <button className='cursor-pointer mt-2 w-full bg-linear-to-r from-cyan-500 to-blue-500 rounded-4xl p-2 text-white'>Share to Feed</button>
                    </div>}
                </div>
            </div>
        }
        <header className="bg-[#0e172f] py-5 px-30">
            <div className='flex justify-between items-center '>
                <div className="flex flex-col">
                    <span className="text-[30px] font-black bg-linear-to-r from-cyan-400 via-blue-400  to-purple-400 bg-clip-text text-transparent">Vistagram</span>
                    <span className="text-[#94A3B8] text-[16px]">Discover Points of Interest</span>
                </div>
                <button onClick={openCamera} className="flex gap-2 justify-center text-white items-center px-6 py-3 cursor-pointer rounded-4xl  bg-linear-to-r from-[#06B6D4] to-[#3B82F6]">
                    <Camera size={15} />
                    <span className='text-[16px] font-semibold '>Capture</span>
                </button>
            </div>
        </header>
        <hr className='color-yellow' />
        <div className="bg-linear-to-b from-slate-950 to-blue-950 overflow-y-auto px-20">
            <div className="grid grid-cols-3 gap-8 py-10">
                {Posts.map((post) => (
                    <div key={post.id} className="rounded-3xl overflow-hidden border-[#06B6D41A] border hover:shado-lg hover:shadow-[0px_10px_50px_rgba(6,182,212,0.25)] duration-300">
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
                                    src={post.userAvatar}
                                    alt="User"
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                                <div className="text-white text-xs">
                                    <div className='text-sm font-bold'>{post.username}</div>
                                    <div className="flex items-center gap-1 text-[#67E8F9]">
                                        <Clock size={14} />
                                        {getTimeDifference(post.timestamp)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-5 text-white text-sm bg-[#0f193a]">{post.caption}</div>
                    </div>
                ))}
            </div>
        </div>
    </div >
}