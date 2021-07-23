import { Button } from '@material-ui/core';
import React, {useEffect, useState} from 'react'
import { useHistory, useParams } from 'react-router-dom';
import Header from '../../HomePage/header';
import Navbar from '../../NavBar/Navbar';
import EventCard from './EventCard';
import './Event.css'

const Events = () => {

    const history = useHistory();

    const [events, setEvents] = useState([]);
    let {club} = useParams();


    const get_title = (title) => {
        // console.log(title);
        return title.split(' ').join('-');
    }



    const handleCreateEvent = () => {
        let path = `/club/${club}/create-event`; 
        history.push(path);
    }

    

    const get_events = async () => {
        let formData = new FormData();
        formData.append("token", localStorage.getItem('token'));
        formData.append('club_name', club.split('-').join(' '));
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
            <div className='event-create-button'>
                <Button variant="outlined" color="primary" onClick={handleCreateEvent}>
                    Create Event
                </Button>
            </div>
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
