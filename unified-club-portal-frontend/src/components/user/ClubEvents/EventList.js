import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import Navbar from '../NavBar/Navbar'
import EventCard from './../events/EventCard';
import Header from './../clubs_profile/header/index'

const EventList = () => {

    // const user = useSelector(state => state.user)
    const [events, setEvents] = useState([]);
    let {club} = useParams();

    const get_events = async () => {
        fetch(`http://127.0.0.1:8000/api/club/events/${club}`, {
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

                <Header />

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

export default EventList