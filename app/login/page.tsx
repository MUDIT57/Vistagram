"use client"
import { JSX, useEffect, useState } from "react"
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { User, SignUpErrors, SignInErrors } from "../type/auth";
import { uploadUsers } from "@/scripts/uploadUsers";
import { redirect } from "next/navigation";
import { firebaseService } from "@/services/firebaseService";

export default function Login() {

    const [activeTab, setActiveTab] = useState<string>("Sign In");
    const [hidePassword, setHidePassword] = useState<boolean>(true);
    const [hideConfirmedPassword, setHideConfirmedPassword] = useState<boolean>(true);
    const [signUpEmail, setSignUpEmail] = useState<string>("");
    const [signUpPassword, setSignUpPassword] = useState<string>("");
    const [signUpUserName, setsignUpUserName] = useState<string>("");
    const [signUpconfirmPassword, setSignUpconfirmPassword] = useState<string>("");
    const [signInPassword, setSignInPassword] = useState<string>("");
    const [signInEmailOrUsername, setSignInEmailOrUsername] = useState<string>("");
    const [users, setUsers] = useState<User[]>([]);
    const [signUpErrors, setSignUpErrors] = useState<SignUpErrors>({
        emailError: "",
        passwordError: "",
        userNameError: "",
        confirmPasswordError: ""
    })
    const [signInErrors, setSignInErrors] = useState<SignInErrors>({
        usernameOrEmailError: "",
        passwordError: "",
    })

    const toggleHidePassword = () => setHidePassword(hidePassword => !hidePassword)
    const toggleHideConfirmedPassword = () => setHideConfirmedPassword(hideComfirmedPassword => !hideComfirmedPassword)
    const isSignInTabSelected = () => activeTab === "Sign In";

    useEffect(() => {
        const init = async () => {
            await uploadUsers();
            await getUsers();
        }
        init();
    }, [])

    const getUsers = async () => {
        const data = await firebaseService.getAll<User>("users");
        setUsers(data);
    }

    const handleSignUpReset = () => {
        setSignUpErrors(() => ({
            emailError: "",
            passwordError: "",
            userNameError: "",
            confirmPasswordError: ""
        }))
    }

    const handleSignInReset = () => {
        setSignInErrors(() => ({
            usernameOrEmailError: "",
            passwordError: "",
        }))
    }

    const isValidCredentials = (): [boolean, boolean] => {
        let [isUsernameOrEmailValid, isPasswordValid] = [false, false];
        for (const user of users) {
            if (user.email === signInEmailOrUsername)
                isUsernameOrEmailValid = true;
            if (user.password === signInPassword)
                isPasswordValid = true;
            if (user.userName === signInEmailOrUsername)
                isUsernameOrEmailValid = true;
        }
        return [isUsernameOrEmailValid, isPasswordValid];
    }

    const handleSignIn = () => {
        handleSignInReset();
        if (signInEmailOrUsername.length === 0 || signInPassword.length === 0) {
            if (signInEmailOrUsername.length === 0) {
                setSignInErrors((errors) => { return { ...errors, usernameOrEmailError: "Please enter your username or email" } });
            }
            if (signInPassword.length === 0) {
                setSignInErrors((errors) => { return { ...errors, passwordError: "Please enter your password" } });
            }
            return;
        }
        const [isUsernameOrEmailValid, isPasswordValid] = isValidCredentials();
        if (!isUsernameOrEmailValid)
            setSignInErrors((errors) => { return { ...errors, usernameOrEmailError: "Email does not exist" } });
        else if (!isPasswordValid)
            setSignInErrors((errors) => { return { ...errors, passwordError: "The password you entered is incorrect" } });
        else
            redirect("/feeds");
    }

    const handleSignOut = () => {
        handleSignUpReset();
        if (signUpEmail.length === 0 || signUpPassword.length === 0 || signUpUserName.length === 0 || signUpconfirmPassword.length === 0) {
            if (signUpEmail.length === 0) {
                setSignUpErrors((errors) => { return { ...errors, emailError: "Please enter your email" } });
            }
            if (signUpPassword.length === 0) {
                setSignUpErrors((errors) => { return { ...errors, passwordError: "Please enter your password" } });
            }
            if (signUpUserName.length === 0) {
                setSignUpErrors((errors) => { return { ...errors, userNameError: "Please enter your username" } });
            }
            if (signUpconfirmPassword.length === 0) {
                setSignUpErrors((errors) => { return { ...errors, confirmPasswordError: "Please re-enter your password" } });
            }
            return;
        }
        if (signUpPassword === signUpconfirmPassword)
            firebaseService.add("users", { email: signUpEmail, password: signUpPassword, userName: signUpUserName } as User)
    }

    function SignIn(): JSX.Element {
        return <div className="gap-6 flex flex-col">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <span className="text-sm text-[#CBD5E1]">Username or Email</span>
                    <div className="flex border border-slate-700 bg-[#1E293B]/50 rounded-lg items-center pl-4">
                        <Mail className="text-[#64748B]" size={22} />
                        <input value={signInEmailOrUsername} onChange={(e) => setSignInEmailOrUsername(e.target.value)} placeholder="Enter your username or email" className="w-full placeholder:text-[#64748B] text-white border border-none  p-3 px-4 focus:outline-none" />
                    </div>
                    <span className="text-red-500">{signInErrors.usernameOrEmailError}</span>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-sm text-[#CBD5E1]">Password</span>
                    <div className="flex border border-slate-700 bg-[#1E293B]/50 rounded-lg items-center px-4">
                        <Lock className="text-[#64748B]" size={22} />
                        <input value={signInPassword} onChange={(e) => setSignInPassword(e.target.value)} placeholder="Enter your password" className="w-full placeholder:text-[#64748B] text-white border border-none  p-3 px-4 focus:outline-none" />
                        <div onClick={() => toggleHidePassword()}>
                            {hidePassword ? <EyeOff className="text-[#64748B]" size={22} /> : <Eye className="text-[#64748B]" size={22} />}
                        </div>
                    </div>
                    <span className="text-red-500">{signInErrors.passwordError}</span>
                </div>
            </div>
            <div className="flex justify-between">
                <div className="flex items-center gap-1.5">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-slate-400 text-sm">Remember me</span>
                </div>
                <span className="text-sm text-cyan-400 hover:text-cyan-300 cursor-pointer">Forgot Password?</span>
            </div>
            <button onClick={() => handleSignIn()} className={`cursor-pointer py-3 px-12 rounded-xl font-bold text-lg text-white bg-linear-to-r from-[#06B6D4] to-[#3B82F6] hover:shadow-md hover:scale-105 duration-200 shadow-[#06B6D4]/50`}>Sign In</button>

        </div>;
    }

    function SignOut(): JSX.Element {
        return <div className="gap-6 flex flex-col">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <span className="text-sm text-[#CBD5E1]">Username</span>
                    <input value={signUpUserName} onChange={(e) => setsignUpUserName(e.target.value)} placeholder="Enter your username" className="bg-[#1E293B]/50 placeholder:text-[#64748B] text-white border border-slate-700 rounded-lg p-3 px-4" />
                    <span className="text-red-500">{signUpErrors.userNameError}</span>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-sm text-[#CBD5E1]">Email</span>
                    <div className="flex border border-slate-700 bg-[#1E293B]/50 rounded-lg items-center px-4">
                        <Mail className="text-[#64748B]" size={22} />
                        <input value={signUpEmail} onChange={(e) => setSignUpEmail(e.target.value)} placeholder="Enter your email" className="w-full  placeholder:text-[#64748B] text-white border border-none  p-3 px-4 focus:outline-none" />
                    </div>
                    <span className="text-red-500">{signUpErrors.emailError}</span>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-sm text-[#CBD5E1]">Password</span>
                    <div className="flex border border-slate-700 bg-[#1E293B]/50 rounded-lg items-center px-4">
                        <Lock className="text-[#64748B]" size={22} />
                        <input value={signUpPassword} onChange={(e) => setSignUpPassword(e.target.value)} placeholder="Enter your password" className="w-full  placeholder:text-[#64748B] text-white border border-none  p-3 px-4 focus:outline-none" />
                        <div onClick={() => toggleHidePassword()}>
                            {hidePassword ? <EyeOff className="text-[#64748B]" size={22} /> : <Eye className="text-[#64748B]" size={22} />}
                        </div>
                    </div>
                    <span className="text-red-500">{signUpErrors.passwordError}</span>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-sm text-[#CBD5E1]">Confirm Password</span>
                    <div className="flex border border-slate-700 bg-[#1E293B]/50 rounded-lg items-center px-4">
                        <Lock className="text-[#64748B]" size={22} />
                        <input value={signUpconfirmPassword} onChange={(e) => setSignUpconfirmPassword(e.target.value)} placeholder="Confirm your password" className="w-full  placeholder:text-[#64748B] text-white border border-none  p-3 px-4 focus:outline-none" />
                        <div onClick={() => toggleHideConfirmedPassword()}>
                            {hideConfirmedPassword ? <EyeOff className="text-[#64748B]" size={22} /> : <Eye className="text-[#64748B]" size={22} />}
                        </div>
                    </div>
                    <span className="text-red-500">{signUpErrors.confirmPasswordError}</span>
                </div>
            </div>
            <button onClick={() => handleSignOut()} className={`cursor-pointer py-3 px-12 rounded-xl font-bold text-lg text-white bg-linear-to-r from-[#06B6D4] to-[#3B82F6] hover:shadow-md hover:scale-105 duration-200 shadow-[#06B6D4]/50`}>Create Account</button>

        </div>
    }

    return <div className="h-screen w-screen bg-linear-to-r from-slate-950 via-blue-950 to-slate-950 flex overflow-scroll">
        <div className="m-auto gap-5 flex flex-col">
            <div className="flex flex-col justify-center items-center">
                <span className="text-[50px] font-bold bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Vistagram</span>
                <span className="text-[#94A3B8] text-[16px]">Discover & Share Points of Interest</span>
            </div>
            <div className="flex flex-col gap-6 bg-[#0F172A]/50 border border-[#06B6D4]/20 rounded-3xl p-8">
                <div className="bg-[#1E293B]/50 flex gap-10 rounded-xl">
                    <button onClick={() => setActiveTab("Sign In")} className={`cursor-pointer py-3 px-12 rounded-xl text-[#94A3B8] font-bold text-lg ${isSignInTabSelected() ? "text-white bg-linear-to-r from-[#06B6D4] to-[#3B82F6] shadow-md shadow-[#06B6D4]/50" : ""}`}>Sign In</button>
                    <button onClick={() => setActiveTab("Sign Out")} className={`cursor-pointer py-3 px-12 rounded-xl text-[#94A3B8] font-bold text-lg ${!isSignInTabSelected() ? "text-white bg-linear-to-r from-[#06B6D4] to-[#3B82F6] shadow-md shadow-[#06B6D4]/50" : ""}`}>Sign Up</button>
                </div>
                {
                    activeTab === "Sign In" ? <SignIn /> : <SignOut />
                }
                <div className="flex items-center gap-3">
                    <div className="bg-slate-700 h-px w-full"></div>
                    <span className="text-sm whitespace-nowrap text-slate-500">Or continue with</span>
                    <div className="bg-slate-700 h-px w-full"></div>
                </div>
                <button className="cursor-pointer w-full flex py-3 bg-[#1E293B]/50 border border-[#06B6D4]/20 rounded-xl justify-center"><Image alt="google logo" src="/images/google.png" height={20} width={20} /></button>
            </div>
        </div>
    </div>
}

