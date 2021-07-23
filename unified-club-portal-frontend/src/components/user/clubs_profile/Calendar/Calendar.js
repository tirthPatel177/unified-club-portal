import React, {useState, useEffect} from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import Separator from '../separator'
// import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import './Calendar.css'
import { useHistory } from 'react-router-dom';

const Calendar = () => {

    const [eventdate, seteventdate] = useState([])


    const fetchEvents = () => {

    }

    let history = useHistory();

    useEffect(() => {
        fetchEvents();
        seteventdate([
            { title: 'event 1', date: '2021-07-17', id: 23 },
            { title: 'event 2', date: '2021-07-22' }
        ])
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
                        history.push(`/user/events/${e.event.id}`)
                    }
                }
            />
            </div>
        </div>
    )
}

export default Calendar
