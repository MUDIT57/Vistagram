"use client"
import { useState } from "react"
import Image from "next/image";

export default function Login() {

    const [activeTab, setActiveTab] = useState<string>("Sign In");

    const isSignInTabSelected = () => activeTab === "Sign In";

    return <div className="h-screen w-screen bg-linear-to-r from-slate-950 via-blue-950 to-slate-950 flex">
        <div className="m-auto gap-5 flex flex-col">
            <div className="flex flex-col justify-center items-center">
                <span className="text-[50px] font-bold bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Vistagram</span>
                <span className="text-[#94A3B8] text-[16px]">Discover & Share Points of Interest</span>
            </div>
            <div className="flex flex-col gap-6 bg-[#0F172A]/50 border border-[#06B6D4]/20 rounded-3xl p-8">
                <div className="bg-[#1E293B]/50 flex gap-5 rounded-xl">
                    <button onClick={() => setActiveTab("Sign In")} className={`py-3 px-12 rounded-xl text-[#94A3B8] font-bold text-lg ${isSignInTabSelected()?"text-white bg-linear-to-r from-[#06B6D4] to-[#3B82F6]":""}`}>Sign In</button>
                    <button onClick={() => setActiveTab("Sign Out")} className={`py-3 px-12 rounded-xl text-[#94A3B8] font-bold text-lg ${!isSignInTabSelected()?"text-white bg-linear-to-r from-[#06B6D4] to-[#3B82F6]":""}`}>Sign Up</button>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <span className="text-sm text-[#CBD5E1]">Email</span>
                        <input placeholder="Enter your email" className="placeholder:text-[#64748B] text-white border border-slate-700 rounded-lg p-3 px-4" />
                    </div>
                     <div className="flex flex-col gap-2">
                        <span className="text-sm text-[#CBD5E1]">Password</span>
                        <input placeholder="Enter your password" className="placeholder:text-[#64748B] text-white border border-slate-700 rounded-lg p-3 px-4" />
                    </div>
                </div>
                <div className="flex justify-between">
                    <div className="flex items-center gap-1.5">
                        <input type="checkbox" className="w-4 h-4"/>
                        <span className="text-slate-400 text-sm">Remember me</span>
                    </div>
                    <span className="text-sm text-cyan-400 hover:text-cyan-300">Forgot Password?</span>
                </div>
                <button onClick={() => setActiveTab("Sign In")} className={`py-3 px-12 rounded-xl font-bold text-lg text-white bg-linear-to-r from-[#06B6D4] to-[#3B82F6] hover:shadow-md hover:scale-105 duration-200 shadow-[#06B6D4]/50`}>Sign In</button>
                <div className="flex items-center gap-3">
                    <div className="bg-slate-700 h-px w-full"></div>
                    <span className="text-sm whitespace-nowrap text-slate-500">Or continue with</span>
                    <div className="bg-slate-700 h-px w-full"></div>
                </div>
                <div className="flex gap-5 border border-">
                    <button className="w-full flex py-3 bg-[#1E293B]/50 border border-[#06B6D4]/20 rounded-xl justify-center"><Image alt="google logo"src="/images/google.png" height={20} width={20}/></button>
                    <button className="w-full flex py-3 bg-[#1E293B]/50 border border-[#06B6D4]/20 rounded-xl justify-center"><Image className="" alt="github logo" src="/images/github.png" height={20} width={20}/></button>
                </div>
            </div>
            <div className="flex items-center gap-2 m-auto">
                <span className="text-sm text-slate-500">Dont't have an account?</span>
                <span onClick={() => setActiveTab("Sign Out")} className="text-cyan-400 hover:text-cyan-300 text-[14px]">Sign Up</span>
            </div>
        </div>
    </div>
}