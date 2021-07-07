import React, {useState, useEffect} from 'react'
import './Login.css';
import logo from '../../logo/Unified Club Portal.png';
import {handleLogin, handleSignup} from './handleSubmit';

function Login() {
    const [activeLogin, setActiveLogin] = useState(true);

    const [registerData, setRegisterData] = useState({
        firstname: '', 
        lastname: '',
        email: '',
        password: '',
        password1: ''
    });

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    useEffect(
        ()=>{
            console.log("Login", loginData);
            console.log('Signup', registerData);
        }
    );

    const handleChange = (e) => {
        e.preventDefault();
        const changename= e.target.name;
        const changevalue = e.target.value;
        console.log(changename, changevalue, activeLogin);
        if(activeLogin){
            setLoginData({...loginData, [changename]: changevalue});
        }else{
            setRegisterData({...registerData, [changename]: changevalue});
        }
    };


    const changethestate = (e) => {
        e.preventDefault();
        console.log("changing the state");
        setActiveLogin(!activeLogin);
    };

    const LoginForm = () => {
        return (
            <>
            <h2 className="login-message">Welcome Back!</h2>
            <form>
                <input type="email" id="email" placeholder="Email" onChange={handleChange} name="email" value={loginData.email || ''} />
                <input type="password" id="password" placeholder="Password" onChange={handleChange} name="password" value={loginData.password || ''} />
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
            <h2 className="login-message">Create an account</h2>
            <form>
            
                <input type="text" placeholder="First Name" id='firstname' onChange={handleChange} name="firstname" value={registerData.firstname || ''}>
                </input>
            
            
                <input type="text" placeholder="Last Name" id='lastname' onChange={handleChange} name="lastname" value={registerData.lastname || ''}>
                </input>
            
            
                <input type="email" placeholder="Email" id='email' onChange={handleChange} name="email" value={registerData.email || ''}>
                </input>
            
            
                <input type="password" placeholder="Password" id="password" onChange={handleChange} name="password" value={registerData.password || ''}>
                </input>

                <input type="password" placeholder="Enter Password Again" id='password1' onChange={handleChange} name="password1" value={registerData.password1 || ''}>
                </input>

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
