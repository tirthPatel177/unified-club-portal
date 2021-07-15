import React, {useState, useEffect} from 'react'
import Header from './../header/index'
import { Button } from '@material-ui/core'
import profile from './../../../../Resources/club-profile.jpg'

const ImageUpload = (props) => {
    let placeholder = null;

    const [{alt, src}, setImg] = useState({
        src: placeholder,
        alt: 'Upload an Image'
    });

    const handleImg = (e) => {
        if(e.target.files[0]) {
            setImg({
                src: URL.createObjectURL(e.target.files[0]),
                alt: e.target.files[0].name
            });    
        }   
    }

    // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
        placeholder = props.profile;
    }, [])


    return (
        <div>
            <form>
                <input 
                    type="file" 
                    accept=".png, .jpg, .jpeg" 
                    id="photo" 
                    className="visually-hidden"
                    onChange={handleImg}
                />
                <img></img>

            </form>
            {/* <input type='file' onChange={onSelectFile} />
            {!selectedFile ?  <img src={props.profile} /> : selectedFile &&  <img src={preview}/>  } */}
        </div>
    )
}

const HomeEdit = (props) => {
    return (
        <div>
            <div>
                <Header edit={props.edit} setEdit={props.setEdit}/>
            </div>
            <form>
                <input
                    accept="image/*"
                    // className={classes.input}
                    style={{ display: 'none' }}
                    id="raised-button-file"
                    multiple
                    type="file"
                    />
                <label htmlFor="raised-button-file">
                <Button variant="raised" component="span" 
                // className={classes.button}
                >
                    Upload
                </Button>
                </label> 
            </form>
            <ImageUpload profile={props.profile}/>
        </div>
    )
}

export default HomeEdit
