import React, {useState, useEffect} from 'react'
import ReactHtmlParser from 'react-html-parser'
import { useParams } from 'react-router';
import Navbar from './../Navbar/Navbar'
import Button from '@material-ui/core/Button';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import { useSelector } from 'react-redux'
// import Error404 from '../../Error/Error404';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

const theme = createTheme({
    palette: {
      primary: green,
    },
  });

const EventHome = () => {

    const user = useSelector(state => state.type_of_user)

    let {id} = useParams();

    const [event, setevent] = useState({});
    

    


    const fetchEventDetails = () => {
        let formData = new FormData();
        formData.append('id_event', id)
        formData.append('token', localStorage.getItem('token'))
        fetch('http://127.0.0.1:8000/api/club/event_data_id',
        {
            method: 'POST',
            body: formData
        }).then( data => data.json()).then(
            data => {setevent(data)
                console.log(data)
                console.log(typeof(data.rating))
                
            }
        )
    }


    // const checkReg = () => {
    //     let formData = new FormData();
    //     formData.append("token", localStorage.getItem('token'));
    //     formData.append('id_event', id);
    //     fetch("http://127.0.0.1:8000/api/club/is_registered",{
    //         method: 'POST',
    //         body: formData
    //     }).then(data => data.json()).then(
    //         data => setisreg(data)
    //     )

    // }

    const handleApprove = () => {
        let formData = new FormData();
        formData.append('id_event', id)
        formData.append('fut_state', 1)
        fetch("http://127.0.0.1:8000/api/club/approval", {
            method: "POST",
            body: formData
        }).then(
            setevent({...event, approved: 1})
        )
    }

    const handleDis = () => {
        let formData = new FormData();
        formData.append('id_event', id)
        formData.append('fut_state', -1)
        fetch("http://127.0.0.1:8000/api/club/approval", {
            method: "POST",
            body: formData
        }).then(
            setevent({...event, approved: -1})
        )
    }

    // const handle_unreg = () => {
    //     let formData = new FormData();
    //     formData.append("token", localStorage.getItem('token'));
    //     formData.append('id_event', id);
    //     fetch('http://127.0.0.1:8000/api/club/event_unregister', {
    //         method: 'POST',
    //         body: formData
    //     }).then(data => data.json())
    //     setisreg(!isreg)
    // }

    const [document1, setdocument1] = useState('')
    const [document2, setdocument2] = useState('')
    const [eventStats, seteventStats] = useState({})

    const fetch_event_stats = () => {
        let formData = new FormData();
        formData.append('id_event', id)
        fetch("http://127.0.0.1:8000/api/club/stats_of_event", {
            method: 'POST',
            body: formData
        }).then(
            data => data.json()
        ).then(
            data => {
                seteventStats(data)
                console.log(data)
            }

        )
   }

    useEffect(() => {
        // console.log(id);
        fetchEventDetails();
        // checkReg();
        fetch_event_stats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // const data = {
    //     id: 1,
    //     club_name: "Programming Club",
    //     date: "2021-07-15T12:00:00",
    //     event_description: "<h2>Hello from CKEditor 5!</h2><p>Happy Diwali</p>",
    //     event_title: "Trees in DSA",
    //     poster: "http://127.0.0.1:8000/images/default.jpg",
    //     profile_pic: "http://127.0.0.1:8000/profile_imgs/guitar.jpg"
    // }

    

    return (
        <>
        { (user === 'vbekfka29') ? 
        <div>
        <Navbar />
        <div className='marginer'>
            <div className='event-home-card'>
                <main>
                    <h2 className='event-title'>
                        {event.event_title}
                    </h2>
                    <div className='by-container'>
                        <h3>{event.date}</h3>
                        <h3>By {event.club_name}</h3>
                    </div>
                    <div className='event-poster'>
                        <img src={event.poster} alt='event poster'></img>
                    </div>
                    <div className='event-description'>
                        {ReactHtmlParser(event.event_description)}
                    </div>
                </main>

                
                <h3 className='register-heading'>
                        { event.rating ?
                        <Box component="fieldset" mb={3} borderColor="transparent">
                            <Typography component="legend"  >Average Rating</Typography>
                            <Rating name="simple-controlled" 
                            value={event.rating} 
                            precision={0.5}
                            readOnly />
                        </Box>:
                        null
                        }
                        </h3>
                        
                        <div style={{'textAlign': 'center'}}>
                        { event.document1 || event.document2 ? 
                            <h3>
                                Extra Documents
                            </h3>
                            :
                            null
                        }
                        <div>
                        { event.document1 &&
                        <Button color='primary' variant="contained" >
                        <a href={document1} target='_blank'  rel="noopener noreferrer" style={{'color': 'inherit'}}>
                            Document-1
                        </a>
                        </Button>
                        }
                        </div>
                        <br />
                        <div>
                        { event.document2 &&
                            <Button color='primary' variant="contained" >
                            <a href={document2} target='_blank' rel="noopener noreferrer" style={{'color': 'inherit'}}>
                                Document-2
                            </a>
                            </Button>
                            }
                        </div>
                        </div>

                        {/* <div style={{'textAlign': 'center'}}>
                        <h3>
                            Admin Approval
                        </h3>
                        <Button variant="contained" 
                        color={event.approved === 0 ? "default" : event.approved === 1 ? "primary" : "secondary"}
                        // disabled
                        >
            
                                {
                                    event.approved === 0 ? "Pending" : event.approved === 1 ? "Approved" : "Disapproved"
                                }
                        </Button>
                        </div> */}

                        {
                            !eventStats.data ?  
                            <div>
                                <h3 style={{'textAlign': 'center'}}>
                                    Event Stats
                                </h3>
                                <section className="data">
                                    <div>
                                    <p className="stat">{eventStats.unique_views}</p>
                                    <p className="stat-info">Unique Visitors</p>
                                    </div>
                                    <div>
                                    <p className="stat">{eventStats.total_views}</p>
                                    <p className="stat-info">Total Views</p>
                                    </div>
                                    <div>
                                    <p className="stat">{eventStats.registered}</p>
                                    <p className="stat-info">User Registered</p>
                                    </div>
                                    <div>
                                    <p className="stat">{eventStats.checked_in}</p>
                                    <p className="stat-info">Checked In</p>
                                    </div>
                                </section>  
                            </div>
                            : null
                        }

                <div className='register-from'>
                <form className='actual-event-register-from'>
                    {
                        event.approved !== 0 ?
                            event.approved === 1 ? <Button variant="outlined" color="secondary" onClick={handleDis} >
                                                        Disable
                                                    </Button> : 
                                                    <ThemeProvider theme={theme}>
                                                        <Button variant="outlined" color="primary" onClick={handleApprove}>
                                                        Approve
                                                        </Button> 
                                                    </ThemeProvider>
                            :
                            <div>
                                <ThemeProvider theme={theme}>
                                    <Button variant="outlined" color="primary" style={{margin: "0 10px"}} onClick={handleApprove}>
                                        Approve
                                    </Button> 
                                    <Button variant="outlined" color="secondary" style={{margin: "0 10px"}} onClick={handleDis}>
                                        Dissaprove  
                                    </Button>  
                                </ThemeProvider>
                                
                            </div>
                            
                        
                    }
                </form>
                </div>
                

            
 
            </div>
        </div>
        </div>
        :
            null
        // <Error404 />
        } 
    </>
    )
}

export default EventHome
