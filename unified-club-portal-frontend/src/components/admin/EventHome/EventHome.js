import React, {useState, useEffect} from 'react'
import ReactHtmlParser from 'react-html-parser'
import { useParams } from 'react-router';
import Navbar from './../Navbar/Navbar'
import Button from '@material-ui/core/Button';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import { useSelector } from 'react-redux'
// import Error404 from '../../Error/Error404';

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

    useEffect(() => {
        // console.log(id);
        fetchEventDetails();
        // checkReg();
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
                                        Disable
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
