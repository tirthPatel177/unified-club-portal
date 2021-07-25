import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../../user/NavBar/Navbar';
import './Home.css'
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
import { SnackbarProvider, useSnackbar } from 'notistack';
import { useSelector } from 'react-redux'
// import Error404 from './../../Error/Error404'

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

const useStyles = makeStyles({
  root: {
    // width: 200,
    display: 'flex',
    alignItems: 'center',
  },
});

const Home = () => {
    const user = useSelector(state => state.type_of_user)
    const { enqueueSnackbar } = useSnackbar();

    const handleClickVariant = (variant, message) => () => {
        // variant could be success, error, warning, info, or default
         enqueueSnackbar(message, { variant });   
        
    };

    const [value, setValue] = useState(0);
    const [hover, setHover] = useState(-1);
    const classes = useStyles();

    let {id} = useParams();

    const [register, setregister] = useState(
        {
            mobile_no: '',
            roll_no: ''
        }
    )

    // let averageRating = 0;

    const [isreg, setisreg] = useState(false);

    const [event, setevent] = useState({
        date: ''
    });
    

    const handleChange = (e) => {
        e.preventDefault();
        const changename= e.target.name;
        const changevalue = e.target.value;
        console.log(changename, changevalue, 'Hello');
        setregister({...register, [changename]: changevalue});
        
    };


    const handleSubmit = () => {
        // let iserror = false
        let formData = new FormData();
        formData.append("token", localStorage.getItem('token'));
        formData.append('id_event', id);

        if(register["mobile_no"] === ''){
            handleClickVariant('error', "Mobile No. is Required!")()
            return;
        }
        else if (register["roll_no"] === ''){
            handleClickVariant('error', "Roll No. is Required!")()
            return;
        }

        for (const property in register) {
            formData.append(property, register[property])
            console.log(property, register[property], formData[property]);
        }
        // console.log(formData.tag_line);

        fetch('http://localhost:8000/api/club/event_register',
        {
            method: 'POST',
            body: formData
        }).then( data => data.json()).then(
            data => {
                if(data.success){
                    handleClickVariant('success', data.success)()
                }else if(data.error){
                    handleClickVariant('error', data.error)()
                    // iserror = true;
                }else{
                    for (const property in data){
                        handleClickVariant('error', data[property])()
                    }
                    // iserror = true;
                }
                
            }
        )
        setisreg(!isreg);
    }


    const fetchEventDetails = () => {
        let formData = new FormData();
        formData.append('id_event', id)
        formData.append("token", localStorage.getItem('token'));
        fetch('http://127.0.0.1:8000/api/club/event_data_id',
        {
            method: 'POST',
            body: formData
        }).then( data => data.json()).then(
            data => {setevent(data)
                // console.log(typeof(data.rating))
                // averageRating = data.rating;
            }
        )
    }


    const checkReg = () => {
        let formData = new FormData();
        formData.append("token", localStorage.getItem('token'));
        formData.append('id_event', id);
        fetch("http://127.0.0.1:8000/api/club/is_registered",{
            method: 'POST',
            body: formData
        }).then(data => data.json()).then(
            data => {
                if(data.user === 'false'){
                    setisreg(false)
                }else{
                    setisreg(true)
                }
            }
        )

    }

    const handle_unreg = () => {
        let iserror = false
        let formData = new FormData();
        formData.append("token", localStorage.getItem('token'));
        formData.append('id_event', id);
        fetch('http://127.0.0.1:8000/api/club/event_unregister', {
            method: 'POST',
            body: formData
        }).then(data => data.json()).then(
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
            return;
        }
        setisreg(!isreg)
    }

    const update_views = () => {
        let fromData = new FormData();
        fromData.append('token', localStorage.getItem('token'));
        fromData.append('id_event', id);
        fetch('http://127.0.0.1:8000/api/club/event_view', {
            method: 'POST',
            body: fromData
        })
    }

    useEffect(() => {
        console.log(id);
        fetchEventDetails();
        checkReg();
        update_views();
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

    const handleRatingSubmit = () => {
        // let iserror = false;
        let formData = new FormData();
        formData.append("token", localStorage.getItem('token'));
        formData.append('event_title', event.event_title);
        formData.append('rating', value);
        fetch('http://127.0.0.1:8000/api/user/rating', {
            method: 'POST',
            body: formData
        }).then(data => data.json()).then(
            data => {
                if(data.success){
                    handleClickVariant('success', data.success)()
                }else if(data.error){
                    handleClickVariant('error', data.error)()
                    // iserror = true;
                }else{
                    for (const property in data){
                        handleClickVariant('error', data[property])()
                    }
                    // iserror = true;
                }
                
            }
        )
        

    }

    return (
        <>
        { (user === 'cmkua43qrh') ? 
        <div>
        <Navbar />
        <div className='marginer'>
            <div className='event-home-card'>
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

                <h3 className='register-heading'>
                        Rate this event
                </h3>

                <div className='actual-event-register-from'>
                    <div className={classes.root}>

                    <Rating
                        name="hover-feedback"
                        value={value}
                        precision={0.5}
                        onChange={(event, newValue) => {
                        setValue(newValue);
                        }}
                        onChangeActive={(event, newHover) => {
                        setHover(newHover);
                        }}
                    />
                    {value !== null && <Box ml={2}>{labels[hover !== -1 ? hover : value]}</Box>}
                    
                    </div>

                    <div className='event-register-button-container'>
                            <Button variant="contained" color="primary" 
                            onClick={handleRatingSubmit}
                            >
                                Save Rating
                            </Button>
                        </div>

                    
                </div>

                { isreg ? 
                    <div className='event-register-button-container'>
                    <Button variant="contained" color="primary" 
                    onClick={handle_unreg}
                    >
                        Un-register
                    </Button>
                    </div>
                :
                <div className='register-from'>
                    <h3 className='register-heading'>
                        Register
                    </h3>
                    <form className='actual-event-register-from'>
                        <div className='form-marginer'>
                        <FormControl >
                            <InputLabel htmlFor="mobile_no">Mobile Number</InputLabel>
                            <Input name='mobile_no' id="mobile_no" 
                            value={register.mobile_no} 
                            onChange={handleChange}  
                            required/>
                        </FormControl>
                        </div>
                            {/* <MuiPhoneNumber 
                        name='mobile_no'
                        placeholder='Phone Number'
                        defaultCountry='in'
                        onlyCountries={'in'}
                        // onChange={handleOnChange}
                        /> */}
                        
                        <div className='form-marginer'>
                        <FormControl >
                            <InputLabel htmlFor="roll_no">Roll Number</InputLabel>
                            <Input name='roll_no' id="roll_no" 
                            value={register.roll_no} 
                            onChange={handleChange}  
                            required/>
                        </FormControl>
                        </div>

                        <div className='event-register-button-container'>
                            <Button variant="contained" color="primary" 
                            onClick={handleSubmit}
                            >
                                Register
                            </Button>
                        </div>
                    </form>
                </div>
                }   
            </div>
        </div>
        </div>
        // : <Error404 />
        :
        null
        }
        </>
    )
};

export default function IntegrationNotistack() {
    return (
      <SnackbarProvider maxSnack={3} autoHideDuration={1500}>
        <Home />
      </SnackbarProvider>
    );
  }
