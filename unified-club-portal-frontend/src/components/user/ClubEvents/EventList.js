import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import Navbar from '../NavBar/Navbar'
import EventCard from './../events/EventCard';
import Header from './../clubs_profile/header/index'
import './EventList.css'

const EventList = () => {

    // const user = useSelector(state => state.user)
    const [events, setEvents] = useState([]);
    let {club} = useParams();

    const get_events = async () => {
        let formData = new FormData();
        formData.append('token', localStorage.getItem('token'))
        formData.append('club_name', club.split('-').join(' '))
        fetch(`http://127.0.0.1:8000/api/club/events`, {
            method : 'POST',
            body: formData
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

                <div className='club-home'>
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
        </div>
    )
}

export default EventList