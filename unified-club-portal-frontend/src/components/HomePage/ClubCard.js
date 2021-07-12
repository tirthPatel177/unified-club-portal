import React from 'react'
import './ClubCard.css'
import profile from './../../Resources/club-profile.jpg'

const ClubCard = ({club}) => {

    const get_title = (title) => {
        console.log(title);
        return title.split(' ').join('-');
    }

    return (
        <div className='club-card'>
            <a href={'/club-profiles/' + get_title(club.title)}> 
            <div className='image-container'>
                <img src={club.profile} className='profile-image'/>
            </div>
            <div className='title-container'>
            <h3>{club.title}</h3>
            </div>
            
            
            {/* <p>{club.description}</p> */}
            </a>
        </div>
    )
}

export default ClubCard
