import React from 'react'
import { useParams, useHistory } from 'react-router-dom'
import Header from '../HomePage/header/index'
import Navbar from './../NavBar/Navbar'
import AnnouncementCard from './AnnouncementCard'
import './AnnouncementList.css'
import { Button } from '@material-ui/core';

const AnnouncementList = () => {

    const history = useHistory();

    const data = [
        {
            clubname: 'Programming Club',
            subject: "Opportunity at MIT",
            date: '26-12-2020'
        },
        {
            clubname: 'Programming Club',
            subject: "Opportunity at MIT",
            date: '26-12-2020'
        },
        {
            clubname: 'Programming Club',
            subject: "Opportunity at MIT",
            date: '26-12-2020'
        },
        {
            clubname: 'Programming Club',
            subject: "Opportunity at MIT",
            date: '26-12-2020'
        },
        {
            clubname: 'Programming Club',
            subject: "Opportunity at MIT",
            date: '26-12-2020'
        },
        {
            clubname: 'Programming Club',
            subject: "Opportunity at MIT",
            date: '26-12-2020'
        },
        {
            clubname: 'Programming Club',
            subject: "Opportunity at MIT",
            date: '26-12-2020'
        },
    ]

    let {club} = useParams();

    const handleCreateAnnouncement = () => {
        let path = `/club/${club}/create-announcement`; 
        history.push(path);
    }

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
