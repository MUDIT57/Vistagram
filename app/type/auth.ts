export type User={
    id:string;
    userName:string;
    email:string;
    theme:string;
    avatar:string;
    followerCount:number;
    followingCount:number;
    postCount:number;
}

export type FollowEntry={
    userName:string;
}

export type SignUpErrors={
    emailError:string;
    passwordError:string;
    userNameError:string;
    confirmPasswordError:string;
}

export type SignInErrors={
    usernameOrEmailError:string;
    passwordError:string;
}