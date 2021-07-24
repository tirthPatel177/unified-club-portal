import React, {useState} from 'react'
import './CheckIn.css'
import {useEffect} from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const CheckIn = (props) => {

    const [checkedin, setcheckedin] = useState(props.checkin.check_in)

    useEffect(() => {
        console.log(`${props.checkin.first_name} ${props.checkin.last_name}`)
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <div className='registered-details'>
            <p className='registered-name'>
                {`${props.checkin.first_name} ${props.checkin.last_name}`}
            </p>
            <p className='registered-email'>
                {props.checkin.email}
            </p>
            </div>
            <div className='registered-action'>
            <FormControlLabel
                control={
                <Checkbox
                    checked={checkedin}
                    onChange={handleChange}
                    name="visible"
                    color="primary"
                    size='medium'
                />
                }
                label=""
            />
            </div>
        </div>
    )
}

export default CheckIn
