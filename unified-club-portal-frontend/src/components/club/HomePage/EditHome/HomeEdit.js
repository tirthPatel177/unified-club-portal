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
import { SnackbarProvider, useSnackbar } from 'notistack';
import Error404 from '../../../Error/Error404';
import { useSelector } from 'react-redux'


const HomeEdit = (props) => {
    const user = useSelector(state => state.type_of_user)
    const [clubDetails, setclubDetails] = useState(
        {
            title: '',
            tag_line: '',
            description: '',
            profile: ''
        }
    )

    const [old_title, setold_title] = useState('')

    const { enqueueSnackbar } = useSnackbar();

    const handleClickVariant = (variant, message) => () => {
        // variant could be success, error, warning, info, or default
         enqueueSnackbar(message, { variant });   
        
    };

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
                setold_title(data.title)
            }
        ).catch(e => console.log(e))
    }

    useEffect(() => {
        // fetch('http://127.0.0.1:8000/api/profile_club/' + get_title(user))
        // console.log(user);
        let token = localStorage.getItem('token');
        fetchdetails(token);
        // console.log("tHIS Page")
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const [submited, setsubmited] = useState(false)

    const handleSubmit = () => {
        let iserror = false;

        let formData = new FormData();
        formData.append("token", localStorage.getItem('token'));
        formData.append('old_title', old_title);
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
            data => {
                if(data.success){
                    handleClickVariant('success', data.success)()
                }else if(data.error){
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
        if(iserror){
            console.log("It")
            return;
        }else{
        setsubmited(true);
        }
    }

    useEffect( () => {
        if(submited === true){
        const timer = setTimeout(() => history.push(``), 1500);
        return () => clearTimeout(timer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submited])

    return (
        <>
            { (user === 'xhuoxfn3') ?  
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
                    <img src={preview} style={{ height : '280px'}} alt='poster' ></img>
                        
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
        :
        <Error404/> 
        }
        </>
    )
}

export default function IntegrationNotistack() {
    return (
      <SnackbarProvider maxSnack={3} autoHideDuration={1500}>
        <HomeEdit />
      </SnackbarProvider>
    );
  }
