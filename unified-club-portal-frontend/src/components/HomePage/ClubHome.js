import React from 'react'
import { useSelector } from 'react-redux'
// import { useParams } from 'react-router-dom'
import ClubProfile from '../clubs_profile/ClubProfile'
import Navbar from '../NavBar/Navbar'

const ClubHome = () => {
    const user = useSelector(state => state.user)
    // const {club} = useParams();
    
    return (
        <div>
                <Navbar />
                {/* <p> { user.first_name } </p>
                <p> { user.type_of_user } </p> */}
                {/* <ClubProfile /> */}
                <h1>First Page a Club will see after they login</h1>
            
        </div>
    )
}

export default ClubHome
