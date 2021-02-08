import { Button } from '@material-ui/core';
import React from 'react'
import './Login.css';
import { auth, provider } from '../../firebase/firebase';

function Login() {

    const signInWithGoogle = () => {
        auth.signInWithPopup(provider)
        .catch((error) => {
            console.log('Error: ' + error.message);
        })
    }

    return (
        <div className="login">
            <div className="login__container">
                <div className="login__logo"></div>
                <h1 className="login__heading"> OctoNet</h1>
                <Button  className="login__button" onClick = { signInWithGoogle }> 
                    <img height="20" src="./google-icon.svg" alt=""/>  Sign In with google
                </Button>
                <Button  className="login__button" > 
                    <img height="20" src="./twitter-logo.png" alt=""/>  Sign In with twitter
                </Button>
                <Button  className="login__button" > 
                    <img height="20" src="./github-icon.png" alt=""/>  Sign In with github
                </Button>
            </div>
        </div>
    )
}

export default Login
