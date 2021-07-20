import React from 'react'
import Navbar from './../../NavBar/Navbar'
import Header from './../../HomePage/header/index'
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
import './CreateAnnouncement.css'

const CreateAnnouncements = () => {
    return (
        <div>
            <Navbar />
            <div className='club-home'>
            <Header />
            <div className='club-announcement-form-container'>
            <h2 className='club-event-welcome'>
                    Create Event
                </h2>
                <form className='club-announcement-form'>
                    <div className='form-marginer'>
                        <FormControl >
                            <InputLabel htmlFor="title">Announcement Title</InputLabel>
                            <Input name='event_title' id="title" 
                            // value={event.event_title} 
                            // onChange={handleChange}  
                            required/>
                        </FormControl>
                    </div>
                    
                    <h4> Body </h4>

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
                                // seteditordata(data);
                            } }
                        />

                    <div className='form-marginer'>
                    <FormControlLabel
                        control={
                        <Checkbox
                            // checked={event.visible ? true: false}
                            // onChange={handleChange}
                            name="visible"
                            color="primary"
                        />
                        }
                        label="Visible"
                    />
                    </div>
                </form>
            </div>
            </div>
        </div>
    )
}

export default CreateAnnouncements
