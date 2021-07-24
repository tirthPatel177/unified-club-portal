import React from 'react'
import About from "./about/index";
// import Work from "./work/index";
import Header from "./../header/index";
import './NormalHome.css'
import Calendar from './Calendar/Calendar';
import Description from './description/index'

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
                <Calendar club={props.club.title}/>
            </section>
            </div>
        </div>
    )
}

export default NormalHome
