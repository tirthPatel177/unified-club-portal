import React, {useState, useEffect} from 'react'
import Navbar from './../Navbar/Navbar';
import EventCard from './EventCard';

const Events = () => {
    const [events, setEvents] = useState([]);

    

    const get_events = async () => {
        fetch('http://localhost:8000/api/club/events_all_admin', {
            method : 'GET'
        }).then(
            data => data.json()
        ).then(data => {
            setEvents(data);
            console.log(data);
        })
    };

    useEffect(() => {
        get_events();
    }, [])
    

    return (
        <div>
            <Navbar />
            <div>
                    {
                        events.map( event => 
                            {
                                return <EventCard event={event} key={event.id_event}/>
                            }
                        )
                    }
                </div>
        </div>
    )
}

export default Events
