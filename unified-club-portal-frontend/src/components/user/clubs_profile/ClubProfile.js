import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import Home from './NormalHome'
import './ClubProfile.css'
import Navbar from '../NavBar/Navbar'

const ClubProfile = () => {

    const {club} = useParams();
    const [clubDetails, setclubDetails] = useState([])

    const fetch_club_detials = () => {
        fetch('http://127.0.0.1:8000/api/club/profile_club/' + club, {
            method: 'GET'
        }).then(
            data => data.json()
        ).then(
            data => {
            // console.log(data);
            setclubDetails(data);
            }
        )
    }

    useEffect(()=> {
        
        let isSubscribed = true;
        fetch_club_detials();
        return () => (isSubscribed = false);
    }, [])

    return (
        <>
        <Navbar />
        <div className='.home'>
            <Home club={clubDetails}/>
        </div>
        </>
    )
}

export default ClubProfile
