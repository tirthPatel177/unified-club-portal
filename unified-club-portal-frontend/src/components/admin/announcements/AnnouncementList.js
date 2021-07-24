import React, {useState, useEffect, useRef} from 'react'
import Navbar from './../Navbar/Navbar'
import AnnouncementCard from './../../club/announcements/AnnouncementCard'
import './AnnouncementList.css'
import Pagination from "@material-ui/lab/Pagination";
import { useMediaQuery } from 'react-responsive'
import { useSelector } from 'react-redux'
import Error404 from '../../Error/Error404';


const AnnouncementList = () => {
    const user = useSelector(state => state.type_of_user)

    const [data, setdata] = useState([])

    const itemsPerPage = 5;
    const [page, setPage] = useState(1);
    const [noOfPages, setNoOfPages] = useState(
        // Math.ceil(projectsList.length / itemsPerPage)
        1
    );
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 600px)' })


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

      const isFirstRender = useRef(0)

      useEffect(() => {
        if (isFirstRender.current === 0) {
            isFirstRender.current = 1
            return;
        }else if(isFirstRender.current === 1){
            setNoOfPages(Math.ceil(data.length / itemsPerPage))
            // console.log('Something Happened')
        }

    }, [data])

    

    return (
        <>
        { (user === 'vbekfka29') ? 
        <div>
            <Navbar />
            <div className='club-home'>
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
        :
        <Error404 />
        } 
    </>
    )
}

export default AnnouncementList
