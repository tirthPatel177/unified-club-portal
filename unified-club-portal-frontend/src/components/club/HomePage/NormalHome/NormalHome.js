import React from 'react'
import About from "./about/index";
// import Work from "./work/index";
import Header from "./../header/index";
import './NormalHome.css'
import Calendar from './Calendar/Calendar';
import Description from './description/index'
// import ClubStats from './Stats/ClubStats';

const NormalHome = (props) => {
    return (
        <div>

            <div>
                <Header  title={props.club.title}/>
            </div>
        
            <div className="body">
            <section id="about">
                <About club={props.club}/>
            </section>
            <section id='description'>
                <Description club={props.club}/>
            </section>
            <section id='calendar'>
                <Calendar club={props.clubtitle}/>
            </section>
            {/* <section id='club-stats'>
                <ClubStats club={props.clubtitle}/>
            </section> */}
            </div>
        </div>
    )
}

export default NormalHome
