import React from 'react'
import Separator from './../separator/index'
import './Description.css'

const index = ({club}) => {
    return (
        <div className='description-section'>
            <Separator />
            <label className="section-title">About Us</label>
            <div className='description-container'>
                {!club.description ?
                <p>
                    loreAnim aute ut minim aliquip in labore nostrud. Consectetur et est in aute non reprehenderit occaecat ut cillum adipisicing irure. Consectetur elit proident ipsum do laboris eu minim. Excepteur aute ad Lorem nostrud adipisicing ullamco consectetur consequat esse ullamco anim veniam et deserunt. Ea sit in irure labore cupidatat fugiat non. Sit cillum enim magna aliquip laborum ad veniam. Laborum occaecat dolore aute in enim ut incididunt ut occaecat cillum eu non.
                </p> :  
                    club.description
                }
            </div>
        </div>
    )
}

export default index
