import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
// import { Redirect } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import ClubCard from './ClubCard';
import { Button } from '@material-ui/core'
import Navbar from './../Navbar/Navbar';
import './Home.css'
// import Error404 from '../../Error/Error404';

const Home = () => {
    const user = useSelector(state => state.type_of_user)
    const [clubs, setClubs] = useState([]);

    const get_clubs = async () => {
        fetch('http://127.0.0.1:8000/api/club/clubs_all', {
            method : 'GET'
        }).then(
            data => data.json()
        ).then(data => {
            setClubs(data);
            // console.log(data);
        })
    };

    useEffect(() => {
        get_clubs();
        // console.log(clubs);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // const selected_club = (title) => {
    //     fetch('http://127.0.0.1:8000/api/profile_club/' + title, {
    //         method: GET
    //     }).then(
    //         data => data.json()
    //     ).then(
            
    //     )

    // }

    let history = useHistory();

    const handleClick = () => {
        history.push("/create-club");
    }

    return (
        <>
            
            { (user === 'vbekfka29') ? 
            <div>

                {/* <p> { user.email }</p>
                <p> {user.first_name } </p>
                <p> { user.type_of_user } </p> */}
                <Navbar />

                <div className='create-club-button'>

                <Button onClick={handleClick} variant='outlined' color='primary'>
                    Create Club
                </Button>

                </div>

                <div className='club-list-container'>
                {
                    clubs.map( club => 
                        {
                            return <ClubCard club={club} key={club.title}/>
                        }
                    )
                }
                {
                    clubs.map( club => 
                        {
                            return <ClubCard club={club} key={club.title}/>
                        }
                    )
                }
                </div>
            </div>
            :
            null
            } 
        </>
    )
}

export default Home
