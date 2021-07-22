import React from 'react'
import { useHistory } from 'react-router-dom'
import logo from './../../Resources/Unified Club Portal.png'
import './TitleLogo.css'


const TitleLogo = () => {

    let history = useHistory();

    const handleLogoClick = () => {
        history.push('/');
    }

    return (
        <div className='logo-wrapper' onClick={handleLogoClick}>
            <div className="logo-image">
            <img src={logo} alt='Unified Club Portal'>
            </img>
            </div>
            <h2 className='logo-text'>
                Unified Club Portal
            </h2>
        </div>
    )
}

export default TitleLogo
