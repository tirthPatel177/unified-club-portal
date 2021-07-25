import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import ClubCard from './ClubCard';
import Navbar from '../NavBar/Navbar';
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
            console.log(data);
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

    return (
        <>
            { (user === 'cmkua43qrh') ? 
            <div>
                {/* <p> { user.email }</p>
                <p> {user.first_name } </p>
                <p> { user.type_of_user } </p> */}
                <Navbar />
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
            : null
            } 
        </>
    )
}

export default Home
