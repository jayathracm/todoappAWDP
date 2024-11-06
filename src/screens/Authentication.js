import { Link,useNavigate } from "react-router-dom";
import "./Authentication.css";
import React from "react";
import { useUser } from "../context/useUser.js";
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
                <h3>{ authenticationMode === AuthenticationMode.Login ? 'Sign In' : 'Sign Up'}</h3>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div>
                        <label>Email</label>
                        <input 
                        type="email" 
                        name="email"
                        value={user.email}
                        onChange={e => setUser({...user, email: e.target.value})}
                         />
                    </div>
                    <div>
                        <label>Password</label>
                        <input 
                        type="password" 
                        name="password" 
                        value={user.password}
                        onChange={e => setUser({...user, password: e.target.value})}
                        />
                    </div>
                    <div>
                        <button className='btn'>{authenticationMode === AuthenticationMode.Login ? 'Login' : 'Submit'}</button>
                    </div>
                    <div className='Link-txt'>
                        <Link to={authenticationMode === AuthenticationMode.Login ? '../signup' : '../signin'}>
                            {authenticationMode === AuthenticationMode.Login ? 'No account? Sign Up' : 'Already Signed Up? Sign In'}
                        </Link>
                    </div>
                </form>
        
            </div>
          )
        }