import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
// import { useParams } from 'react-router-dom'
import Navbar from './../NavBar/Navbar'
import HomeEdit from './EditHome/HomeEdit';
import NormalHome from './NormalHome/NormalHome';
import './Home.css'
// import tempImage from './../../../Resources/club-profile.jpg'

const Home = () => {
    const user = useSelector(state => state.user)
    // const {club} = useParams();
    // const [edit, setedit] = useState(false);
    const [clubDetails, setclubDetails] = useState(
        {}
    );

    const fetchdetails =  (token) => {
        let formData = new FormData();
        formData.append("token", token);
        fetch('http://localhost:8000/api/club/club_profile', {
            method: "POST",
            body: formData
        }).then( data => data.json()).then(
            data => {
                console.log(data);
                setclubDetails(data);
                // props.setUser(data.type_of_user)
                
            }
        ).catch(e => console.log(e))
    }

    const get_title = (title) => {
        console.log(title);
        return title.split(' ').join('-');
    }

    useEffect(() => {
        // fetch('http://127.0.0.1:8000/api/profile_club/' + get_title(user))
        // console.log(user);
        let token = localStorage.getItem('token');
        fetchdetails(token);
    }, [])

    // http://127.0.0.1:8000/api/profile_club/Programming-Club
    
    return (
        <div>
                <Navbar />
                {/* <p> { user.first_name } </p>
                <p> { user.type_of_user } </p> */}
                {/* <ClubProfile /> */}
                <div className='club-home'>
                    {/* {
                        !edit ? <NormalHome club={clubDetails} edit={edit} setEdit={setedit}/> : <HomeEdit club={clubDetails} edit={edit} setEdit={setedit}/>
                    } */}
                    <NormalHome club={clubDetails} />
                </div>
        </div>
    )
}

export default Home
