import React from 'react'
import { useSelector } from 'react-redux'


const NormalHome = () => {
    const user = useSelector(state => state.user)
    return (
        <div>
            <p> { user.email }</p>
            <p> { user.type_of_user } </p>
        </div>
    )
}

export default NormalHome
