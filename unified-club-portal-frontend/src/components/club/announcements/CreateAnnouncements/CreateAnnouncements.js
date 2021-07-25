import React, {useState, useEffect} from 'react'
import Navbar from './../../NavBar/Navbar'
import Header from './../../HomePage/header/index'
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import { Button } from '@material-ui/core'
// import { makeStyles } from '@material-ui/core/styles';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import './CreateAnnouncement.css'
import { useHistory, useParams } from 'react-router-dom';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { useSelector } from 'react-redux'
// import Error404 from '../../../Error/Error404';

const CreateAnnouncements = () => {
    
    const user = useSelector(state => state.type_of_user)

    const [announcement, setannouncement] = useState({
        event_title: '',
        title: '',
        send_notification: false,
        to_announce: ''
    })

    const { enqueueSnackbar } = useSnackbar();

    const handleClickVariant = (variant, message) => () => {
        // variant could be success, error, warning, info, or default
         enqueueSnackbar(message, { variant });   
        
    };

    let {club} = useParams();

    let history = useHistory();

    const [events, setevents] = useState([])

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/club/uncompleted_events/${club}`,{
            method: "GET",
        }).then(data => data.json()).then(
            data => {setevents(data);
                console.log(data)
            }
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const [editordata, seteditordata] = useState('')


    const handleChange = (e) => {
        // e.preventDefault();
        const changename= e.target.name;
        const changevalue = e.target.value;
        console.log(changename, changevalue, 'Hello');
        if(changename === 'send_notification'){
            setannouncement({...announcement, [changename]: e.target.checked})
        }
        else{
            setannouncement({...announcement, [changename]: changevalue});
        }
    };

    const handleSubmit = () => {
        if(announcement.title === ''){
            handleClickVariant('error', "Announcement Title is Required!")()
            return;
        }else if(announcement.to_announce === ''){
            handleClickVariant('error', "Announce To is Required!")()
            return;
        }
        let formData = new FormData();
        formData.append("token", localStorage.getItem('token'));
        formData.append('ann_description', editordata)
        formData.append("club_name", club.split('_').join(' '))
        for (const property in announcement) {
            formData.append(property, announcement[property])
            console.log(property, announcement[property], formData[property]);
        }
        fetch('http://127.0.0.1:8000/api/club/announcement', {
            method: 'POST',
            body: formData
        }).then( data => data.json()).then(
            data => {
                if(data.success){
                    handleClickVariant('success', data.success)()
                }else if(data.error){
                    handleClickVariant('error', data.error)()
                }else{
                    for (const property in data){
                    handleClickVariant('error', data[property])()
                    }
                }
                
            }
        )
        setTimeout(() => history.push(`/club/${club}/announcements`), 2500);
        // console.log(editordata)
        
    }


    return (
        <>
            { (user === 'xhuoxfn3') ? 
        <div>
            <Navbar />
            <div className='club-home'>
            <Header />
            <div className='club-announcement-form-container'>
            <h2 className='club-event-welcome'>
                    Create Announcement
                </h2>
                <form className='club-announcement-form'>
                    <div className='form-marginer'>
                        <FormControl >
                            <InputLabel htmlFor="title">Announcement Title</InputLabel>
                            <Input name='title' id="title" 
                            value={announcement.title} 
                            onChange={handleChange}  
                            required/>
                        </FormControl>
                    </div>
                    
                    <h4> Body </h4>

                        <CKEditor
                            name='ann_description'
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

                    
                    <div className='form-marginer'>
                    <FormControl>
                    <InputLabel id="demo-simple-select-label">Event</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={announcement.event_title}
                    onChange={handleChange}
                    default={'None'}
                    name='event_title'
                    >
                        <MenuItem value={'None'}>General Announcement</MenuItem>
                        {
                        // ListEvents()
                        events.map((event) => {
                               return <MenuItem key={event.event_title} value={event.event_title}>{event.event_title}</MenuItem>
                            }
                        )
                    }
                    
                    {/* <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem> */}
                    </Select>
                    </FormControl>
                    </div>

                    <div className='form-marginer'>
                    <FormControlLabel
                        control={
                        <Checkbox
                            checked={announcement.send_notification ? true: false}
                            onChange={handleChange}
                            name="send_notification"
                            color="primary"
                        />
                        }
                        label="Send Email Notification"
                    />
                    </div>

                    <div className='form-marginer'>
                    <FormControl>
                    <InputLabel id="demo-simple-select-label">Announce To</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={announcement.to_announce}
                    onChange={handleChange}
                    name='to_announce'
                    >
                        {
                            announcement.event_title !== 'None' ?
                            <MenuItem value={'members'}>Members</MenuItem>:
                            null
                        }
                        {
                            announcement.event_title !== 'None' ?
                            <MenuItem value={'registered'}>Registered Participants</MenuItem>:
                            <MenuItem value={'members'}>Members</MenuItem>
                        }
                        {
                            announcement.send_notification ? 
                            
                            null
                            :
                            <MenuItem value={'all'}>All</MenuItem>
                           
                        }
                    
                    </Select>
                    </FormControl>
                    </div>
                    
                    <div className='club-announcement-create-container'>
                    <Button variant="contained" color="primary" 
                    onClick={handleSubmit}
                    >
                        Create Announcement
                    </Button>
                    </div>

                </form>
            </div>
            </div>
        </div>
        :
        // <Error404/> 
        null
        }
        </>
    )
}

export default function IntegrationNotistack() {
    return (
      <SnackbarProvider maxSnack={3} autoHideDuration={2500}>
        <CreateAnnouncements />
      </SnackbarProvider>
    );
  }
