import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import Home from './NormalHome'
import './ClubProfile.css'
import Navbar from './../Navbar/Navbar'
import { useSelector } from 'react-redux'
import Error404 from '../../Error/Error404';

const ClubProfile = () => {
    const user = useSelector(state => state.type_of_user)

    const {club} = useParams();
    const [clubDetails, setclubDetails] = useState({
        title: '',
        description: '',
        
    })

    const fetch_club_detials = () => {
        fetch(`http://localhost:8000/api/club/profile_club/${club}`, {
            method: 'GET'
        }).then(
            data => data.json()
        ).then(
            data => {
            console.log(data);
            setclubDetails(data);
            }
        ).catch (error => {
            console.log(error)
        })
    }

    useEffect(()=> {
        fetch_club_detials();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
        { (user === 'vbekfka29') ? 
        <>
        <Navbar />
        <div className='.home'>
            <Home club={clubDetails}/>
        </div>
        </>
        :
        <Error404 />
        } 
    </>
    )
}

export default ClubProfile
