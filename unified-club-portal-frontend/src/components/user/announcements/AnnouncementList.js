import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import Header from '../clubs_profile/header/index'
import Navbar from './../NavBar/Navbar'
import AnnouncementCard from './AnnouncementCard'
import './AnnouncementList.css'

const AnnouncementList = () => {

    const [data, setdata] = useState([])

    let {club} = useParams();

    const fetchannouncements = (token) => {
        let formData = new FormData();
        formData.append("token", token);
        formData.append("club_name", club.split('-').join(' '))
        fetch('http://localhost:8000/api/club/get_announcements', {
            method: "POST",
            body: formData
        }).then( dataapi => dataapi.json()).then(
            dataapi => {
                console.log(dataapi);
                setdata(dataapi);
            }
        ).catch(e => console.log(e))
    }
    
      useEffect(() => {
        let token = localStorage.getItem('token');
        fetchannouncements(token);
        
      }, [])

    

    return (
        <div>
            <Navbar />
            <div className='club-home'>
                <Header />
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
