import React, {useState, useEffect} from 'react'
import Navbar from './../Navbar/Navbar'
import AnnouncementCard from './../../club/announcements/AnnouncementCard'
import './AnnouncementList.css'

const AnnouncementList = () => {

    const [data, setdata] = useState([])


    const fetchannouncements = () => {
        fetch('http://127.0.0.1:8000/api/club/get_all_announcements', {
            method: "GET",
        }).then( dataapi => dataapi.json()).then(
            dataapi => {
                console.log(dataapi);
                setdata(dataapi);
            }
        ).catch(e => console.log(e))
    }
    
      useEffect(() => {
        fetchannouncements();
        
      }, [])

    

    return (
        <div>
            <Navbar />
            <div className='club-home'>
                <div className='announcement-list'>
                {
                    data.map(announcement => {
                        // Unique identifer to acnnouncement
                        return <div className='announcement-space'>
                            <AnnouncementCard details={announcement} />
                            </div>
                    })
                }
                </div>
            </div>
        </div>
    )
}

export default AnnouncementList
