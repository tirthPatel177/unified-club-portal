import React, {useState} from 'react'
import './CheckIn.css'
import {useEffect} from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const CheckIn = (props) => {

    const [checkedin, setcheckedin] = useState(props.checkin.check_in)

    useEffect(() => {
        console.log(`${props.checkin.first_name} ${props.checkin.last_name}`)
    },[])

    const handleChange = () => {
        let formData = new FormData();
        formData.append('user_email', props.checkin.email);
        formData.append('id_event', props.id_event)
        if(checkedin){
            fetch('http://127.0.0.1:8000/api/club/check_in_false', {
                method: 'POST',
                body: formData
            }).then(data => data.json())
        }else{
            fetch('http://127.0.0.1:8000/api/club/check_in_true', {
                method: 'POST',
                body: formData
            }).then(data => data.json())
        }
        setcheckedin(!checkedin);
    }

    return (
        <div className='checkin-container'>
            <p>
                {`${props.checkin.first_name} ${props.checkin.last_name}`}
            </p>
            <p>
                {props.checkin.email}
            </p>
            <FormControlLabel
                control={
                <Checkbox
                    checked={checkedin}
                    onChange={handleChange}
                    name="visible"
                    color="primary"
                />
                }
                label="Checked In"
            />
        </div>
    )
}

export default CheckIn
