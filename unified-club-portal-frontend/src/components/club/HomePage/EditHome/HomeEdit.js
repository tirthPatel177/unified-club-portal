import React, {useState, useEffect} from 'react'
import Header from './../header/index'
import { Button } from '@material-ui/core'
// import profile from './../../../../Resources/club-profile.jpg'
import './HomeEdit.css'
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
// import OutlinedInput from '@material-ui/core/OutlinedInput';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';

const HomeEdit = (props) => {

    

    const [clubDetails, setclubDetails] = useState(
        {
            title: props.club.title,
            tag_line: props.club.tag_line,
            description: props.club.description,
            profile: props.club.profile
        }
    )

    const handleChange = (e) => {
        e.preventDefault();
        const changename= e.target.name;
        const changevalue = e.target.value;
        console.log(changename, changevalue, 'Hello');
        if(changename === 'profile'){
            if(e.target.files[0]) {
                setclubDetails({...clubDetails, profile: URL.createObjectURL(e.target.files[0])});
            }   
        }else{
            setclubDetails({...clubDetails, [changename]: changevalue});
        }
        console.log(clubDetails.name)
    };

    return (
        <div>
            <div>
                <Header edit={props.edit} setEdit={props.setEdit}/>
            </div>
            <div className='club-profile-form-container'>
                <h2 className='edit-profile-welcome'>Edit Profile</h2>
            <form className='club-profile-form'>
                <div className='club-profile-image-upload'>
                    <img src={clubDetails.profile} style={{ height : '280px'}} ></img>
                        
                    <div className="club-image-upload-button-area">
                    <h3> Profile Photo </h3>
                    <input 
                        type="file" 
                        accept=".png, .jpg, .jpeg" 
                        id="photo" 
                        name='profile'
                        className="club-image-upload-button"
                        onChange={handleChange}
                    />
                    </div>
                </div>
                <div className='form-marginer'>
                
                <FormControl >
                    <InputLabel htmlFor="title">Club Title</InputLabel>
                    <Input name='title' id="title" value={clubDetails.title} onChange={handleChange}  required/>
                </FormControl>
                </div>
                <div className='form-marginer'>
                <FormControl >
                    <InputLabel htmlFor="tag_line">Tag Line</InputLabel>
                    <Input name='tag_line' id="tag_line" value={clubDetails.tag_line} onChange={handleChange}  required/>
                </FormControl>
                </div>
                <div className='form-marginer'>
                <TextField
                    id="standard-multiline-flexible"
                    label="Description"
                    multiline
                    maxRows={15}
                    name='description'
                    value={clubDetails.description}
                    onChange={handleChange}
                />
                </div>
            </form>
            </div>
        </div>
    )
}

export default HomeEdit
