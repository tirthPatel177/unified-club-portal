import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
// import { useParams } from 'react-router-dom'
import Navbar from './../NavBar/Navbar'
import HomeEdit from './EditHome/HomeEdit';
import NormalHome from './NormalHome/NormalHome';
import './Home.css'
import tempImage from './../../../Resources/club-profile.jpg'

const Home = () => {
    const user = useSelector(state => state.user)
    // const {club} = useParams();
    const [edit, setedit] = useState(false);
    const [clubDetails, setclubDetails] = useState(
        {
            title: 'Programming Club',
            tag_line: 'We are computer geeks who love programming!',
            profile: tempImage,
            description: `Mollit quis voluptate fugiat cupidatat enim sit aute voluptate dolor 
            velit reprehenderit. Esse anim do cillum occaecat voluptate duis magna velit. 
            Quis eu commodo culpa dolore reprehenderit. In sit est esse quis voluptate consequat 
            labore anim. Consequat nulla deserunt in mollit labore deserunt exercitation mollit nisi
             tempor occaecat consequat quis. Sint irure reprehenderit culpa ad ea sint non veniam enim 
             occaecat ipsum ad ad mollit. Consequat sit in aute do quis Lorem officia deserunt incididunt 
             veniam aliqua cupidatat sint est.`,
            
        }
    );

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
                        !edit ? <NormalHome club={clubDetails} edit={edit} setEdit={setedit}/> : <HomeEdit club={clubDetails} edit={edit} setEdit={setedit}/>
                    }
                </div>
        </div>
    )
}

export default Home
