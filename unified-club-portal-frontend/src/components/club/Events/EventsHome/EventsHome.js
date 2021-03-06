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
import { SnackbarProvider, useSnackbar } from 'notistack';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSelector } from 'react-redux'
// import Error404 from '../../../Error/Error404';
import { useHistory } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// const labels = {
//   0.5: 'Useless',
//   1: 'Useless+',
//   1.5: 'Poor',
//   2: 'Poor+',
//   2.5: 'Ok',
//   3: 'Ok+',
//   3.5: 'Good',
//   4: 'Good+',
//   4.5: 'Excellent',
//   5: 'Excellent+',
// };


const useStyles = makeStyles((theme) => ({
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
  }));

const EventsHome = () => {
    const user = useSelector(state => state.type_of_user)

    const { enqueueSnackbar } = useSnackbar();

    const handleClickVariant = (variant, message) => () => {
        // variant could be success, error, warning, info, or default
         enqueueSnackbar(message, { variant });   
        
    };

    const [active, setactive] = useState('details');

    const classes = useStyles();

   const [preview, setPreview] = useState('');
    

    let {id} = useParams();

    
    const [document1, setdocument1] = useState('')
    const [document2, setdocument2] = useState('')

    const [event, setevent] = useState({
        event_title: ' '
    });
    const [editordata, seteditordata] = useState('')

    const [checkin, setcheckin] = useState([])

    const [isloading, setisloading] = useState(true);

    const fetchEventDetails = () => {
        let formData = new FormData();
        formData.append('id_event', id)
        formData.append('token', localStorage.getItem('token'))
        fetch('http://127.0.0.1:8000/api/club/event_data_id',
        {
            method: 'POST',
            body: formData
        }).then( data => data.json()).then(
            async data => {
                await setevent(data)
                seteditordata(data.event_description)
                setPreview(data.poster)
                setdocument1(data.document1)
                setdocument2(data.document2)
                console.log(typeof(data.rating))
                return data
            }
        ).then( (data) =>
            fetchRegistered(data.event_title)
        ).then(
            setTimeout(() => {
                setisloading(false);
            }, 800)
        )
    }


    

   const fetchRegistered = (title) => {
       fetch(`http://127.0.0.1:8000/api/club/registered_users/${title.split(' ').join('_')}`, {
           method: 'GET'
       }).then(
           data => data.json()
       ).then(
           data => {
               setcheckin(data);
           }
       )
   }

   const [eventStats, seteventStats] = useState('')

   const handleDelete = () => {
    let formData = new FormData();
    formData.append('id_event', id);
    fetch('http://127.0.0.1:8000/api/club/event_delete_id',{
        method: "POST",
        body: formData
    }).then(
        history.push(`/club/${event.club_name.split(' ').join('_')}/events`)
    )
}

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
    setOpen(true);
    };

    const handleClose = (action) => {
        if(action === 'Yes'){
        handleDelete();
        }
        setOpen(false);
    };

    let history = useHistory();

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
        console.log(id);
        fetchEventDetails();
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

    const handleChange = (e) => {
        // e.preventDefault();
        const changename= e.target.name;
        const changevalue = e.target.value;
        console.log(changename, changevalue, 'Hello');
        if(changename === 'visible' || changename=== 'completed'){
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
        }else if(changename=== 'document1' || changename === 'document2'){
            setevent({...event, 
                // profile_image: URL.createObjectURL(e.target.files[0])
                [changename]: e.target.files[0]
            });
            if(changename === 'document1'){
                setdocument1(URL.createObjectURL(e.target.files[0]));
            }else{
                setdocument2(URL.createObjectURL(e.target.files[0]));
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
        formData.append('event_description', editordata)
        fetch('http://127.0.0.1:8000/api/club/event_update', {
            method: 'POST',
            body: formData
        }).then( data => data.json()).then(
            data => {
                if(data.success){
                    handleClickVariant('success', data.success)()
                }else if(data.error){
                    handleClickVariant('error', data.error)()
                }else{
                    handleClickVariant('error', data)()
                }
                
            }
        )
        setTimeout(() => setactive('details'), 2500);
        // console.log(editordata)
    }


    return (
        <>
            { (user === 'xhuoxfn3') ? 
        <div>
        <Navbar />
        <div className='marginer'>
            <div className='event-home-card'>
                {
                    isloading ?
                    <div style={{ margin: '0 auto', 'textAlign' : 'center'}}>
                    <CircularProgress />
                    </div> :
                    <div>
                    <EventsNav active={active} setactive={setactive}/>
                    {   (active === 'details') ?
                        <div>
                        <main>
                            <h2 className='event-title'>
                                {event.event_title}
                            </h2>
                            <div className='by-container'>
                                <h3>{event.date.split('T').join(' ')}</h3>
                                <h3>By {event.club_name}</h3>
                            </div>
                            <div className='event-poster'>
                                <img src={event.poster} alt='event poster'></img>
                            </div>
                            <div className='form-marginer'>
                            <div className='event-description'>
                                {ReactHtmlParser(event.event_description)}
                            </div>
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
                        
                        <div style={{'textAlign': 'center'}}>
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
                        </div>

                        {
                            !(eventStats.data === '') ?  
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
                        <br />
                        <div style={{'textAlign' : 'center'}}>
                                        <Button 
                                        // size="small" 
                                        variant='contained'
                                        color="secondary"
                                        onClick={handleClickOpen}
                                        >
                                        Delete
                                        </Button>
                                <Dialog
                                        open={open}
                                        onClose={handleClose}
                                        aria-labelledby="alert-dialog-title"
                                        aria-describedby="alert-dialog-description"
                                        >
                                        <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete event "+ event.event_title+ '?'}</DialogTitle>
                                        
                                        <DialogActions>
                                        <Button onClick={() => handleClose('Cancel')} color="primary">
                                            Cancel
                                        </Button>
                                        <Button onClick={() => handleClose('Yes')} color="primary" autoFocus>
                                            Yes
                                        </Button>
                                        </DialogActions>
                                    </Dialog>

                            </div>

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
                                        data={editordata}
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
                                    style={{ height : '280px'}} alt='poster'></img>
                                        
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


                                <div className="club-event-poster-upload-button-area">
                                    <h4 style={{'textAlign' : 'center'}}> Extra Documents </h4>
                                    <div className='doc-upload-continer-update'>
                                        <div className='doc-upload'>
                                            <label htmlFor="document1">Document 1</label>
                                            <br />
                                            <input 
                                                type="file" 
                                                // accept=".png, .jpg, .jpeg" 
                                                id="document1" 
                                                name='document1'
                                                className="club-event-poster-upload-button"
                                                onChange={handleChange}
                                            />
                                            { event.document1 &&
                                            <Button color='primary' variant="contained" >
                                            <a href={document1} rel="noopener noreferrer" target='_blank' style={{'color': 'inherit'}}>
                                                Document-1
                                            </a>
                                            </Button>
                                            }
                                        </div>
                                        <div className='doc-upload'>
                                            <label htmlFor="document1">Document 2</label>
                                            <br />
                                            <input 
                                                type="file" 
                                                // accept=".png, .jpg, .jpeg" 
                                                id="document2" 
                                                name='document2'
                                                className="club-event-poster-upload-button"
                                                onChange={handleChange}
                                            />
                                            { event.document2 &&
                                             <Button color='primary' variant="contained" >
                                             <a href={document2} rel="noopener noreferrer" target='_blank' style={{'color': 'inherit'}}>
                                                 Document-2
                                             </a>
                                             </Button>
                                            }
                                        </div>
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
                                        value={event.date}
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
                                    label="Make Visible to everyone"
                                />
                                </div>

                                <div className='form-marginer'>
                                <FormControlLabel
                                    control={
                                    <Checkbox
                                        checked={event.completed ? true: false}
                                        onChange={handleChange}
                                        name="completed"
                                        color="primary"
                                    />
                                    }
                                    label="Completed?"
                                />
                                </div>

                                <div className='club-event-create-container'>
                                <Button variant="contained" color="primary" 
                                onClick={handleSubmit}
                                >
                                    Update Event
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
            }     
            </div>
            
        </div>
    
        </div>
        :
        // <Error404 /> 
        null
        }
        </>
    )
}

export default function IntegrationNotistack() {
    return (
      <SnackbarProvider maxSnack={3} autoHideDuration={2500}>
        <EventsHome />
      </SnackbarProvider>
    );
  }

