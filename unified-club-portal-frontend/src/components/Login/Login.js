import React, {useState, useEffect} from 'react'
import './Login.css';
import logo from '../../logo/Unified Club Portal.png';
import {handleLogin, handleSignup} from './handleSubmit';

function Login() {
    const [activeLogin, setActiveLogin] = useState(true);
    // const [emailLogin, setEmailLogin] = useState('');
    // const [passwordLogin, setPasswordLogin] = useState('');
    // const [firstnameSignup, setFirstnameSignup] = useState('');
    // const [lastnameSignup, setLastnameSignup] = useState('');
    // const [emailSignup, setEmailSignup] = useState('');
    // const [passwordSignup, setPasswordSignup] = useState('');
    // const [password1, setPassword1] = useState('');

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
            // console.log(Display);
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

    const handleLogin = () => {

    };

    const handleSignup = () => {

    };


    const changethestate = (e) => {
        e.preventDefault();
        console.log("changing the state");
        setActiveLogin(!activeLogin);
    };

    // const LoginForm = () => {
    //     return (
    //         <>
    //         <h2 className="login-message">Welcome Back!</h2>
    //         <form>
    //             <input type="email" id="emailLogin" placeholder="Email" onChange={(e) => {setEmailLogin(e.target.value)}} name="email" value={emailLogin || ''} />
                
    //             <input type="password" id="passwordLogin" placeholder="Password" onChange={(e)=> {setPasswordLogin(e.target.value)}} name="password" value={passwordLogin || ''} />

    //             <button type='submit' onClick={handleLogin}>
    //                 Login
    //             </button>
    //         </form>
    //         <p>
    //             Don't have an account? {" "}
    //             <a onClick={changethestate} href="#"> SignUp</a>
    //         </p>
    //         </>
    //     )
    // };

    // const SignupForm = () => {
    //     return (
    //         <>
    //         <h2 className="login-message">Create an account</h2>
    //         <form>
            
    //             <input type="text" placeholder="First Name" id='firstname' onChange={(e)=>setFirstnameSignup(e.target.value)} name="firstname" value={firstnameSignup || ''}>
    //             </input>
            
            
    //             <input type="text" placeholder="Last Name" id='lastname' onChange={(e) => setLastnameSignup(e.target.value)} name="lastname" value={lastnameSignup || ''}>
    //             </input>
            
            
    //             <input type="email" placeholder="Email" id='emailSignup' onChange={(e) => setEmailSignup(e.target.value)} name="email" value={emailSignup || ''}>
    //             </input>
            
            
    //             <input type="password" placeholder="Password" id="password" onChange={(e) => setPasswordSignup(e.target.value)} name="password" value={passwordSignup || ''}>
    //             </input>

    //             <input type="password" placeholder="Enter Password Again" id='password1' onChange={(e) => setPassword1(e.target.value)} name="password1" value={password1 || ''}>
    //             </input>

    //             <button type='submit' onClick={handleSignup}>
    //                 Sign Up
    //             </button>
    //         </form>
    //         <p>
    //             Already have an account? {" "}
    //             <a onClick={changethestate} href='#'> Login </a>
    //         </p>
    //         </>
    //     )
    // };
    
    // const Display = () => {
    //     if(activeLogin){
    //         return <LoginForm />
    //     }
    //     return <SignupForm />
    // }

    return (
        <div className='Login'>
            <div className='login_card'>
                <header>
                    <img src={logo} alt='unified club portal' className='logo'/>
                    <h1>Unified Club Portal</h1>
                </header>
                {/* { Display() } */}
                {
                    activeLogin ?
                        <>
                    <h2 className="login-message">Welcome Back!</h2>
                    <form>
                        <input type="email" id="emailLogin" placeholder="Email" onChange={handleChange} name="email" value={loginData.email || ''} />
                        
                        <input type="password" id="passwordLogin" placeholder="Password" onChange={handleChange} name="password" value={loginData.password || ''} />
                        <button type='submit' onClick={handleLogin}>
                            Login
                        </button>
                    </form>
                    <p>
                        Don't have an account? {" "}
                        <a onClick={changethestate} href="#"> SignUp</a>
                    </p>
                    </>
                    :
                    <>
                    <h2 className="login-message">Create an account</h2>
                    <form>
                        <input type="text" placeholder="First Name" id='firstname' onChange={handleChange} name="firstname" value={registerData.firstname || ''} />
                        <input type="text" placeholder="Last Name" id='lastname' onChange={handleChange} name="lastname" value={registerData.lastname || ''} />
                        <input type="email" placeholder="Email" id='emailSignup' onChange={handleChange} name="email" value={registerData.email || ''} />
                        <input type="password" placeholder="Password" id="password" onChange={handleChange} name="password" value={registerData.password || ''} />
                        <input type="password" placeholder="Enter Password Again" id='password1' onChange={handleChange} name="password1" value={registerData.password1 || ''} />
                        <button type='submit' onClick={handleSignup}>
                            Sign Up
                        </button>
                    </form>
                    <p>
                        Already have an account? {" "}
                        <a onClick={changethestate} href='#'> Login </a>
                    </p>
                    </>
                }
            </div>
        </div>
    )
}

export default Login;
