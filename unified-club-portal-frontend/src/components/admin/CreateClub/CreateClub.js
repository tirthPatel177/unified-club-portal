import React,{useState} from 'react'
import Navbar from './../Navbar/Navbar';
import './CreateClub.css'
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Input from '@material-ui/core/Input';
import { Button } from '@material-ui/core'
import TextField from '@material-ui/core/TextField';



const CreateClub = () => {

    const [clubDetails, setclubDetails] = useState({
        email: '',
        password: '',
        title: '',
        tag_line: '',
        description: '',
        profile_image: ''
    });

    const [password1, setpassword1] = useState('');
    const [preview, setPreview] = useState('');

    const handleChange = (e) => {
        e.preventDefault();
        const changename= e.target.name;
        const changevalue = e.target.value;
        console.log(changename, changevalue, 'Hello');
        if(changename === 'profile_image'){
            if(e.target.files[0]) {
                setclubDetails({...clubDetails, 
                    // profile_image: URL.createObjectURL(e.target.files[0])
                    profile_image: e.target.files[0]
                });
                setPreview(URL.createObjectURL(e.target.files[0]));
            }   
        }else{
            setclubDetails({...clubDetails, [changename]: changevalue});
        }
        console.log(clubDetails.name)
    };


    const handleSubmit = () => {
        // e.preventDefault();
        if(password1 !== clubDetails.password){
            // Create UI For this
            console.log("Passwords are not matching!");
            return;
        }
        fetch('http://localhost:8000/api/clubs',{
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(clubDetails)
        }).then( data => data.json()).then(
            data => {console.log(data)
            // let errorType = Object.keys(data);
            // console.log(errorType[0], errorType);
            //     // alert(data[errorType[0]])
            //     setError(data[errorType[0]]);
            }
        ) 
        
    }

    return (
        <div>
            <Navbar />
            <div className='create-club-from-container'>
                <div className='create-club-form'>
                    <h2 className='create-club-welcome'>Create Club</h2>
                <form className='createClub-form'>
                    {/* <div className='form-marginer'>
                    
                    <FormControl style={limitwidth}>
                        <InputLabel htmlFor="email">Email</InputLabel>
                        <Input name='email' id="email" value={clubDetails.email} onChange={handleChange}  required/>
                    </FormControl>
                    </div> */}

                    <div className='form-marginer'>
                    <FormControl variant="outlined">
                        <InputLabel htmlFor="component-outlined">Email</InputLabel>
                        <OutlinedInput name='email' id="component-outlined" value={clubDetails.email} onChange={handleChange} label="email" />
                    </FormControl>
                    </div>

                    <div className='form-marginer'>
                    
                    <FormControl variant="outlined">
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <OutlinedInput name='password' type='password' id="component-outlined" value={clubDetails.password} onChange={handleChange} label="password" />
                    </FormControl>
                    </div>

                    <div className='form-marginer'>
                    
                    <FormControl variant="outlined">
                        <InputLabel htmlFor="password-again">Password again</InputLabel>
                        <OutlinedInput name='password1' type='password' id="password1" value={password1} onChange={(e)=>{setpassword1(e.target.value)}} label="password-again" />
                    </FormControl>
                    </div>

                    <h2 className='create-club-welcome'>Club Details</h2>
                    <div className='form-marginer'>
                    
                    <FormControl >
                        <InputLabel htmlFor="title">Club Title</InputLabel>
                        <Input name='title' id="title" value={clubDetails.title} onChange={handleChange}  required/>
                    </FormControl>
                    </div>

                    {/* <div className='form-marginer'> */}
                        <div className='club-profile-image-upload'>
                        {preview ? <img src={preview} style={{ height : '280px'}} alt='club-profile'></img> : null}
                            
                            <div className="club-image-upload-button-area">
                                <h3> Profile Photo </h3>
                                <input 
                                    type="file" 
                                    accept=".png, .jpg, .jpeg" 
                                    id="photo" 
                                    name='profile_image'
                                    className="club-image-upload-button"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    {/* </div> */}
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

export default CreateClub
