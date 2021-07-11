import React, {useState} from 'react'
import './Login.css';
import logo from '../../Resources/Unified Club Portal.png';
// import {handleLogin, handleSignup} from './handleSubmit';
import Alert from "@material-ui/lab/Alert";
import {useDispatch, useSelector} from 'react-redux';
import * as actions from '../../Helpers/actions/actionTypes'
import { Redirect } from 'react-router-dom';

function Login(props) {
    const [activeLogin, setActiveLogin] = useState(true);
    const [password1, setPassword1] = useState('');
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const type_of_user = useSelector(state => state.type_of_user)

    const [registerData, setRegisterData] = useState({
        first_name: '', 
        last_name: '',
        email: '',
        password: '',
        type_of_user: "user"
    });

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });



    // useEffect(
    //     ()=>{
    //         // console.log(props.setUser)
    //         console.log("Login", loginData);
    //         console.log('Signup', registerData);
    //         console.log("password1", password1);
    //     }
    // );

    const handleChange = (e) => {
        e.preventDefault();
        const changename= e.target.name;
        const changevalue = e.target.value;
        // console.log(changename, changevalue, activeLogin);
        if(activeLogin){
            setLoginData({...loginData, [changename]: changevalue});
        }else{
            setRegisterData({...registerData, [changename]: changevalue});
        }
    };

    // Temporary
    const fetchdetails = async (token) => {
        let formData = new FormData();
        formData.append("key", token);
        fetch('http://localhost:8000/api/get_info', {
            method: "POST",
            body: formData
        }).then( data => data.json()).then(
            data => {
                dispatch({type: actions.USER_LOGGGED_IN, payload: data})
                dispatch({type: actions.SET_USER_TYPE, payload: data.type_of_user})
                // props.setUser(data.type_of_user)
                
            }
        ).catch(e => console.log(e))
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        fetch('http://localhost:8000/api/login',{
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(loginData)
        })
        .then( data => data.json())
        .then(
            data => {
                if(data.token){
                    // console.log(data.token);
                localStorage.setItem('token', data.token);
                // dispatch({type: actions.USER_LOGGGED_IN, payload: })
                fetchdetails(data.token);
                // props.setUser(data.token);
                // console.log("hello", props.user);
                }
                else{
                    // setError(...data)
                    console.log(data)
                    let errorType = Object.keys(data);
                    if(errorType[0] === 'detail'){
                        setError(()=>{
                            let msg = 'User ' + data[errorType[0]]
                            setError(msg);
                        })
                    }else{
                        setError(data[errorType[0]]);
                    }
                    
                }

            }
        ).catch( error => {
            console.log(error[1])
            setError(error)})
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if(password1 !== registerData.password){
            // Create UI For this
            console.log("Passwords are not matching!");
            return;
        }
        fetch('http://localhost:8000/api/users',{
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(registerData)
        }).then( data => data.json()).then(
            data => {console.log(data)
            let errorType = Object.keys(data);
            console.log(errorType[0], errorType);
                // alert(data[errorType[0]])
                setError(data[errorType[0]]);
            }
        ) 
        setActiveLogin(!activeLogin);
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
            
    //             <input type="text" placeholder="First Name" id='first_name' onChange={(e)=>setFirstnameSignup(e.target.value)} name="first_name" value={firstnameSignup || ''}>
    //             </input>
            
            
    //             <input type="text" placeholder="Last Name" id='last_name' onChange={(e) => setLastnameSignup(e.target.value)} name="last_name" value={lastnameSignup || ''}>
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
            { type_of_user ? (<Redirect to='/' />) : null  }
            {
                error ? 
                    <Alert severity="warning" onClose={()=> setError('')}>{ error }</Alert> : null
            }
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
                        <button type='submit' onClick={handleLogin} className="login-signup">
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
                        <input type="text" placeholder="First Name" id='first_name' onChange={handleChange} name="first_name" value={registerData.first_name || ''} />
                        <input type="text" placeholder="Last Name" id='last_name' onChange={handleChange} name="last_name" value={registerData.last_name || ''} />
                        <input type="email" placeholder="Email" id='emailSignup' onChange={handleChange} name="email" value={registerData.email || ''} />
                        <input type="password" placeholder="Password" id="password" onChange={handleChange} name="password" value={registerData.password || ''} />
                        <input type="password" placeholder="Enter Password Again" id='password1' onChange={(e)=>{setPassword1(e.target.value)}} name="password1" value={password1 || ''} />
                        <button type='submit' onClick={handleSignup} className="login-signup">
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
