import React, {useState, useEffect} from 'react'
import Navbar from '../NavBar/Navbar'
import EventCard from './EventCard';

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
            <h2>
                This is Events Page.
                <div>
                    {
                        events.map( event => 
                            {
                                return <EventCard event={event} key={event.event_title}/>
                            }
                        )
                    }
                </div>
            </h2>
        </div>
    )
}

export default Events