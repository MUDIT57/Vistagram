"use client";
import { JSX, useState } from "react";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { CustomInput } from "@/components/customInput";

function SignIn(): JSX.Element {
    const [signInPassword, setSignInPassword] = useState<string>("");
    const [signInEmailOrUsername, setSignInEmailOrUsername] =
        useState<string>("");
    const [hidePassword, setHidePassword] = useState<boolean>(true);
    const toggleHidePassword = () =>
        setHidePassword((hidePassword) => !hidePassword);
    const router = useRouter();
    const { logIn, error } = useAuth();

    const handleSignIn = async () => {
        try {
            await logIn(signInEmailOrUsername, signInPassword);
            router.push("/feeds");
        } catch (e) {
            console.log("Error in Sign In");
        }
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleSignIn();
            }}
            className="flex flex-col gap-4"
        >
            <CustomInput
                type="text"
                isRequired={true}
                text="Username"
                value={signInEmailOrUsername}
                onChange={(e) => setSignInEmailOrUsername(e.target.value)}
                placeholder="Enter your username or email"
            />
            <CustomInput
                onIconClick={toggleHidePassword}
                leftIcon={<Lock size={22} />}
                rightIcon={hidePassword ? <EyeOff size={22} /> : <Eye size={22} />}
                type={hidePassword ? "password" : ""}
                isRequired={true}
                text="Password"
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
                placeholder="Enter your password"
            />
            {error && (
                <span className="m-auto animate-horizontal-shaking text-red-500">
                    {error}
                </span>
            )}
            <button
                type="submit"
                className={`cursor-pointer py-3 px-12 rounded-xl font-bold text-lg text-white bg-linear-to-r from-[#06B6D4] to-[#3B82F6] hover:shadow-md hover:scale-105 duration-200 shadow-[#06B6D4]/50`}
            >
                Sign In
            </button>
        </form>
    );
}

function SignUp(): JSX.Element {
    const [hideConfirmedPassword, setHideConfirmedPassword] =
        useState<boolean>(true);
    const toggleHideConfirmedPassword = () =>
        setHideConfirmedPassword((hideComfirmedPassword) => !hideComfirmedPassword);
    const [signUpEmail, setSignUpEmail] = useState<string>("");
    const [signUpPassword, setSignUpPassword] = useState<string>("");
    const [signUpconfirmPassword, setSignUpconfirmPassword] =
        useState<string>("");
    const [signUpUserName, setsignUpUserName] = useState<string>("");
    const [hidePassword, setHidePassword] = useState<boolean>(true);
    const toggleHidePassword = () =>
        setHidePassword((hidePassword) => !hidePassword);
    const { signUp, error } = useAuth();

    const handleSignUp = async () => {
        try {
            await signUp(signUpEmail, signUpPassword, signUpUserName);
        } catch {
            console.log("Error in Sign Up");
        }
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleSignUp();
            }}
            className="flex flex-col gap-4"
        >
            <CustomInput
                type="text"
                isRequired={true}
                text="Username"
                value={signUpUserName}
                onChange={(e) => setsignUpUserName(e.target.value)}
                placeholder="Enter your username"
            />
            <CustomInput
                leftIcon={<Mail size={22} />}
                type="email"
                isRequired={true}
                text="Email"
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
                placeholder="Enter your email"
            />
            <CustomInput
                onIconClick={toggleHidePassword}
                leftIcon={<Lock size={22} />}
                rightIcon={hidePassword ? <EyeOff size={22} /> : <Eye size={22} />}
                type={hidePassword ? "password" : ""}
                isRequired={true}
                text="Password"
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                placeholder="Enter your password"
            />
            <CustomInput
                onIconClick={toggleHideConfirmedPassword}
                leftIcon={<Lock size={22} />}
                rightIcon={
                    hideConfirmedPassword ? <EyeOff size={22} /> : <Eye size={22} />
                }
                type={hideConfirmedPassword ? "password" : ""}
                isRequired={true}
                text="Confirm Password"
                value={signUpconfirmPassword}
                onChange={(e) => setSignUpconfirmPassword(e.target.value)}
                placeholder="Confirm your password"
            />
            {error && (
                <span className="m-auto animate-horizontal-shaking text-red-500">
                    {error}
                </span>
            )}
            <button
                type="submit"
                className={`cursor-pointer py-3 px-12 rounded-xl font-bold text-lg text-white bg-linear-to-r from-[#06B6D4] to-[#3B82F6] hover:shadow-md hover:scale-105 duration-200 shadow-[#06B6D4]/50`}
            >
                Create Account
            </button>
        </form>
    );
}

export default function Login() {
    const [activeTab, setActiveTab] = useState<string>("Sign In");
    const isSignInTabSelected = () => activeTab === "Sign In";

    return (
        <div className="h-screen w-screen bg-linear-to-r from-slate-950 via-blue-950 to-slate-950 flex overflow-scroll">
            <div className="m-auto gap-5 flex flex-col">
                <div className="flex flex-col justify-center items-center">
                    <span className="text-[50px] font-bold bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Vistagram
                    </span>
                    <span className="text-[#94A3B8] text-[16px]">
                        Discover & Share Points of Interest
                    </span>
                </div>
                <div className="flex flex-col gap-6 bg-[#0F172A]/50 border border-[#06B6D4]/20 rounded-3xl p-8">
                    <div className="bg-[#1E293B]/50 flex gap-10 rounded-xl">
                        <button
                            onClick={() => setActiveTab("Sign In")}
                            className={`cursor-pointer py-3 px-12 rounded-xl text-[#94A3B8] font-bold text-lg ${isSignInTabSelected() ? "text-white bg-linear-to-r from-[#06B6D4] to-[#3B82F6] shadow-md shadow-[#06B6D4]/50" : ""}`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setActiveTab("Sign Out")}
                            className={`cursor-pointer py-3 px-12 rounded-xl text-[#94A3B8] font-bold text-lg ${!isSignInTabSelected() ? "text-white bg-linear-to-r from-[#06B6D4] to-[#3B82F6] shadow-md shadow-[#06B6D4]/50" : ""}`}
                        >
                            Sign Up
                        </button>
                    </div>
                    {activeTab === "Sign In" ? <SignIn /> : <SignUp />}
                    <div className="flex items-center gap-3">
                        <div className="bg-slate-700 h-px w-full"></div>
                        <span className="text-sm whitespace-nowrap text-slate-500">
                            Or continue with
                        </span>
                        <div className="bg-slate-700 h-px w-full"></div>
                    </div>
                    <button className="cursor-pointer w-full flex py-3 bg-[#1E293B]/50 border border-[#06B6D4]/20 rounded-xl justify-center">
                        <Image
                            alt="google logo"
                            src="/images/google.png"
                            height={20}
                            width={20}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}
