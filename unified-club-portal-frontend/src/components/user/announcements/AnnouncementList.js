import React from 'react'
import Header from '../clubs_profile/header/index'
import Navbar from './../NavBar/Navbar'
import AnnouncementCard from './AnnouncementCard'
import './AnnouncementList.css'

const AnnouncementList = () => {

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
