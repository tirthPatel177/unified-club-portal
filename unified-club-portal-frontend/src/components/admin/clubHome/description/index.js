import React from 'react'
import Separator from './../separator/index'
import './Description.css'

//  Reffered from https://www.youtube.com/watch?v=j0yZc2yfa7o&t=173s

const index = ({club}) => {
    return (
        <div className='description-section'>
            <Separator />
            <label className="section-title">About Us</label>
            <div className='description-container'>
                {
                <p>
                    {club.description}
                </p>
                }
            </div>
        </div>
    )
}

export default index
