import React from 'react'
import './Login.css';
import logo from '../../logo/Unified Club Portal.png'

function Login() {
    return (
        <div className='Login'>
            <div className='login_card'>
                <header>
                    <img src={logo} alt='unified club portal' className='logo'/>
                </header>
            </div>
        </div>
    )
}

export default Login;
