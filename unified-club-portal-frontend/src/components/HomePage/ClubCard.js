import React from 'react'

const ClubCard = (props) => {
    return (
        <div className='club-card'>
            <h2>{props.clubDetails.title}</h2>
        </div>
    )
}

export default ClubCard
