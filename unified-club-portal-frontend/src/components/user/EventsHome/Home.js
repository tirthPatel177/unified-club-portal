import React, {useEffect} from 'react'
import { useParams } from 'react-router-dom'

const Home = () => {

    let {id} = useParams();

    useEffect(() => {
        console.log(id);
    }, [])

    const data = {
        id: 1,
        club_name: "Programming Club",
        date: "2021-07-15T12:00:00",
        event_description: "<h2>Hello from CKEditor 5!</h2><p>Happy Diwali</p>",
        event_title: "Trees in DSA",
        poster: "http://127.0.0.1:8000/images/default.jpg",
        profile_pic: "http://127.0.0.1:8000/profile_imgs/guitar.jpg"
    }

    return (
        <div>
            {data.event_description}
        </div>
    )
}

export default Home
