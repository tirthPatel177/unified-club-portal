import React, {useState, useEffect} from 'react'
import Navbar from '../NavBar/Navbar'
import EventCard from './EventCard';
import './Events.css'

const Events = () => {

    // const user = useSelector(state => state.user)
    const [events, setEvents] = useState([]);

    const get_events = async () => {
        fetch('http://127.0.0.1:8000/api/club/events_all', {
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
                <div className='user-main-events-list'>
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
        </div>
    )
}

export default Events
