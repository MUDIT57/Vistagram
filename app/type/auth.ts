export type User={
    userName:string;
    email:string;
    password:string;
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