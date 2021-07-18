import React, {useState, useEffect} from 'react'
import Header from '../../HomePage/header'
import Navbar from '../../NavBar/Navbar'
import './CreateEvents.css'
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const useStyles = makeStyles((theme) => ({
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
  }));

const CreateEvents = () => {

    const classes = useStyles();

    const [preview, setPreview] = useState('');
    const [event, setevent] = useState({
        event_title: '',
        event_description: '',
        date: '',
        poster: '',
        visible: false,
    })
    const [editordata, seteditordata] = useState('')

    const handleChange = (e) => {
        e.preventDefault();
        const changename= e.target.name;
        const changevalue = e.target.value;
        // console.log(changename, changevalue, 'Hello');
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

    useEffect(() => {
        console.log(event);}
    ,[event])
    
    const beforeSubmit = async () => {
        setevent((event)=>{
            return {...event, event_description : editordata}
        });
    };

    const handleSubmit = () => {
        beforeSubmit();
        let formData = new FormData();
        formData.append("token", localStorage.getItem('token'));
        for (const property in event) {
            formData.append(property, event[property])
            console.log(property, event[property], formData[property]);
        }
        fetch('http://127.0.0.1:8000/api/club/event_create', {
            method: 'POST',
            body: formData
        }).then( data => data.json())
        console.log(editordata)
    }

    return (
        <div>
            <Navbar />
            <div className='club-home'>
            <Header />
            <div className='club-event-form-container'>
                <h2 className='club-event-welcome'>
                    Create Event
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
                            checked={event.visible}
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
            </div>
        </div>
    )
}

export default CreateEvents