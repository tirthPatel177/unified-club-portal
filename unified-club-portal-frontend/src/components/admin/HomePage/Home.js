import React from 'react'
import { useSelector } from 'react-redux'
import Logout from './../../Auth/Logout'

const AdminHome = () => {
    const user = useSelector(state => state.user)
    return (
        <div>
            <p>{ user.email }</p>
            <p> { user.type_of_user } </p>
            <Logout />
        </div>
    )
}

export default AdminHome
