import React from 'react'
import './CheckIn.css'
import {useEffect} from 'react'

const CheckIn = (props) => {

    useEffect(() => {
        console.log(`${props.checkin.first_name} ${props.checkin.last_name}`)
    },[])

    return (
        <div className='checkin-container'>
            <p>
                {`${props.checkin.first_name} ${props.checkin.last_name}`}
            </p>
        </div>
    )
}

export default CheckIn
