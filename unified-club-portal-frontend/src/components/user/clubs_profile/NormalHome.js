import React, {useState, useEffect} from 'react'
import About from "./about/index";
// import Work from "./work/index";
import Header from "./header/index";
import './NormalHome.css'
import Description from './description/index'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';


const NormalHome = (props) => {

    const [checked, setchecked] = useState(false);

    const handleChange = () => {

        let formData = new FormData();
        formData.append("token", localStorage.getItem("token"));
        formData.append("title", club.split('-').join(' '));
        if(!checked){
            fetch('http://127.0.0.1:8000/api/club/member_add',{
                method: "POST",
                body: formData
            })
        }else{
            fetch('http://127.0.0.1:8000/api/club/member_delete',{
                method: "POST",
                body: formData
            })
        }
        setchecked(!checked)
    };

    let {club} = useParams();

    useEffect(() => {
        let formData = new FormData();
        formData.append("token", localStorage.getItem("token"));
        formData.append("title", club.split('-').join(' '));
        fetch('http://127.0.0.1:8000/api/club/is_member',{
                method: "POST",
                body: formData
            }).then(
                data => data.json()
            ).then(
                data => {
                    if(data.user === 'true'){
                        setchecked(true)
                    }else{
                        setchecked(false);
                    }
                    
                    console.log(data.user)
                }
            )
    },[])

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
            <section id='contact'>
            <FormControlLabel
                label={
                    checked ? "You are a member" : "Become a member"
                }
                control={   
                <Switch
                    checked={checked ? true: false}
                    onChange={handleChange}
                    name="checked"
                    color="primary"
                />
                }
                
            />
            </section>
            </div>
        </div>
    )
}

export default NormalHome
