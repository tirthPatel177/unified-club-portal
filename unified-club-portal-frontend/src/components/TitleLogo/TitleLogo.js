import React from 'react'
import logo from './../../Resources/Unified Club Portal.png'
import './TitleLogo.css'

const TitleLogo = () => {
    return (
        <div className='logo-wrapper'>
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
