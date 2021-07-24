import React, {useState, useEffect, useRef} from 'react'
import { useParams } from 'react-router-dom'
import Header from '../clubs_profile/header/index'
import Navbar from './../NavBar/Navbar'
import AnnouncementCard from './AnnouncementCard'
import './AnnouncementList.css'
import Pagination from "@material-ui/lab/Pagination";
import { useMediaQuery } from 'react-responsive'

const AnnouncementList = () => {

    const [data, setdata] = useState([])

    const itemsPerPage = 5;
    const [page, setPage] = useState(1);
    const [noOfPages, setNoOfPages] = useState(
        // Math.ceil(projectsList.length / itemsPerPage)
        1
    );
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 600px)' })

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
                // console.log(dataapi);
                setdata(dataapi);
            }
        ).catch(e => console.log(e))
    }
    
      useEffect(() => {
        let token = localStorage.getItem('token');
        fetchannouncements(token);
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
                <div className='announcement-list'>
                {
                    data.slice((page - 1) * itemsPerPage, page * itemsPerPage).map(announcement => {
                        // Unique identifer to acnnouncement
                        return <div className='announcement-space'>
                            <AnnouncementCard details={announcement} />
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
