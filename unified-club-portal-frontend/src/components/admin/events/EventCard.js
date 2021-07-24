import React from 'react'
import Button from '@material-ui/core/Button';
import './EventCard.css'

const EventCard = ({event}) => {

    return (
        <div className="card_event">
            <a className="card-links" href={'/admin/events/'+ event.id_event}>
            <img src={event.poster} width="100%" height="300px" className="poster_event"/>
            <div className="data_event">
                <div className="card-event-club">
                    <img src={event.poster} className="club_profile_pic"/>
                    <span className="club_name_event">{event.club_name}</span>
                </div>
                <span className="card-event-title">{event.event_title}</span>
                <span className="card-event-date">{event.date.split('T').join(' ')}</span>
            </div>
            </a>
            <div className='center-response'>
            <Button variant="contained" 
            color={event.approved === 0 ? "default" : event.approved === 1 ? "primary" : "secondary"}
            // disabled
            >
  
                    {
                        event.approved === 0 ? "Pending" : event.approved === 1 ? "Approved" : "Disapproved"
                    }
            </Button>
            </div>
        </div>
    )
} 

export default EventCard
