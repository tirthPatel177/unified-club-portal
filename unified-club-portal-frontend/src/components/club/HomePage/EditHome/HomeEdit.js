import React, {useState, useEffect} from 'react'
import Header from './../header/index'
import { Button } from '@material-ui/core'

const ImageUpload = (props) => {
    const [selectedFile, setSelectedFile] = useState()
    const [preview, setPreview] = useState()

    // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])

    const onSelectFile = e => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }

        // I've kept this example simple by using the first image instead of multiple
        setSelectedFile(e.target.files[0])
    }

    return (
        <div>
            <input type='file' onChange={onSelectFile} />
            {!selectedFile ?  <img src={props.profile} /> : selectedFile &&  <img src={preview}/>  }
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
