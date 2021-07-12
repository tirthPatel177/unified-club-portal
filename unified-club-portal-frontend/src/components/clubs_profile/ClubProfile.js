import React from 'react'
import { useParams } from 'react-router-dom'

const ClubProfile = () => {

    const {club} = useParams();

    const fetch_club_detials = () => {

    }

    return (
        <div>
            <p>{club}</p>
        </div>
    )
}

export default ClubProfile
