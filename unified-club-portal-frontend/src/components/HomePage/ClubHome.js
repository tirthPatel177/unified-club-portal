import React from 'react'
import { useSelector } from 'react-redux'

const ClubHome = () => {
    const user = useSelector(state => state.user)
    return (
        <div>
            <p>
                { user.email }
                <p> { user.type_of_user } </p>
            </p>
        </div>
    )
}

export default ClubHome
