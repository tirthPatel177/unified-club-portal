import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import Navbar from './../../NavBar/Navbar';
import './EventsHome.css'
import ReactHtmlParser from 'react-html-parser'
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
// import OutlinedInput from '@material-ui/core/OutlinedInput';
import Input from '@material-ui/core/Input';
// import MuiPhoneNumber from "material-ui-phone-number";
import { Button } from '@material-ui/core'
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import EventsNav from './EventsNav';

const labels = {
  0.5: 'Useless',
  1: 'Useless+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Ok',
  3: 'Ok+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+',
};

const useStyles = makeStyles({
  root: {
    // width: 200,
    display: 'flex',
    alignItems: 'center',
  },
});

const EventsHome = () => {



   
    

    let {id} = useParams();

    const [register, setregister] = useState(
        {
            mobile_no: '',
            roll_no: ''
        }
    )


    const [event, setevent] = useState({});
    

    const handleChange = (e) => {
        e.preventDefault();
        const changename= e.target.name;
        const changevalue = e.target.value;
        console.log(changename, changevalue, 'Hello');
        setregister({...register, [changename]: changevalue});
        
    };


    

    const fetchEventDetails = () => {
        let formData = new FormData();
        formData.append('id_event', id)
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


    

   

    useEffect(() => {
        console.log(id);
        fetchEventDetails();
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
        <div>
        <Navbar />
        <div className='marginer'>
            <div className='event-home-card'>
                <EventsNav />
                
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

                
                 
            </div>
        </div>
        </div>
    )
}

export default EventsHome
