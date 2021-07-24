import React, {useState, useEffect, useRef} from 'react'
import Navbar from '../NavBar/Navbar'
import EventCard from './EventCard';
import './Events.css'
import Pagination from "@material-ui/lab/Pagination";
import { useMediaQuery } from 'react-responsive'
import { useSelector } from 'react-redux'
import Error404 from '../../Error/Error404';

const Events = () => {

    const itemsPerPage = 5;
    // const user = useSelector(state => state.user)
    const [page, setPage] = useState(1);
    const [noOfPages, setNoOfPages] = useState(
        // Math.ceil(projectsList.length / itemsPerPage)
        1
    );
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 600px)' })

    const user = useSelector(state => state.type_of_user)
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

    const isFirstRender = useRef(0)

      useEffect(() => {
        if (isFirstRender.current === 0) {
            isFirstRender.current = 1
            return;
        }else if(isFirstRender.current === 1){
            setNoOfPages(Math.ceil(events.length / itemsPerPage))
            // console.log('Something Happened')
        }

    }, [events])
    

    return (
        <>
        { (user === 'cmkua43qrh') ? 
        <div>
            <Navbar />
                <div className='user-main-events-list'>
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
        :
        <Error404/>
        }
        </>
    )
}

export default Events
