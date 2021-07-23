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
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import TextField from '@material-ui/core/TextField';
import CheckIn from './CheckIn';


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


const useStyles = makeStyles((theme) => ({
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
  }));

const EventsHome = () => {

    const [active, setactive] = useState('details');

    const classes = useStyles();

   const [preview, setPreview] = useState('');
    

    let {id} = useParams();

    


    const [event, setevent] = useState({
        event_title: ' '
    });
    const [editordata, seteditordata] = useState('')

    const [checkin, setcheckin] = useState([])

    

    const fetchEventDetails = () => {
        let formData = new FormData();
        formData.append('id_event', id)
        fetch('http://127.0.0.1:8000/api/club/event_data_id',
        {
            method: 'POST',
            body: formData
        }).then( data => data.json()).then(
            async data => {
                await setevent(data)
                console.log(typeof(data.rating))
                return data
            }
        ).then( (data) =>
            fetchRegistered(data.event_title)
        )
    }


    

   const fetchRegistered = (title) => {
       fetch(`http://127.0.0.1:8000/api/club/registered_users/${title.split(' ').join('-')}`, {
           method: 'GET'
       }).then(
           data => data.json()
       ).then(
           data => {
               setcheckin(data);
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

    const handleChange = (e) => {
        // e.preventDefault();
        const changename= e.target.name;
        const changevalue = e.target.value;
        console.log(changename, changevalue, 'Hello');
        if(changename === 'visible'){
            setevent({...event, [changename]: e.target.checked})
        }
        else if(changename === 'poster'){
            if(e.target.files[0]) {
                setevent({...event, 
                    // profile_image: URL.createObjectURL(e.target.files[0])
                    poster: e.target.files[0]
                });
                setPreview(URL.createObjectURL(e.target.files[0]));
            }   
        }else{
            setevent({...event, [changename]: changevalue});
        }
    };

    const handleSubmit =  async () => {

        // sendData();

        let formData = new FormData();
        formData.append("token", localStorage.getItem('token'));
        formData.append('event_description', editordata)
        for (const property in event) {
            formData.append(property, event[property])
            console.log(property, event[property], formData[property]);
        }
        fetch('http://127.0.0.1:8000/api/club/event_update', {
            method: 'POST',
            body: formData
        }).then( data => data.json())
        console.log(editordata)
        setactive('details');
    }


    return (
        <div>
        <Navbar />
        <div className='marginer'>
            <div className='event-home-card'>
                <EventsNav active={active} setactive={setactive}/>
                {   (active === 'details') ?
                    <div>
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
                    :
                    (active === 'update') ? 
                    <div >
                        <h2 className='club-event-welcome'>
                            Update Event
                        </h2>
                        <form className='club-event-form'>
                            <div className='form-marginer'>
                                <FormControl >
                                    <InputLabel htmlFor="title">Event Title</InputLabel>
                                    <Input name='event_title' id="title" 
                                    value={event.event_title} 
                                    onChange={handleChange}  
                                    required/>
                                </FormControl>
                            </div>
                            
                            <h4> Description </h4>

                                <CKEditor
                                    name='description'
                                    editor={ ClassicEditor }
                                    data="<p>Hello from CKEditor 5!</p>"
                                    onReady={ editor => {
                                        // You can store the "editor" and use when it is needed.
                                        console.log( 'Editor is ready to use!', editor );
                                    } }
                                    onChange={ ( event, editor ) => {
                                        const data = editor.getData();
                                        // console.log( { event, editor, data } );
                                        seteditordata(data);
                                    } }
                                />

                            

                            <div className='club-event-poster-image-upload'>
                                <img 
                                src={preview} 
                                style={{ height : '280px'}} ></img>
                                    
                                <div className="club-event-poster-upload-button-area">
                                <h3> Poster </h3>
                                <input 
                                    type="file" 
                                    accept=".png, .jpg, .jpeg" 
                                    id="photo" 
                                    name='poster'
                                    className="club-event-poster-upload-button"
                                    onChange={handleChange}
                                />
                                </div>
                            </div>

                            <div className='form-marginer'>
                                {/* <TextField
                                    name='datetime-local'
                                    value={event.date}
                                    id="datetime-local"
                                    label="Event Date"
                                    type="datetime-local"
                                    // defaultValue="2017-05-24"
                                    className={classes.textField}
                                    onChange={handleChange}
                                    InputLabelProps={{
                                    shrink: true,
                                    }}
                                /> */}
                                <TextField
                                    name='date'
                                    id="datetime-local"
                                    label="Event Date"
                                    type="datetime-local"
                                    // defaultValue="2017-05-24T10:30"
                                    className={classes.textField}
                                    onChange={handleChange}
                                    InputLabelProps={{
                                    shrink: true,
                                    }}
                                />
                            </div>

                            <div className='form-marginer'>
                            <FormControlLabel
                                control={
                                <Checkbox
                                    checked={event.visible ? true: false}
                                    onChange={handleChange}
                                    name="visible"
                                    color="primary"
                                />
                                }
                                label="Visible"
                            />
                            </div>

                            <div className='club-event-create-container'>
                            <Button variant="contained" color="primary" 
                            onClick={handleSubmit}
                            >
                                Create Event
                            </Button>
                            </div>
                            
                            
                            
                        </form>
                    </div>
                    :
                    <div className='margin-checkin'>
                        <h2 className='club-event-welcome'>
                            Registered Participants
                        </h2>
                        <div className='table-header'>
                            <p className='one'>
                                User
                            </p>
                            <p className='two'>
                                Checked-in?
                            </p>
                        </div>
                        {
                            checkin.map(checkit =>{
                                
                                return <CheckIn checkin={checkit} id_event={id}/>
                            })
                        }
                    </div>

            }
                
                 
            </div>

        </div>
    
        </div>
    )
}

export default EventsHome
