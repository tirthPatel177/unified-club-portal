import React, {useState, useEffect, useRef} from 'react'
import { useParams, useHistory } from 'react-router-dom'
import Header from '../HomePage/header/index'
import Navbar from './../NavBar/Navbar'
import AnnouncementCard from './AnnouncementCard'
import './AnnouncementList.css'
import { Button } from '@material-ui/core';
import Pagination from "@material-ui/lab/Pagination";
import { useMediaQuery } from 'react-responsive'

const AnnouncementList = () => {

    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 600px)' })

    const history = useHistory();

    const itemsPerPage = 5;
    const [page, setPage] = useState(1);
    const [noOfPages, setNoOfPages] = useState(
        // Math.ceil(projectsList.length / itemsPerPage)
        1
    );

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
                // console.log(dataapi);
                setdata(dataapi);
            }
        ).catch(e => console.log(e))
    }
    
      useEffect(() => {
        
        fetchannouncements();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

      const isFirstRender = useRef(0)

      useEffect(() => {
        if (isFirstRender.current === 0) {
            isFirstRender.current = 1
            return;
        }else if(isFirstRender.current === 1){
            setNoOfPages(Math.ceil(data.length / itemsPerPage))
            // console.log('Something Happened')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    return (
        <div>
            <Navbar />
            <div className='club-home'>
                <Header />
                <div className='announcement-create-button'>
                    <Button variant="outlined" color="primary" onClick={handleCreateAnnouncement}>
                        Create Announcement
                    </Button>
                </div>
                <div className='announcement-list'>
                {
                    data.slice((page - 1) * itemsPerPage, page * itemsPerPage).map(announcement => {
                        // Unique identifer to acnnouncement
                        return <div className='announcement-space' key={`${announcement.title} ${announcement.date_srt}`}>
                            <AnnouncementCard details={announcement}  />
                            </div>
                    })
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

export default AnnouncementList
