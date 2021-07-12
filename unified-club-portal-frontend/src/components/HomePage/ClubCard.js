import React from 'react'
import './ClubCard.css'
import profile from './../../Resources/club-profile.jpg'

const ClubCard = ({club}) => {

    const get_title = (title) => {
        return title.split(' ').join('-');
    }

    return (
        <div className='club-card'>
            <a herf={'/club-profiles/' + get_title(club.title)}> 
            {/* <div class='image-container'>
                <img src={profile}/>
            </div> */}
            <div class='title-container'>
            <h3>{club.title}</h3>
            </div>
            
            
            {/* <p>{club.description}</p> */}
            </a>
        </div>
    )
}

export default ClubCard
