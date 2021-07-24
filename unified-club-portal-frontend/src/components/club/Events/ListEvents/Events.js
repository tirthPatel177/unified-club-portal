import { Button } from '@material-ui/core';
import React, {useEffect, useState, useRef} from 'react'
import { useHistory, useParams } from 'react-router-dom';
import Header from '../../HomePage/header';
import Navbar from '../../NavBar/Navbar';
import EventCard from './EventCard';
import './Event.css'
import Pagination from "@material-ui/lab/Pagination";
import { useMediaQuery } from 'react-responsive'
import { useSelector } from 'react-redux'

const Events = () => {
    const user = useSelector(state => state.type_of_user)
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 600px)' })

    const itemsPerPage = 5;
    const [page, setPage] = useState(1);
    const [noOfPages, setNoOfPages] = useState(
        // Math.ceil(projectsList.length / itemsPerPage)
        1
    );

    const history = useHistory();

    const [events, setEvents] = useState([]);
    let {club} = useParams();





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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    const isFirstRender = useRef(0)

      useEffect(() => {
        if (isFirstRender.current === 0) {
            isFirstRender.current = 1
            return;
        }else if(isFirstRender.current === 1){
            setNoOfPages(Math.ceil(events.length / itemsPerPage))
            // console.log('Something Happened')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [events])

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
                        events.slice((page - 1) * itemsPerPage, page * itemsPerPage).map( event => 
                            {
                                return <EventCard event={event} key={event.id_event}/>
                            }
                        )
                    }
            </div>
            <div className='pagination-container'>
                    <Pagination count={noOfPages} page={page} 
                    color="primary"
                    size={isTabletOrMobile ? 'medium' : 'large'}
                    showFirstButton
                    showLastButton
                    onChange={(event, value) => {setPage(value)}} />
                </div>
            </div>
        </div>
    )
}

export default Events
