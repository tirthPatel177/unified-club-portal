import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import ClubCard from './ClubCard';
import Navbar from '../NavBar/Navbar';
import './Home.css'

const Home = () => {
    const user = useSelector(state => state.user)
    const [clubs, setClubs] = useState([]);

    const get_clubs = async () => {
        fetch('http://127.0.0.1:8000/api/clubs_all', {
            method : 'GET'
        }).then(
            data => data.json()
        ).then(data => {
            setClubs(data);
            console.log(data);
        })
    };

    useEffect(() => {
        get_clubs();
        console.log(clubs);
    }, [])

    // const selected_club = (title) => {
    //     fetch('http://127.0.0.1:8000/api/profile_club/' + title, {
    //         method: GET
    //     }).then(
    //         data => data.json()
    //     ).then(
            
    //     )

    // }

    return (
        <>
            { user !== 'user' ? null : 
            <div>
                {/* <p> { user.email }</p>
                <p> {user.first_name } </p>
                <p> { user.type_of_user } </p> */}
                <Navbar />
                <div className='club-list-container'>
                {
                    clubs.map( club => 
                        {
                            return <ClubCard club={club} key={club.id}/>
                        }
                    )
                }
                {
                    clubs.map( club => 
                        {
                            return <ClubCard club={club} key={club.id}/>
                        }
                    )
                }
                </div>
            </div>
            } 
        </>
    )
}

export default Home
