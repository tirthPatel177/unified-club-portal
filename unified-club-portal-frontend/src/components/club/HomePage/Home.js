import React, {useState, useEffect, useRef} from 'react'
import { useSelector } from 'react-redux'
// import { useParams } from 'react-router-dom'
import Navbar from './../NavBar/Navbar'
import HomeEdit from './EditHome/HomeEdit';
import NormalHome from './NormalHome/NormalHome';
import './Home.css'
// import tempImage from './../../../Resources/club-profile.jpg'
import CircularProgress from '@material-ui/core/CircularProgress';

const Home = () => {
    const user = useSelector(state => state.user)
    // const {club} = useParams();
    // const [edit, setedit] = useState(false);
    const [clubDetails, setclubDetails] = useState(
        {}
    );

    const [clubtitle, setclubtitle] = useState(' ')

    const [isloading, setisloading] = useState(true);

    const fetchdetails =  (token) => {
        let formData = new FormData();
        formData.append("token", token);
        fetch('http://localhost:8000/api/club/club_profile', {
            method: "POST",
            body: formData
        }).then( data => data.json()).then(
            data => {
                // console.log(data);
                setclubDetails(data);
                // props.setUser(data.type_of_user)
                setclubtitle(data.title);
            }
        ).catch(e => console.log(e))
    }

    const get_title = (title) => {
        console.log(title);
        return title.split(' ').join('-');
    }

    const isFirstRender = useRef(0)

    useEffect(() => {
        // fetch('http://127.0.0.1:8000/api/profile_club/' + get_title(user))
        // console.log(user);
        let token = localStorage.getItem('token');
        fetchdetails(token);
        
    }, [])

    useEffect(() => {
        if (isFirstRender.current === 0) {
            isFirstRender.current = 1
            
            return;
        }else if(isFirstRender.current === 1){
            setisloading(false);
            // console.log('Something Happened')
        }

    }, [clubtitle])

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
                    {
                        isloading ? 
                        <div style={{ margin: '0 auto', 'textAlign' : 'center'}}>
                        <CircularProgress />
                        </div>
                        :
                    <NormalHome club={clubDetails} clubtitle={clubtitle} />
                    }
                </div>
        </div>
    )
}

export default Home
