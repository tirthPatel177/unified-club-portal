import React from 'react'
import './Edit.css'

const Edit = ({edit, setEdit}) => {
    const handleClick = () => {
        setEdit(!edit);
    }

    return (
        <div>
            <button onClick={handleClick} className="club-edit-button">
                {
                    edit ? 'Profile' : 'Edit Profile'
                }
            </button>
        </div>
    )
}

export default Edit
