import React from 'react'
import About from "./about/index";
// import Work from "./work/index";
import Header from "./header/index";
import './NormalHome.css'
import Description from './description/index'

const NormalHome = (props) => {
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
            <section id='contact'>

            </section>
            </div>
        </div>
    )
}

export default NormalHome
