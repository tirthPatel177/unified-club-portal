import React, {useState, useEffect} from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import Separator from '../separator'
// import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import './Calendar.css'
import { useHistory } from 'react-router-dom';

const Calendar = ({club}) => {

    const [eventdate, seteventdate] = useState([])

    

    const fetchEvents = () => {
        fetch(`http://127.0.0.1:8000/api/club/events_club_cal/${club.split(' ').join('_')}`, {
            method: 'GET'
        }).then(
            data => data.json()
        ).then( data => 
            {
            seteventdate(data)
            // console.log(data);
            }
        )
    }

    let history = useHistory();

    useEffect(() => {
        fetchEvents();
        // seteventdate([
        //     { title: 'event 1', date: '2021-07-17', id: 23 },
        //     { title: 'event 2', date: '2021-07-22' }
        // ])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
            <Separator />
            <label className="section-title">Club Calendar</label>
            <div className='calander-container'>
            <FullCalendar
                plugins={[ dayGridPlugin ]}
                initialView="dayGridMonth"
                events={eventdate}
                eventClick= {
                    (e) => {
                        // console.log(e.event)
                        history.push(`/club/events/${e.event.id}`)
                    }
                }
            />
            </div>
        </div>
    )
}

export default Calendar
