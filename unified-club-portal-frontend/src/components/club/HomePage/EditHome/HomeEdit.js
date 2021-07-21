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
import { useHistory } from "react-router-dom";
import Navbar from '../../NavBar/Navbar';


const HomeEdit = (props) => {

    const [clubDetails, setclubDetails] = useState(
        {
            title: '',
            tag_line: '',
            description: '',
            profile: ''
        }
    )

    let history = useHistory();

    const [preview, setPreview] = useState('');
    

    const fetchdetails = (token) => {
        let formData = new FormData();
        formData.append("token", token);
        fetch('http://localhost:8000/api/club/club_profile', {
            method: "POST",
            body: formData
        }).then( data => data.json()).then(
            data => {
                console.log(data);
                setclubDetails(data);
                // props.setUser(data.type_of_user)
                setPreview(data.profile)
            }
        ).catch(e => console.log(e))
    }

    useEffect(() => {
        // fetch('http://127.0.0.1:8000/api/profile_club/' + get_title(user))
        // console.log(user);
        let token = localStorage.getItem('token');
        fetchdetails(token);
        console.log("tHIS Page")
    }, [])

    
    

    const handleChange = (e) => {
        e.preventDefault();
        const changename= e.target.name;
        const changevalue = e.target.value;
        console.log(changename, changevalue, 'Hello');
        if(changename === 'profile'){
            if(e.target.files[0]) {
                setclubDetails({...clubDetails, 
                    // profile_image: URL.createObjectURL(e.target.files[0])
                    profile: e.target.files[0]
                });
                setPreview(URL.createObjectURL(e.target.files[0]));
            }   
        }else{
            setclubDetails({...clubDetails, [changename]: changevalue});
        }
        console.log(clubDetails.name)
    };

    const handleSubmit = () => {
        let formData = new FormData();
        formData.append("token", localStorage.getItem('token'));
        for (const property in clubDetails) {
            formData.append(property, clubDetails[property])
            console.log(property, clubDetails[property], formData[property]);
        }
        console.log(formData.tag_line);
        fetch('http://localhost:8000/api/club/profile_club_create',
        {
            method: 'POST',
            body: formData
        }).then( data => data.json()).then(

            data => {console.log(data)
            // <Redirect to='/' />
            history.push('/');
        }
        );
    }

    return (
        <div>

            <Navbar />
            <div className='club-home'>
            <div>
                <Header title={clubDetails.title}/>
            </div>
            <div className='club-profile-form-container'>
                <h2 className='edit-profile-welcome'>Edit Profile</h2>
            <form className='club-profile-form'>
                <div className='club-profile-image-upload'>
                    <img src={preview} style={{ height : '280px'}} ></img>
                        
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
                <div className='club-profile-save-container'>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Save
                    </Button>
                </div>
            </form>
            </div>
            </div>
        </div>
    )
}

export default HomeEdit
