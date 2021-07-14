import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
// import { useParams } from 'react-router-dom'
import Navbar from './../NavBar/Navbar'
import HomeEdit from './EditHome/HomeEdit';
import NormalHome from './NormalHome/NormalHome';
import './Home.css'

const Home = () => {
    const user = useSelector(state => state.user)
    // const {club} = useParams();
    const [edit, setedit] = useState(false);
    const [clubDetails, setclubDetails] = useState([]);

    const get_title = (title) => {
        console.log(title);
        return title.split(' ').join('-');
    }

    useEffect(() => {
        // fetch('http://127.0.0.1:8000/api/profile_club/' + get_title(user))
        console.log(user);
    })

    // http://127.0.0.1:8000/api/profile_club/Programming-Club
    
    return (
        <div>
                <Navbar />
                {/* <p> { user.first_name } </p>
                <p> { user.type_of_user } </p> */}
                {/* <ClubProfile /> */}
                <div className='club-home'>
                {
                    edit ? <HomeEdit club={clubDetails} /> : <NormalHome club={clubDetails}/>
                }
                </div>
        </div>
    )
}

export default Home
