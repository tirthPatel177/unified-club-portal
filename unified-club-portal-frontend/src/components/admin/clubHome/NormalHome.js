import React from 'react'
import About from "./about/index";
// import Work from "./work/index";
import Header from "./header/index";
import './NormalHome.css'
import Description from './description/index'
// import { useParams } from 'react-router-dom';
import Calendar from './Calendar/Calendar';


const NormalHome = (props) => {

    // let {club} = useParams();

    

    // useEffect(() => {
    //     let formData = new FormData();
    //     formData.append("token", localStorage.getItem("token"));
    //     formData.append("title", club.split('-').join(' '));
    //     if(checked){
    //         fetch('http://127.0.0.1:8000/api/club/member_add',{
    //             method: "POST",
    //             body: formData
    //         })
    //     }else{
    //         fetch('http://127.0.0.1:8000/api/club/member_delete',{
    //             method: "POST",
    //             body: formData
    //         })
    //     }
    // }, [checked])

    return (
        <div className='home'>

            <div>
                <Header />
            </div>
        
            <div className="body">
            <section id="about">
                <About club={props.club}/>
            </section>
            <section id='description'>
                <Description club={props.club}/>
            </section>
            
            <section id='calendar'>
                <Calendar />
            </section>
            </div>
        </div>
    )
}

export default NormalHome