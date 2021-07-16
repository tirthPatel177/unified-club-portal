import React from 'react'
import './EventCard.css'

const EventCard = ({event}) => {

    return (
        <div className="card_event">
            <img src={event.poster} width="100%" height="300px" className="poster_event"/>
            
            <span className="card-event-title">{event.event_title}</span><br />
            <span className="card-event-date">{event.date}</span>
            
            
        </div>
    )
} 


export default EventCard