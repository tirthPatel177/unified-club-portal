import React,{useState, useRef, useEffect} from 'react'
import Navbar from './../Navbar/Navbar';
import './CreateClub.css'
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Input from '@material-ui/core/Input';
import { Button } from '@material-ui/core'
import TextField from '@material-ui/core/TextField';
import { useSelector } from 'react-redux'
// import Error404 from '../../Error/Error404';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { useHistory } from "react-router-dom";

const CreateClub = () => {


     const ref = useRef(0)

    const { enqueueSnackbar } = useSnackbar();

    const handleClickVariant = (variant, message) => () => {
        // variant could be success, error, warning, info, or default
         enqueueSnackbar(message, { variant });   
        
    };

    let history = useHistory();

    const [submitted, setsubmitted] = useState(false)

    const user = useSelector(state => state.type_of_user)
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
        // console.log(changename, changevalue, 'Hello');
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
        // console.log(clubDetails.name)
    };


    const handleSubmit = () => {
        let iserror = false
        // e.preventDefault();
        if(password1 !== clubDetails.password){
            // Create UI For this
            handleClickVariant('error', "Passwords are not matching!")()
            // console.log();
            return;
        }else if(clubDetails.title === ''){
            handleClickVariant('error', "Club Title can not be empty!")()
            // console.log();
            return;
        }
        fetch('http://localhost:8000/api/clubs',{
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(clubDetails)
        }).then( data => data.json()).then(
            data => {
                console.log(data)
                if(data.success){
                    handleClickVariant('success', data.success)()
                }else if(data.email){
                    handleClickVariant('success', "Club Profile Created!")()
                    ref.current = 1
                    // iserror = 'email'
                }
                else if(data.error){
                    handleClickVariant('error', data.error)()

                    iserror = true;
                }else{
                    for (const property in data){
                        handleClickVariant('error', data[property])()
                    }
                    iserror = true;
                }
                
            }
        )

        if(ref === 1){
            console.log("Hello")
            ref.current = 0
            setTimeout(history.push('/'), 2000);
        }

        // setTimeout(() => setsubmitted(true), 2500);
        
        if(iserror){
            // console.log("It")
            
            return;
        }

        
            // let errorType = Object.keys(data);
            // console.log(errorType[0], errorType);
            //     // alert(data[errorType[0]])
            //     setError(data[errorType[0]]);
        
    }

    // useEffect(() => {
    //     if(submitted === true){
    //         const timer = setTimeout(() => history.push(`/`), 1500);
    //         return () => clearTimeout(timer);
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [submitted])

    return (
        <>
        { (user === 'vbekfka29') ? 
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
                                Create Club
                            </Button>
                        </div>
                    
                </form>
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

export default function AdminCreateClubProfile() {
    return (
      <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
        <CreateClub />
      </SnackbarProvider>
    );
  }