import React, {useState} from 'react'
import './Login.css';
import logo from '../../logo/Unified Club Portal.png';
import {handleLogin, handleSignup} from './handleSubmit';

function Login() {
    const [activeLogin, setActiveLogin] = useState(true);

    // useEffect(
    //     ()=>{
    //         console.log(activeLogin);
    //     }
    // );

    const changethestate = (e) => {
        e.preventDefault();
        setActiveLogin(!activeLogin);
    };

    const LoginForm = () => {
        return (
            <>
            <form>
                <div className="form-input">
                    <label>
                        Email
                    </label>
                    <input type="email" placeholder="xyz@gmail.com">
                    </input>
                </div>
                <div className="form-input">
                    <label>
                        Password
                    </label>
                    <input type="password">
                    </input>
                </div>
                <button type='submit' onClick={handleLogin}>
                    Login
                </button>
            </form>
            <p>
                Don't have an account? {" "}
                <a onClick={changethestate} href="#"> SignUp</a>
            </p>
            </>
        )
    };

    const SignupForm = () => {
        return (
            <>
            <form>
                <div className="form-input">
                    <label>
                        First Name
                    </label>
                    <input type="text" placeholder="First Name">
                    </input>
                </div>
                <div className="form-input">
                    <label>
                        Last Name
                    </label>
                    <input type="text" placeholder="Last Name">
                    </input>
                </div>
                <div className="form-input">
                    <label>
                        Email
                    </label>
                    <input type="email" placeholder="xyz@gmail.com">
                    </input>
                </div>
                <div className="form-input">
                    <label>
                        Password
                    </label>
                    <input type="password">
                    </input>
                </div>
                <button type='submit' onClick={handleSignup}>
                    Sign Up
                </button>
            </form>
            <p>
                Already have an account? {" "}
                <a onClick={changethestate} href='#'> Login </a>
            </p>
            </>
        )
    };
    

    return (
        <div className='Login'>
            <div className='login_card'>
                <header>
                    <img src={logo} alt='unified club portal' className='logo'/>
                    <h1>Unified Club Portal</h1>
                </header>
                {!activeLogin ? 
                <SignupForm /> : <LoginForm />
                }
            </div>
        </div>
    )
}

export default Login;
