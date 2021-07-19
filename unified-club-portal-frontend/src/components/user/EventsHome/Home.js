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

const Home = () => {

    let {id} = useParams();

    const [register, setregister] = useState(
        {
            mobile_no: '',
            roll_no: ''
        }
    )


    const handleChange = (e) => {
        e.preventDefault();
        const changename= e.target.name;
        const changevalue = e.target.value;
        console.log(changename, changevalue, 'Hello');
        setregister({...register, [changename]: changevalue});
        
    };


    const handleSubmit = () => {
        let formData = new FormData();
        formData.append("token", localStorage.getItem('token'));
        formData.append('id', );
        for (const property in register) {
            formData.append(property, register[property])
            console.log(property, register[property], formData[property]);
        }
        // console.log(formData.tag_line);
        fetch('http://localhost:8000/api/club/profile_club_create',
        {
            method: 'POST',
            body: formData
        }).then( data => data.json()).then(

            data => {console.log(data)
            // <Redirect to='/' />
        }
        );
    }

    useEffect(() => {
        console.log(id);
    }, [])

    const data = {
        id: 1,
        club_name: "Programming Club",
        date: "2021-07-15T12:00:00",
        event_description: "<h2>Hello from CKEditor 5!</h2><p>Happy Diwali</p>",
        event_title: "Trees in DSA",
        poster: "http://127.0.0.1:8000/images/default.jpg",
        profile_pic: "http://127.0.0.1:8000/profile_imgs/guitar.jpg"
    }

    return (
        <div>
        <Navbar />
        <div className='marginer'>
            <div className='event-home-card'>
                <main>
                    <h2 className='event-title'>
                        {data.event_title}
                    </h2>
                    <div className='by-container'>
                        <h3>{data.date}</h3>
                        <h3>By {data.club_name}</h3>
                    </div>
                    <div className='event-poster'>
                        <img src={data.poster} alt='event poster'></img>
                    </div>
                    <div className='event-description'>
                        {ReactHtmlParser(data.event_description)}
                    </div>
                </main>
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
            </div>
        </div>
        </div>
    )
}

export default Home
