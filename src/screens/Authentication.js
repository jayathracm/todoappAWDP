import { Link,useNavigate } from "react-router-dom";
import "./Authentication.css";
import React from "react";
import { useUser } from "../context/useUser";
import { useState } from "react"

export const AuthenticationMode = Object.freeze({
    Login: 'Login',
    Register: 'Register'
    });


export default function Authentication({authenticationMode}) {
    const { user, setUser, signUp, signIn } = useUser();
    const [email, setEmail] = useState(user.email || '');
    const Navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (authenticationMode === AuthenticationMode.Register) {
                await signUp();
                Navigate('/signin');
            } else {
                await signIn();
                Navigate('/');
            }
        }  catch (error) {
            const message = error.response && error.response.data ? error.response.data.error: error
            alert(message);
            }
        }
        return (
            <div className="auth-container">
                <h3>{authenticationMode === AuthenticationMode.Login ? "Sign in" : "Sign up"}</h3>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div>
                        <label>Email</label>
                        <input type="email"  name="email" value={email} onChange={event => { setEmail(event.target.value); setUser({...user, email: event.target.value}); }}/>
                    </div>
                    <div>
                        <label>Password</label>
                        <input type="password" name="password" value={user.password} onChange={event => setUser({...user,password: event.target.value})} />
                    </div>
                    <div>
                        <button>{authenticationMode === AuthenticationMode.Login ? "Login" : "Submit"}</button>
                    </div>
                    <div>
                        <Link to={authenticationMode === AuthenticationMode.Login ? '../signup' : '../signin'}> 
                        {authenticationMode === AuthenticationMode.Login ? "No account? Sign up" : "Already signed up? Sign in"}
                        </Link>
                    </div>
                    </form>
            </div>
        )
};