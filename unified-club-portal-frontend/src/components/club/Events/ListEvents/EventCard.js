import React from 'react'
import './EventCard.css'

const EventCard = ({event}) => {

    return (
        <div className="card_event">
            <a className="card-links" href={'/club/events/'+ event.id_event}>
            <img src={event.poster} alt='poster' width="100%" height="300px" className="poster_event"/>
            <div className="data_event">
                <div className="card-event-club">
                    <img src={event.profile_pic} alt='profile' className="club_profile_pic"/>
                    <span className="club_name_event">{event.club_name}</span>
                </div>
                <span className="card-event-title">{event.event_title}</span>
                <span className="card-event-date">{event.date.split('T').join(' ')}</span>
            </div>
            </a>
            
        </div>
    )
} 


export default EventCard