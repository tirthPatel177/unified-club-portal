import React from 'react'
import Button from '@material-ui/core/Button';
import './EventsNav.css'

import { useMediaQuery } from 'react-responsive'



const EventsNav = (props) => {

    const isMobile = useMediaQuery({ query: '(max-width: 450px)' })

    return (
        <div className='events-nav'>
            <div className='three-button'>
            <Button color="primary"
                size={isMobile ? 'small' : 'medium'}
                style={{width: '100%'}}
                onClick={() => props.setactive('details')}
                >Details
            </Button>
            </div>
            <div className='three-button'>
            <Button color="primary"
                size={isMobile ? 'small' : 'medium'}
                style={{width: '100%'}}
                onClick={() => props.setactive('update')}
                >Update
            </Button>
            </div>
            <div className='three-button'>
            <Button color="primary"
                size={isMobile ? 'small' : 'medium'}
                style={{width: '100%'}}
                onClick={() => props.setactive('checkin')}
                >Check-in
            </Button>
            </div>
        </div>
    )
}

export default EventsNav
