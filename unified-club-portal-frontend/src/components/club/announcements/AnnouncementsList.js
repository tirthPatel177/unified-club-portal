import React, {useState, useEffect} from 'react'
import { useParams, useHistory } from 'react-router-dom'
import Header from '../HomePage/header/index'
import Navbar from './../NavBar/Navbar'
import AnnouncementCard from './AnnouncementCard'
import './AnnouncementList.css'
import { Button } from '@material-ui/core';

const AnnouncementList = () => {

    const history = useHistory();

    const [data, setdata] = useState([])

    let {club} = useParams();

    const handleCreateAnnouncement = () => {
        let path = `/club/${club}/create-announcement`; 
        history.push(path);
    }

    const fetchannouncements = () => {
        
        fetch(`http://127.0.0.1:8000/api/club/get_announcement_club/${club}`, {
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
                <Header />
                <Button variant="contained" color="primary" onClick={handleCreateAnnouncement}>
                    Create Announcement
                </Button>
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
