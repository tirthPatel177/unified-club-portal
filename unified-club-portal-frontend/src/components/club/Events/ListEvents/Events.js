import { Button } from '@material-ui/core';
import React, {useEffect, useState} from 'react'
import { useHistory, useParams } from 'react-router-dom';

const Events = () => {

    const history = useHistory();

    const [title, settitle] = useState('')

    const fetchdetails = async (token) => {
        let formData = new FormData();
        formData.append("token", token);
        fetch('http://localhost:8000/api/club/club_profile', {
            method: "POST",
            body: formData
        }).then( data => data.json()).then(
            data => {
                console.log(data);
                settitle(data.title);
                // props.setUser(data.type_of_user)
                
            }
        ).catch(e => console.log(e))
    }

    useEffect(() => {
        // fetch('http://127.0.0.1:8000/api/profile_club/' + get_title(user))
        // console.log(user);
        let token = localStorage.getItem('token');
        fetchdetails(token);
    }, [])


    const get_title = (title) => {
        // console.log(title);
        return title.split(' ').join('-');
    }



    const handleCreateEvent = () => {
        let path = `/${get_title(title)}/create-event`; 
        history.push(path);
    }


    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleCreateEvent}>
                Create Event
            </Button>
        </div>
    )
}

export default Events
